"use client";

import SettingsWrapper from "@/components/settings-wrapper";
import { useState } from "react";
import FileUploader from "@/components/file-uploader";
import ImportConfirmationModal from "@/components/import-confirmation-modal";
import {
  useImportStudentsByCourses,
  useImportShiftsByCourses,
} from "@/lib/mutations/courses";

const EXCEL_TYPES = [
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
  "application/vnd.ms-excel", // .xls
];

type ImportType = "students_by_courses" | "shifts_by_courses";

interface ImportState {
  selectedFile: File | null;
  type: ImportType | null;
}

export default function Imports() {
  const [importState, setImportState] = useState<ImportState>({
    selectedFile: null,
    type: null,
  });

  const importStudentsMutation = useImportStudentsByCourses();
  const importShiftsMutation = useImportShiftsByCourses();

  const handleFileChange = (file: File | null, type: ImportType) => {
    setImportState({
      selectedFile: file,
      type: file ? type : null,
    });
  };

  const handleConfirmUpload = () => {
    if (!importState.selectedFile || !importState.type) return;

    const mutation =
      importState.type === "students_by_courses"
        ? importStudentsMutation
        : importShiftsMutation;

    mutation.mutate(
      { file: importState.selectedFile },
      {
        onSuccess: () => {
          setTimeout(() => {
            setImportState({ selectedFile: null, type: null });
          }, 2000);
        },
        onError: () => {},
      },
    );
  };

  const handleCancelUpload = () => {
    setImportState({ selectedFile: null, type: null });
    importStudentsMutation.reset();
    importShiftsMutation.reset();
  };

  const getCurrentMutation = () => {
    if (!importState.type) return null;
    return importState.type === "students_by_courses"
      ? importStudentsMutation
      : importShiftsMutation;
  };

  const currentMutation = getCurrentMutation();
  const isAnyMutationPending =
    importStudentsMutation.isPending || importShiftsMutation.isPending;

  const getModalTitle = () => {
    switch (importState.type) {
      case "students_by_courses":
        return "Import Students by Courses";
      case "shifts_by_courses":
        return "Import Shifts by Courses";
      default:
        return "Import Data";
    }
  };

  const getModalDescription = () => {
    switch (importState.type) {
      case "students_by_courses":
        return "This will update student enrollment data organized by courses.";
      case "shifts_by_courses":
        return "This will update class schedule data organized by courses.";
      default:
        return "This will update the system data.";
    }
  };

  return (
    <SettingsWrapper title="Import data">
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-semibold">Import Data</h1>
          <p className="mt-2 text-black">
            Import Excel files to update the system data. Each import can be
            done independently as needed.
          </p>
        </div>

        <div className="max-w-3xl rounded-lg bg-white p-6">
          <div className="mb-4">
            <h2 className="text-lg font-semibold">Students by Courses</h2>
            <p className="mt-1 text-sm text-black">
              Import student enrollment data organized by courses. Use this when
              students change courses or new enrollments are added.
            </p>
          </div>

          <FileUploader
            onFileChange={(file) =>
              handleFileChange(file, "students_by_courses")
            }
            allowedTypes={EXCEL_TYPES}
            maxSize={10 * 1024 * 1024}
            disabled={isAnyMutationPending}
            showSelectedFile={false}
          />
        </div>

        <div className="max-w-3xl rounded-lg bg-white p-6">
          <div className="mb-4">
            <h2 className="text-lg font-semibold">Shifts by Courses</h2>
            <p className="mt-1 text-sm text-black">
              Import class schedule data organized by courses. Use this when
              schedules change or new shifts are created.
            </p>
          </div>

          <FileUploader
            onFileChange={(file) => handleFileChange(file, "shifts_by_courses")}
            allowedTypes={EXCEL_TYPES}
            maxSize={10 * 1024 * 1024}
            disabled={isAnyMutationPending}
            showSelectedFile={false}
          />
        </div>
      </div>

      <ImportConfirmationModal
        selectedFile={importState.selectedFile}
        onConfirm={handleConfirmUpload}
        onCancel={handleCancelUpload}
        title={getModalTitle()}
        description={getModalDescription()}
        isLoading={currentMutation?.isPending ?? false}
        isSuccess={currentMutation?.isSuccess ?? false}
        isError={currentMutation?.isError ?? false}
      />
    </SettingsWrapper>
  );
}
