interface ICardProps {
  children: React.ReactNode;
  className?: string;
}

function Card({ children, className }: ICardProps) {
  return (
    <div
      className={`${className} rounded-[15px] border border-[#eeeeee] bg-[#fafafa] p-4`}
    >
      {children}
    </div>
  );
}

export default Card;
