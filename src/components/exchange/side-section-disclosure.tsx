import Card from "../card";

interface ISideSectionDisclosure {
  title: string;
  children: React.ReactNode;
}

export default function SideSectionDisclosure({
  title,
  children,
}: ISideSectionDisclosure) {
  return (
    <Card>
      <div className="group flex w-full items-center justify-between">
        <h2 className="text-sm font-semibold uppercase">{title}</h2>
      </div>
      <div className="overflow-hidden">{children}</div>
    </Card>
  );
}
