"use client";

import React, { useState } from "react";

import CalendarExportModal from "@/components/calendar/calendar-export-modal";
import { api } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";

interface ExportButtonProps {
  type?: "schedule" | "calendar";
}

export default function ExportButton({ type = "schedule" }: ExportButtonProps) {
  const [modalState, setModalState] = useState(false);
  const [exportUrl, setExportUrl] = useState("");

  const mutation = useMutation({
    mutationFn: async () => {
      const endpoint =
        type === "schedule"
          ? "/export/student/schedule-url"
          : "/export/student/calendar-url";
      const res = await api.get(endpoint);
      return type === "schedule"
        ? res.data.schedule_url
        : res.data.calendar_url;
    },
    onSuccess: (url) => {
      if (url) {
        setExportUrl(url);
        setModalState(true);
      }
    },
    onError: (error) => {
      console.error("Export failed:", error);
    },
  });

  return (
    <>
      <button
        onClick={() => mutation.mutate()}
        disabled={mutation.isPending}
        className="text-primary-400 cursor-pointer transition duration-300 hover:opacity-70 disabled:opacity-50"
      >
        {mutation.isPending ? "Exporting..." : "Export"}
      </button>

      <CalendarExportModal
        modalState={modalState}
        setModalState={setModalState}
        type={type}
        title={type === "schedule" ? "Export Schedule" : "Export Calendar"}
        url={exportUrl}
      />
    </>
  );
}
