export default function Card ({
	children
}: {
	children?: React.ReactNode;
}) {
	return (
		<div
			className={'p-24 border rounded-[15px] border-[#eeeeee] bg-[#fafafa]'}
		>

			{children ?? ""}
		</div>
	);
}
