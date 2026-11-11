import clsx from "clsx";
import { twMerge } from "tailwind-merge";

interface IPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

function PageButton({
  icon,
  label,
  disabled,
  onClick,
}: {
  icon: string;
  label: string;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="hover:bg-smoke border-dark/10 flex size-9 cursor-pointer items-center justify-center rounded-lg border transition-colors disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
    >
      <span className="material-symbols-outlined text-xl">{icon}</span>
    </button>
  );
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: IPaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <nav
      aria-label="Pagination"
      className={twMerge(
        clsx("flex items-center justify-end gap-3", className),
      )}
    >
      <PageButton
        icon="chevron_left"
        label="Previous page"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
      />
      <span className="text-dark/50 text-sm">
        Page {currentPage} of {totalPages}
      </span>
      <PageButton
        icon="chevron_right"
        label="Next page"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      />
    </nav>
  );
}
