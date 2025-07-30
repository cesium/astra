interface ICardProps {
  children: React.ReactNode;
  className?: string;
}

function Card({ children, className }: ICardProps) {
  return (
    <div
      className={`${className} bg-muted/50 rounded-2xl border border-black/5 p-4`}
    >
      {children}
    </div>
  );
}

export default Card;
