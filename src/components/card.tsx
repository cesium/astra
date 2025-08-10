import clsx from "clsx";
import { twMerge } from "tailwind-merge";

interface ICardProps {
  children: React.ReactNode;
  className?: string;
}

function Card({ children, className }: ICardProps) {
  return (
    <div
      className={twMerge(
        clsx(
          className,
          "bg-muted/50 rounded-2xl border border-black/5 p-4 backdrop-blur-3xl",
        ),
      )}
    >
      {children}
    </div>
  );
}

export default Card;
