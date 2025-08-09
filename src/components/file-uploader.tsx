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

const DownloadIcon = () => (
  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 15L7 10H10V3H14V10H17L12 15Z" fill="currentColor" />
    <path d="M20 18H4V20H20V18Z" fill="currentColor" />
  </svg>
)

const PlusIcon = () => (
  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const XIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const FileIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <polyline
      points="14,2 14,8 20,8"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

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
            "flex min-h-[200px] flex-col items-center justify-center gap-4 p-4 text-center",
            "sm:min-h-[250px] sm:p-6 md:p-8",
            isDragOver
              ? "border-orange-400 bg-orange-50"
              : "border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100",
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
              "rounded-lg p-3 transition-all duration-200 ease-in-out",
              "sm:p-4",
              isDragOver ? "bg-orange-100 text-orange-600" : "bg-gray-200 text-gray-500",
            ),
          )}
        >
          {isDragOver ? <PlusIcon /> : <DownloadIcon />}
        </div>

        {}
        <div className="space-y-1 sm:space-y-2">
          <p
            className={twMerge(
              clsx(
                "text-sm font-medium transition-colors duration-200",
                "sm:text-base",
                isDragOver ? "text-orange-700" : "text-gray-600",
              ),
            )}
          >
            Largue aqui o ficheiro para carregar
          </p>
          <p
            className={twMerge(
              clsx(
                "text-sm transition-colors duration-200",
                "sm:text-base",
                isDragOver ? "text-orange-600" : "text-gray-600",
              ),
            )}
          >
            ou{" "}
            <span
              className={twMerge(
                clsx(
                  "underline transition-colors duration-200 hover:no-underline",
                  isDragOver ? "text-orange-600" : "text-blue-600 hover:text-blue-800",
                ),
              )}
            >
              abra um ficheiro do seu computador
            </span>
          </p>
          {maxSize && <p className="text-xs text-gray-400 mt-2">Tamanho máximo: {formatFileSize(maxSize)}</p>}
        </div>
      </div>

      {}
      {selectedFile && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-700">Ficheiro selecionado</h3>

          <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-3">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <FileIcon />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900 truncate">{selectedFile.name}</p>
                <p className="text-xs text-gray-500">{formatFileSize(selectedFile.size)}</p>
              </div>
            </div>
            <button
              onClick={removeFile}
              className="flex-shrink-0 rounded-full p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
            >
              <XIcon />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
