import clsx from "clsx";
import { twMerge } from "tailwind-merge";

interface ICardProps {
  children: React.ReactNode;
  className?: string;
}

function Card({ children, className, ...rest }: ICardProps) {
  return (
    <div
      className={twMerge(
        clsx(
          "bg-muted/50 drop-shadow-dark/5 rounded-2xl border border-black/5 p-4 drop-shadow-2xl backdrop-blur-3xl",
          className,
        ),
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

export default Card;
