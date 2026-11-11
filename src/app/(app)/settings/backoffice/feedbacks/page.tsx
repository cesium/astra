"use client";

import { useEffect, useState } from "react";
import moment from "moment";
import { AuthCheck } from "@/components/auth-check";
import Avatar from "@/components/avatar";
import Modal from "@/components/modal";
import Pagination from "@/components/pagination";
import SettingsWrapper from "@/components/settings-wrapper";
import Table, {
  HeaderElement,
  TableCell,
  TableContent,
  TableHeader,
  TableItemWrapper,
} from "@/components/table";
import { useDeleteFeedback } from "@/lib/mutations/feedback";
import { useGetFeedbacks } from "@/lib/queries/feedback";
import { IFeedback } from "@/lib/types";
import { firstLastName } from "@/lib/utils";

const COLUMNS = 5;

function DeleteFeedbackModal({
  feedback,
  onClose,
}: {
  feedback: IFeedback | null;
  onClose: () => void;
}) {
  const deleteFeedback = useDeleteFeedback();

  function handleClose() {
    deleteFeedback.reset();
    onClose();
  }

  function handleDelete() {
    if (!feedback) return;

    deleteFeedback.mutate(feedback.id, { onSuccess: handleClose });
  }

  return (
    <Modal modalState={!!feedback} onClose={handleClose}>
      <div className="w-full space-y-8">
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">
            Are you sure you want to delete this feedback report?
          </h3>
          {feedback && (
            <p className="text-sm">
              <span className="font-semibold">Subject: </span>
              {feedback.subject}
            </p>
          )}
          {deleteFeedback.isError && (
            <p className="text-danger text-sm">
              Something went wrong. Please try again later.
            </p>
          )}
        </div>
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={handleClose}
            className="hover:bg-smoke border-dark/5 inline-flex h-fit cursor-pointer items-center justify-center rounded-lg border px-3 py-2 transition-all duration-200 hover:scale-95"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={deleteFeedback.isPending}
            className="bg-danger hover:bg-danger/90 inline-flex h-fit cursor-pointer items-center justify-center rounded-lg px-3 py-2 text-white transition-all duration-200 hover:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {deleteFeedback.isPending ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </Modal>
  );
}

function FeedbackDetailsModal({
  feedback,
  onClose,
}: {
  feedback: IFeedback | null;
  onClose: () => void;
}) {
  return (
    <Modal modalState={!!feedback} onClose={onClose} className="max-w-2xl">
      {feedback && (
        <div className="w-full space-y-6">
          <div className="flex items-center gap-3">
            <Avatar name={feedback.user.name} className="size-10 shrink-0" />
            <div>
              <p className="font-semibold">{feedback.user.name}</p>
              <p className="text-dark/50 text-sm">
                {moment(feedback.inserted_at).format("D MMM YYYY, HH:mm")}
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold break-words">
              {feedback.subject}
            </h3>
            <p className="text-dark/80 max-h-[50vh] overflow-y-auto break-words whitespace-pre-line">
              {feedback.message}
            </p>
          </div>
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="hover:bg-smoke border-dark/5 inline-flex h-fit cursor-pointer items-center justify-center rounded-lg border px-3 py-2 transition-all duration-200 hover:scale-95"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}

function FeedbackItem({
  feedback,
  onOpen,
  onDelete,
}: {
  feedback: IFeedback;
  onOpen: (feedback: IFeedback) => void;
  onDelete: (feedback: IFeedback) => void;
}) {
  return (
    <TableItemWrapper
      onClick={() => onOpen(feedback)}
      onKeyDown={(e) => {
        if (e.key === "Enter") onOpen(feedback);
      }}
      tabIndex={0}
      className="text-dark/80 hover:bg-smoke cursor-pointer align-top transition-colors"
    >
      <TableCell>
        <div
          className="-my-1 flex items-center gap-2"
          title={feedback.user.name}
        >
          <Avatar name={feedback.user.name} className="size-8 shrink-0" />
          <span className="whitespace-nowrap">
            {firstLastName(feedback.user.name)}
          </span>
        </div>
      </TableCell>
      <TableCell className="font-semibold break-words">
        <span className="line-clamp-2">{feedback.subject}</span>
      </TableCell>
      <TableCell className="break-words">
        <span className="line-clamp-2">{feedback.message}</span>
      </TableCell>
      <TableCell className="whitespace-nowrap">
        {moment(feedback.inserted_at).format("D MMM YYYY, HH:mm")}
      </TableCell>
      <TableCell>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(feedback);
          }}
          onKeyDown={(e) => e.stopPropagation()}
          aria-label="Delete feedback"
          className="material-symbols-outlined text-danger flex h-6 cursor-pointer items-center text-xl transition-opacity hover:opacity-70"
        >
          delete
        </button>
      </TableCell>
    </TableItemWrapper>
  );
}

function TableMessage({ children }: { children: React.ReactNode }) {
  return (
    <tr>
      <td colSpan={COLUMNS} className="p-4">
        <p className="text-dark/50 text-center">{children}</p>
      </td>
    </tr>
  );
}

export default function Feedbacks() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useGetFeedbacks(page);
  const feedbacks = data?.data;
  const totalPages = data?.meta.total_pages ?? 0;

  const [feedbackToOpen, setFeedbackToOpen] = useState<IFeedback | null>(null);
  const [feedbackToDelete, setFeedbackToDelete] = useState<IFeedback | null>(
    null,
  );

  // Deleting the last feedback of the last page leaves that page empty
  useEffect(() => {
    if (totalPages > 0 && page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  return (
    <>
      <title>Feedbacks | Pombo</title>
      <AuthCheck userTypes={["admin"]}>
        <SettingsWrapper title="Feedbacks">
          <div className="flex h-full flex-col gap-4">
            <section className="space-y-1">
              <h2 className="text-2xl font-semibold">Feedbacks</h2>
              <p>View the issues reported by users</p>
            </section>

            <Table className="flex-1">
              <TableHeader>
                <HeaderElement className="w-fit" title="User" />
                <HeaderElement className="w-1/4" title="Subject" />
                <HeaderElement className="w-2/5" title="Message" />
                <HeaderElement className="w-fit" title="Submitted" />
                <HeaderElement className="w-fit" title="Actions" />
              </TableHeader>

              <TableContent>
                {isLoading ? (
                  <TableMessage>Loading...</TableMessage>
                ) : isError ? (
                  <TableMessage>Couldn&apos;t load the feedbacks</TableMessage>
                ) : feedbacks && feedbacks.length > 0 ? (
                  feedbacks.map((feedback) => (
                    <FeedbackItem
                      key={feedback.id}
                      feedback={feedback}
                      onOpen={setFeedbackToOpen}
                      onDelete={setFeedbackToDelete}
                    />
                  ))
                ) : (
                  <TableMessage>No feedbacks yet</TableMessage>
                )}
              </TableContent>
            </Table>

            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>

          <FeedbackDetailsModal
            feedback={feedbackToOpen}
            onClose={() => setFeedbackToOpen(null)}
          />

          <DeleteFeedbackModal
            feedback={feedbackToDelete}
            onClose={() => setFeedbackToDelete(null)}
          />
        </SettingsWrapper>
      </AuthCheck>
    </>
  );
}
