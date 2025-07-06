interface CardProps {
  children?: React.ReactNode;
}

function Card({ children }: CardProps) {
  return (
    <div className="p-24 border rounded-[15px] border-[#eeeeee] bg-[#fafafa]">
      {children}
    </div>
  );
}

export default Card;
