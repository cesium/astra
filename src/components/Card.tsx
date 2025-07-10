interface ICardProps {
  children: React.ReactNode;
}

function Card({ children }: ICardProps) {
  return (
    <div className="p-4 border rounded-[15px] border-[#eeeeee] bg-[#fafafa]">
      {children}
    </div>
  );
}

export default Card;