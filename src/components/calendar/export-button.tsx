"use client";

import React, { useState } from "react";

import CalendarExportModal from "@/components/calendar/calendar-export-modal";
import { api } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";

export default function ExportButton() {
  const [modalState, setModalState] = useState(false);
  const [exportUrl, setExportUrl] = useState("");
  const [buttonLabel, setButtonLabel] = useState("Export");

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await api.get("/export/student/calendar-url");
      return res.data.calendar_url;
    },
    onSuccess: (data) => {
      const url = typeof data === "string" ? data : data.url;
      if (!url) {
        setButtonLabel("Failed to export");
        return;
      }
      setExportUrl(url);
      setModalState(true);
      setButtonLabel("Export");
    },
    onError: (error) => {
      console.error("Export failed:", error);
      setButtonLabel("Failed to export");
    },
  });

  return (
    <>
      <button
        onClick={() => {
          setButtonLabel("Exporting...");
          mutation.mutate();
        }}
        disabled={mutation.isPending}
        className="text-primary-400 cursor-pointer transition duration-300 hover:opacity-70"
      >
        {buttonLabel}
      </button>

      <CalendarExportModal
        modalState={modalState}
        setModalState={setModalState}
        url={exportUrl}
      />
    </>
  );
}
