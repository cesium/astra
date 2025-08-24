"use client";

import type React from "react";
import { useCallback, useState, useRef } from "react";
import { twMerge } from "tailwind-merge";
import clsx from "clsx";
import { z } from "zod";
import mime from "mime-types";

interface IFileUploaderProps {
  onFileChange?: (file: File | null) => void;
  maxSize?: number;
  allowedTypes?: string[];
  className?: string;
  disabled?: boolean;
}

interface ValidationError {
  message: string;
  type: "size" | "type";
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return (
    Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  );
}

function getFileTypeCategory(allowedTypes: string[]): string | null {
  const extensions = allowedTypes
    .map((type) => mime.extension(type))
    .filter((ext): ext is string => Boolean(ext))
    .map((ext) => ext.toUpperCase());

  if (extensions.length === 0) return null;

  if (extensions.length <= 3) {
    return extensions.join(", ");
  }

  return `${extensions.slice(0, 3).join(", ")} e mais ${extensions.length - 3}`;
}

function createFileSchema(maxSize?: number, allowedTypes?: string[]) {
  return z
    .instanceof(File)
    .refine(
      (file) => {
        if (!maxSize) return true;
        return file.size <= maxSize;
      },
      {
        message: `File exceeds the maximum size of ${formatFileSize(maxSize!)}`,
      },
    )
    .refine(
      (file) => {
        if (!allowedTypes || allowedTypes.length === 0) return true;
        return allowedTypes.includes(file.type);
      },
      {
        message:
          allowedTypes && allowedTypes.length > 0
            ? `Unsupported file type (${getFileTypeCategory(allowedTypes)})`
            : "Unsupported file type.",
      },
    );
}

export default function FileUploader({
  onFileChange,
  maxSize,
  allowedTypes,
  className,
  disabled = false,
}: IFileUploaderProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [validationError, setValidationError] =
    useState<ValidationError | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounterRef = useRef(0);

  const handleFile = useCallback(
    (file: File | null) => {
      if (!file || disabled) return;

      setValidationError(null);

      const fileSchema = createFileSchema(maxSize, allowedTypes);
      const result = fileSchema.safeParse(file);

      if (!result.success) {
        const error = result.error.issues[0];
        setValidationError({
          message: error.message,
          type: error.message.includes("size") ? "size" : "type",
        });
        return;
      }

      setSelectedFile(file);
      onFileChange?.(file);
    },
    [onFileChange, maxSize, allowedTypes, disabled],
  );

  const removeFile = useCallback(() => {
    setSelectedFile(null);
    setValidationError(null);
    onFileChange?.(null);
  }, [onFileChange]);

  const handleDragEnter = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (disabled) return;

      dragCounterRef.current++;
      if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
        setIsDragOver(true);
      }
    },
    [disabled],
  );

  const handleDragLeave = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (disabled) return;

      dragCounterRef.current--;
      if (dragCounterRef.current === 0) {
        setIsDragOver(false);
      }
    },
    [disabled],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (disabled) return;

      setIsDragOver(false);
      dragCounterRef.current = 0;

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleFile(e.dataTransfer.files[0]);
      }
    },
    [handleFile, disabled],
  );

  const handleClick = useCallback(() => {
    if (disabled) return;
    fileInputRef.current?.click();
  }, [disabled]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        handleFile(e.target.files[0]);
      }
      e.target.value = "";
    },
    [handleFile],
  );

  return (
    <div className={twMerge(clsx("w-full space-y-4", className))}>
      <div
        className={twMerge(
          clsx(
            "w-full cursor-pointer rounded-lg border-2 border-dashed transition-all duration-200 ease-in-out",
            "flex min-h-[200px] flex-col items-center justify-center p-4 text-center",
            "sm:min-h-[250px] sm:p-6 md:p-8",
            isDragOver
              ? "border-primary-400 bg-primary-400/20"
              : "border-black/20 bg-gray-50 hover:border-black/30 hover:bg-gray-100",
            disabled && "pointer-events-none opacity-50",
            validationError && !isDragOver && "border-red-300 bg-red-50",
          ),
        )}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleInputChange}
          className="hidden"
          disabled={disabled}
        />

        <div
          className={twMerge(
            clsx(
              "rounded-lg transition-all duration-200 ease-in-out",
              isDragOver ? "text-primary-400" : "text-black/50",
              validationError && !isDragOver && "text-red-400",
            ),
          )}
        >
          <span className="material-symbols-outlined text-5xl">
            {isDragOver ? "add" : "download"}
          </span>
        </div>

        {!isDragOver && (
          <div className="space-y-1 sm:space-y-2">
            <p
              className={twMerge(
                clsx(
                  "font-semibold transition-colors duration-200",
                  "text-black/50",
                ),
              )}
            >
              Drag and drop your file here
            </p>
            <p
              className={twMerge(
                clsx("transition-colors duration-200", "text-black/50"),
              )}
            >
              or{" "}
              <span
                className={twMerge(
                  clsx(
                    "underline transition-colors duration-200 hover:no-underline",
                    "text-primary-400 hover:text-primary-600",
                  ),
                )}
              >
                open a file from your computer
              </span>
            </p>
            <div className="mt-2 space-y-1 text-xs text-gray-400">
              {maxSize && <p>Maximum Size: {formatFileSize(maxSize)}</p>}
              {allowedTypes &&
                allowedTypes.length > 0 &&
                getFileTypeCategory(allowedTypes) && (
                  <p>Supports: {getFileTypeCategory(allowedTypes)}</p>
                )}
            </div>
          </div>
        )}
      </div>

      {validationError && (
        <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
          <span className="material-symbols-outlined mt-0.5 text-lg text-red-500">
            error
          </span>
          <div className="flex-1">
            <p className="text-sm font-medium text-red-800">Validation error</p>
            <p className="mt-1 text-sm text-red-700">
              {validationError.message}
            </p>
          </div>
          <button
            onClick={() => setValidationError(null)}
            className="text-red-400 transition-colors hover:text-red-600"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>
      )}

      {selectedFile && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-700">Selected File</h3>

          <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-3">
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <span className="material-symbols-outlined text-base">
                description
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-900">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-gray-500">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>
            </div>
            <button
              onClick={removeFile}
              className="flex-shrink-0 rounded-full p-1 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
            >
              <span className="material-symbols-outlined text-base">close</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
