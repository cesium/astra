"use client";

import Modal from "@/components/modal";
import clsx from "clsx";
import React from "react";
import { twMerge } from "tailwind-merge";

export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  variant?: "primary" | "danger";
  isLoading?: boolean;
  className?: string;
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "primary",
  isLoading = false,
  className,
}: ConfirmModalProps) {
  return (
    <Modal modalState={isOpen} onClose={onClose} className={className}>
      <div className="w-full space-y-6 text-left">
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-black">{title}</h3>
          {description && (
            <div className="text-sm text-gray-600">
              {typeof description === "string" ? (
                <p>{description}</p>
              ) : (
                description
              )}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="border-dark/10 hover:bg-smoke inline-flex h-fit cursor-pointer items-center justify-center rounded-lg border px-4 py-2 text-sm font-semibold text-gray-700 transition-all duration-200 hover:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={twMerge(
              clsx(
                "inline-flex h-fit cursor-pointer items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100",
                variant === "danger"
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-primary-400 hover:bg-primary-400/95",
              ),
            )}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
}
