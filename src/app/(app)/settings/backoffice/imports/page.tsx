"use client";

import { useState } from "react";
import FileUploader from "@/components/file-uploader";
import ImportConfirmationDrawer from "@/components/import-drawer";
import { api } from "@/lib/api";

const EXCEL_TYPES = [
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
  "application/vnd.ms-excel", // .xls
];

export default function Imports() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const handleFileChange = (file: File | null) => {
    setSelectedFile(file);
    setUploadStatus("idle");
  };

  const handleConfirmUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadStatus("idle");

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      await api.post("import/students_by_courses", formData);

      setUploadStatus("success");
      setSelectedFile(null);
    } catch (error) {
      console.error("Upload error:", error);
      setUploadStatus("error");
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancelUpload = () => {
    setSelectedFile(null);
    setUploadStatus("idle");
  };

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Import Data</h1>
          <p className="mt-2 text-gray-600">
            To enable schedule generation for students, you must import the
            schedules provided by the Academic Services. The file must follow
            the following{" "}
            <a
              href="#"
              className="text-primary-400 underline hover:no-underline"
            >
              format
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
      </div>

      <ImportConfirmationDrawer
        selectedFile={selectedFile}
        isUploading={isUploading}
        uploadStatus={uploadStatus}
        onConfirm={handleConfirmUpload}
        onCancel={handleCancelUpload}
      />
    </>
  );
}
