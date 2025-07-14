interface ICardProps {
  children: React.ReactNode;
  className?: string;
}

function Card({ children, className }: ICardProps) {
  return (
    <div className={`${className} p-4 border rounded-[15px] border-[#eeeeee] bg-[#fafafa]`}>
      {children}
    </div>
  );
}

export default Card;