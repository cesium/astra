"use client"

import { useState } from "react"
import { Dialog } from "@headlessui/react"
import FileUploader from "@/components/file-uploader"
import { api } from "@/lib/api"

const EXCEL_TYPES = [
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
  "application/vnd.ms-excel", // .xls
]

export default function Imports() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<"idle" | "success" | "error">("idle")

  const handleFileChange = (file: File | null) => {
    setSelectedFile(file)
    setUploadStatus("idle")
    if (file) {
      setShowConfirmDialog(true)
    }
  }

  const handleConfirmUpload = async () => {
    if (!selectedFile) return

    setIsUploading(true)
    setUploadStatus("idle")

    try {
      const formData = new FormData()
      formData.append("file", selectedFile)

      await api.post("import/students_by_courses", formData)

      setUploadStatus("success")
      setSelectedFile(null)
    } catch (error) {
      console.error("Upload error:", error)
      setUploadStatus("error")
    } finally {
      setIsUploading(false)
    }
  }

  const handleCancelUpload = () => {
    setShowConfirmDialog(false)
    setSelectedFile(null)
    setUploadStatus("idle")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Importar Dados</h1>
        <p className="text-gray-600 mt-2">
          Para possibilitar a geração de horários para os alunos, deve importar os horários fornecidos pelos Serviços
          Académicos. O ficheiro deve seguir o seguinte{" "}
          <a href="#" className="text-orange-500 underline hover:no-underline">
            formato
          </a>
          .
        </p>
      </div>


        <FileUploader
          onFileChange={handleFileChange}
          allowedTypes={EXCEL_TYPES}
          maxSize={10 * 1024 * 1024}
          disabled={isUploading}
        />

      <Dialog open={showConfirmDialog} onClose={() => setShowConfirmDialog(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/25" aria-hidden="true" />

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-sm rounded-lg bg-white p-6 shadow-lg">
            <Dialog.Title className="mb-2 text-lg font-semibold">Confirmar Importação</Dialog.Title>

            <Dialog.Description className="mb-6 text-sm text-gray-600">
              Tem a certeza que pretende importar o ficheiro "{selectedFile?.name}"? Esta ação irá processar os dados
              dos estudantes e cursos.
            </Dialog.Description>

            <div className="flex justify-end gap-3">
              <button
                onClick={handleCancelUpload}
                disabled={isUploading}
                className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmUpload}
                disabled={isUploading}
                className={`rounded-md px-4 py-2 text-sm font-medium text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                  uploadStatus === "success"
                    ? "bg-green-600 hover:bg-green-700"
                    : uploadStatus === "error"
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-orange-500 hover:bg-orange-600"
                }`}
              >
                {isUploading
                  ? "A importar..."
                  : uploadStatus === "success"
                  ? "Importado!"
                  : uploadStatus === "error"
                  ? "Falhou"
                  : "Confirmar"}
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  )
}