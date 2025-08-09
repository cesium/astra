"use client"

import type React from "react"

import { useCallback, useState, useRef } from "react"
import { twMerge } from "tailwind-merge"
import clsx from "clsx"

interface FileUploaderProps {
  onFileChange?: (file: File | null) => void
  accept?: string
  maxSize?: number
  className?: string
  disabled?: boolean
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

export default function FileUploader({
  onFileChange,
  accept = "*/*",
  maxSize,
  className,
  disabled = false,
}: FileUploaderProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dragCounterRef = useRef(0)

  const handleFile = useCallback(
    (file: File | null) => {
      if (!file || disabled) return

      if (maxSize && file.size > maxSize) {
        alert(`File "${file.name}" exceeds maximum size of ${formatFileSize(maxSize)}`)
        return
      }

      setSelectedFile(file)
      onFileChange?.(file)
    },
    [onFileChange, maxSize, disabled],
  )

  const removeFile = useCallback(() => {
    setSelectedFile(null)
    onFileChange?.(null)
  }, [onFileChange])

  const handleDragEnter = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      if (disabled) return

      dragCounterRef.current++
      if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
        setIsDragOver(true)
      }
    },
    [disabled],
  )

  const handleDragLeave = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      if (disabled) return

      dragCounterRef.current--
      if (dragCounterRef.current === 0) {
        setIsDragOver(false)
      }
    },
    [disabled],
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      if (disabled) return

      setIsDragOver(false)
      dragCounterRef.current = 0

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleFile(e.dataTransfer.files[0])
      }
    },
    [handleFile, disabled],
  )

  const handleClick = useCallback(() => {
    if (disabled) return
    fileInputRef.current?.click()
  }, [disabled])

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        handleFile(e.target.files[0])
      }
      e.target.value = ""
    },
    [handleFile],
  )

  return (
    <div className={twMerge(clsx("w-full space-y-4", className))}>
      {}
      <div
        className={twMerge(
          clsx(
            "relative w-full cursor-pointer rounded-lg border-2 border-dashed transition-all duration-200 ease-in-out",
            "flex min-h-[200px] flex-col items-center justify-center p-4 text-center",
            "sm:min-h-[250px] sm:p-6 md:p-8",
            isDragOver
              ? "border-primary-400 bg-primary-400/20"
              : "border-black/20 bg-gray-50 hover:border-black/30 hover:bg-gray-100",
            disabled && "pointer-events-none opacity-50",
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
          accept={accept}
          onChange={handleInputChange}
          className="hidden"
          disabled={disabled}
        />

        {}
        <div
          className={twMerge(
            clsx(
              "rounded-lg transition-all duration-200 ease-in-out",
              isDragOver ? "text-primary-400" : "text-black/50",
            ),
          )}
        >
          <span className="material-symbols-outlined text-5xl">{isDragOver ? "add" : "download"}</span>
        </div>

        {}
        {!isDragOver && (
          <div className="space-y-1 sm:space-y-2">
            <p
              className={twMerge(
                clsx("font-semibold transition-colors duration-200", "text-black/50"),
              )}
            >
              Largue aqui o ficheiro para carregar
            </p>
            <p className={twMerge(clsx("transition-colors duration-200", "text-black/50"))}>
              ou{" "}
              <span
                className={twMerge(
                  clsx(
                    "underline transition-colors duration-200 hover:no-underline",
                    "text-primary-400 hover:text-primary-600",
                  ),
                )}
              >
                abra um ficheiro do seu computador
              </span>
            </p>
            {maxSize && <p className="text-xs text-gray-400 mt-2">Tamanho máximo: {formatFileSize(maxSize)}</p>}
          </div>
        )}
      </div>

      {}
      {selectedFile && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-700">Ficheiro selecionado</h3>

          <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-3">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <span className="material-symbols-outlined text-base">description</span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900 truncate">{selectedFile.name}</p>
                <p className="text-xs text-gray-500">{formatFileSize(selectedFile.size)}</p>
              </div>
            </div>
            <button
              onClick={removeFile}
              className="flex-shrink-0 rounded-full p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
            >
              <span className="material-symbols-outlined text-base">close</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
