"use client";

interface ImportConfirmationDrawerProps {
  selectedFile: File | null;
  isUploading: boolean;
  uploadStatus: "idle" | "success" | "error";
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ImportConfirmationDrawer({
  selectedFile,
  isUploading,
  uploadStatus,
  onConfirm,
  onCancel,
}: ImportConfirmationDrawerProps) {
  if (!selectedFile) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm transition-opacity duration-300"
        onClick={onCancel}
      />

      <div className="fixed right-0 bottom-0 left-0 z-50 transform transition-transform duration-300 ease-out">
        <div className="mx-auto max-w-2xl rounded-t-xl border-t border-black/20 bg-white shadow-2xl">
          <div className="flex justify-center pt-3 pb-2">
            <div className="h-1 w-12 rounded-full bg-black/30" />
          </div>

          <div className="px-6 pb-6">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-orange-100">
                <span className="material-symbols-outlined text-primary-400">
                  upload_file
                </span>
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="mb-1 text-lg font-semibold text-black/80">
                  Confirm Import
                </h3>
                <p className="mb-1 text-sm text-black/60">
                  Are you sure you want to import the file{" "}
                  <span className="font-medium">"{selectedFile.name}"</span>?
                </p>
                <p className="text-xs text-black/50">
                  This action will process student and course data.
                </p>

                {uploadStatus === "success" && (
                  <div className="mt-3 flex items-center gap-2 rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">
                    <span className="material-symbols-outlined text-base">
                      check_circle
                    </span>
                    File imported successfully!
                  </div>
                )}

                {uploadStatus === "error" && (
                  <div className="text-danger mt-3 flex items-center gap-2 rounded-md bg-red-50 px-3 py-2 text-sm">
                    <span className="material-symbols-outlined text-base">
                      error
                    </span>
                    Error importing file. Please try again.
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={onCancel}
                disabled={isUploading}
                className="flex-1 rounded-lg border border-black/20 bg-white px-6 py-3 text-sm font-medium text-black/80 transition-colors hover:bg-black/10 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                disabled={isUploading}
                className={`flex-1 rounded-lg px-6 py-3 text-sm font-medium text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                  uploadStatus === "success"
                    ? "bg-green-600 hover:bg-green-700"
                    : uploadStatus === "error"
                      ? "bg-danger hover:bg-red-700"
                      : "bg-primary-400 hover:bg-primary-500"
                }`}
              >
                {isUploading
                  ? "Importing..."
                  : uploadStatus === "success"
                    ? "Imported!"
                    : uploadStatus === "error"
                      ? "Try Again"
                      : "Confirm Import"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
