interface ICardProps {
  children: React.ReactNode;
  className?: string;
}

function Card({ children, className }: ICardProps) {
  return (
    <div className={`${className} p-4 border rounded-2xl border-black/5 bg-muted/50`}>
      {children}
    </div>
  );
}

export default Card;
