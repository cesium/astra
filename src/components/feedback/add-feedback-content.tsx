import { useState } from "react";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import { useCreateFeedback } from "@/lib/mutations/feedback";

interface IAddFeedbackContent {
  setModalState: (state: boolean) => void;
}

function AddFeedbackContent({ setModalState }: IAddFeedbackContent) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const createFeedback = useCreateFeedback();

  function handleSubmit() {
    setErrorMessage(null);

    createFeedback.mutate(
      {
        subject,
        message,
      },
      {
        onSuccess: () => setModalState(false),
        onError: () => setErrorMessage("An error occurred."),
      },
    );
  }

  const isFormFilled = !!subject.trim() && !!message.trim();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h2 className="px-2 py-1 text-sm font-semibold">Subject</h2>
        <input
          id="subject"
          type="text"
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className={
            "group flex w-full items-center justify-center rounded-md border border-gray-300 p-2 text-left select-none focus:outline-none"
          }
        ></input>
        <h2 className="px-2 py-1 text-sm font-semibold">Describe the issue</h2>
        <textarea
          id="message"
          placeholder="Description"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={
            "group flex min-h-40 w-full resize-none items-center justify-center rounded-md border border-gray-300 p-2 text-left select-none focus:outline-none"
          }
        ></textarea>
      </div>

      {errorMessage && (
        <p className="text-danger mt-2 text-center text-sm">{errorMessage}</p>
      )}

      <button
        onClick={handleSubmit}
        disabled={!isFormFilled}
        className={twMerge(
          clsx(
            "bg-celeste mt-4 cursor-pointer rounded-lg px-4 py-2 text-white/90 transition-all duration-150 select-none",
            !isFormFilled
              ? "cursor-not-allowed opacity-50"
              : "hover:bg-celeste/80",
          ),
        )}
      >
        Submit
      </button>
    </div>
  );
}

export default AddFeedbackContent;
