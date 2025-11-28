import clsx from "clsx";

interface IParentProps {
  children: React.ReactNode;
  className?: string;
}

export function HeaderElement({
  title,
  className,
}: {
  title: string;
  className?: string;
}) {
  return (
    <th
      className={clsx("text-dark/50 p-4 text-start font-semibold", className)}
    >
      {title}
    </th>
  );
}

export function TableHeader({ children, className }: IParentProps) {
  return (
    <thead
      className={clsx(
        "sticky top-0 z-10 bg-white shadow-sm",
        className,
      )}
    >
      <tr>{children}</tr>
    </thead>
  );
}

export function TableContent({ children, className }: IParentProps) {
  return (
    <tbody
      className={clsx("divide-dark/10 divide-y overflow-y-scroll", className)}
    >
      {children}
    </tbody>
  );
}

export function TableItemWrapper({ children, className }: IParentProps) {
  return <tr className={clsx("", className)}>{children}</tr>;
}

export function TableCell({ children, className }: IParentProps) {
  return <td className={clsx("p-4", className)}>{children}</td>;
}

export default function Table({ children, className }: IParentProps) {
  return (
    <div
      className={clsx(
        "border-dark/10 flex h-full min-h-0 flex-col overflow-auto rounded-xl border",
        className,
      )}
    >
      <table className="w-full">{children}</table>
    </div>
  );
}
