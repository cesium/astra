"use client";

import { useGetFeedbacks } from "@/lib/queries/feedback";
import { useDeleteFeedback } from "@/lib/mutations/feedback";
import { useState, Fragment } from "react";
import {
  Transition,
  TransitionChild,
  Dialog,
  DialogPanel,
} from "@headlessui/react";

function ConfirmDelete({
  state,
  setState,
  onConfirm,
  errorMessage,
}: {
  state: boolean;
  setState: (state: boolean) => void;
  onConfirm: () => void;
  errorMessage: string | null;
}) {
  return (
    <Transition appear show={state} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        onClose={() => setState(false)}
      >
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 backdrop-blur-sm" />
        </TransitionChild>

        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <DialogPanel className="relative w-full max-w-md flex-1 space-y-4 rounded-lg bg-white p-6 shadow-lg focus:outline-0">
              <h2 className="px-2 py-1 text-lg font-semibold">
                Are you sure you want to delete this feedback report?
              </h2>
              {errorMessage && (
                <p className="text-danger mt-2 text-center text-sm">
                  {errorMessage}
                </p>
              )}
              <div className="flex flex-row justify-end gap-4">
                <button
                  onClick={() => setState(false)}
                  className="cursor-pointer rounded-lg bg-gray-200 px-4 py-2 transition-all duration-150 select-none hover:bg-gray-200/80"
                >
                  Cancel
                </button>
                <button
                  onClick={onConfirm}
                  className="bg-danger hover:bg-danger/80 cursor-pointer rounded-lg px-4 py-2 text-white/90 transition-all duration-150 select-none"
                >
                  Yes, delete it
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
}

interface IFeedback {
  id: string;
  subject: string;
  message: string;
  user_id: string;
  inserted_at: string;
  updated_at: string;
}

export default function Feedbacks() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [isConfirmationVisible, setConfirmationVisible] = useState(false);
  const [selectedFeedbackId, setSelectedFeedbackId] = useState<string | null>(
    null,
  );

  const { data: feedbacksRaw } = useGetFeedbacks();
  const feedbacks: IFeedback[] = feedbacksRaw?.data ?? [];

  const deleteMutation = useDeleteFeedback();

  const handleDelete = (id: string) => {
    setErrorMessage(null);

    deleteMutation.mutate(id, {
      onSuccess: () => {
        setConfirmationVisible(false);
        setSelectedFeedbackId(null);
      },
      onError: () => setErrorMessage("An error occurred."),
    });
  };

  return (
    <div className="flex h-full flex-col gap-8 pb-8">
      <section className="space-y-2">
        <h2 className="text-2xl font-semibold">Feedbacks</h2>
        <p>View submitted feedback reports</p>
      </section>
      <section>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Subject
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Message
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Submitted
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 bg-white">
              {feedbacks.map((fb: IFeedback) => (
                <tr key={fb.id}>
                  <td className="max-w-xs px-6 py-4 text-sm break-words whitespace-normal text-gray-900">
                    {fb.subject}
                  </td>
                  <td className="max-w-xs px-6 py-4 text-sm break-words whitespace-normal text-gray-900">
                    {fb.message}
                  </td>
                  <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">
                    {new Date(fb.inserted_at).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-left text-sm font-medium">
                    <button
                      onClick={() => {
                        setSelectedFeedbackId(fb.id);
                        setConfirmationVisible(true);
                      }}
                      className="text-danger cursor-pointer"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <ConfirmDelete
        state={isConfirmationVisible}
        setState={setConfirmationVisible}
        onConfirm={() => selectedFeedbackId && handleDelete(selectedFeedbackId)}
        errorMessage={errorMessage}
      />
    </div>
  );
}
