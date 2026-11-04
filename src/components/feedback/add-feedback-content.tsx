import { useState } from "react";
import axios from "axios";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import Input from "@/components/input";
import Label from "@/components/label";
import { useCreateFeedback } from "@/lib/mutations/feedback";

const SUBJECT_MAX_LENGTH = 255;

type FieldErrors = Partial<Record<"subject" | "message", string[]>>;

interface IAddFeedbackContent {
  onClose: () => void;
}

function getFieldErrors(error: unknown): FieldErrors | null {
  if (axios.isAxiosError(error) && error.response?.status === 422) {
    return error.response.data?.errors ?? null;
  }
  return null;
}

function AddFeedbackContent({ onClose }: IAddFeedbackContent) {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const createFeedback = useCreateFeedback();
  const fieldErrors = getFieldErrors(createFeedback.error);

  const isFormFilled = !!subject.trim() && !!message.trim();
  const canSubmit = isFormFilled && !createFeedback.isPending;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!canSubmit) return;

    createFeedback.mutate({ subject: subject.trim(), message: message.trim() });
  }

  if (createFeedback.isSuccess) {
    return (
      <div className="flex w-full flex-col items-center gap-4 text-center">
        <span className="material-symbols-outlined text-success text-5xl">
          task_alt
        </span>
        <div className="space-y-1">
          <h3 className="text-xl font-semibold">Thanks for your feedback!</h3>
          <p className="text-dark/70">
            Your report was sent and will be reviewed soon.
          </p>
        </div>
        <button
          onClick={onClose}
          className="bg-primary-400 hover:bg-primary-400/95 inline-flex h-fit cursor-pointer items-center justify-center rounded-lg px-3 py-2 text-white transition-all duration-200 hover:scale-95"
        >
          Close
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-semibold">Report an issue</h3>
        <button
          type="button"
          onClick={onClose}
          className="material-symbols-outlined text-dark/50 cursor-pointer text-2xl transition-opacity hover:opacity-70"
        >
          close
        </button>
      </div>

      <div className="flex flex-col gap-4">
        <div className="space-y-1">
          <Label
            htmlFor="feedback-subject"
            size="large"
            className="text-dark font-semibold"
          >
            Subject
          </Label>
          <Input
            id="feedback-subject"
            type="text"
            required
            maxLength={SUBJECT_MAX_LENGTH}
            placeholder="e.g. my shift doesn't match the official schedule"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
          {fieldErrors?.subject && (
            <p className="text-danger text-sm">{fieldErrors.subject[0]}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label
            htmlFor="feedback-message"
            size="large"
            className="text-dark font-semibold"
          >
            Describe the issue
          </Label>
          <textarea
            id="feedback-message"
            required
            placeholder="Tell us what happened"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="min-h-40 w-full resize-none rounded-xl border border-black/10 bg-transparent px-2 py-1.5 text-black outline-none placeholder:text-black/30 md:px-3 md:py-2.5"
          />
          {fieldErrors?.message && (
            <p className="text-danger text-sm">{fieldErrors.message[0]}</p>
          )}
        </div>
      </div>

      {createFeedback.isError && !fieldErrors && (
        <p className="text-danger text-center text-sm">
          Something went wrong. Please try again later.
        </p>
      )}

      <div className="flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          className="hover:bg-smoke border-dark/5 inline-flex h-fit cursor-pointer items-center justify-center rounded-lg border px-3 py-2 transition-all duration-200 hover:scale-95"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!canSubmit}
          className={twMerge(
            clsx(
              "bg-primary-400 inline-flex h-fit items-center justify-center rounded-lg px-3 py-2 text-white transition-all duration-200",
              canSubmit
                ? "hover:bg-primary-400/95 cursor-pointer hover:scale-95"
                : "cursor-not-allowed opacity-50",
            ),
          )}
        >
          {createFeedback.isPending ? "Sending..." : "Submit"}
        </button>
      </div>
    </form>
  );
}

export default AddFeedbackContent;
