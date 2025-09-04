'use client'

import { useEffect, useRef, useState } from "react";

interface ScrollableContainerProps {
  children: React.ReactNode;
  className?: string;
	items: any[]; //fixme 
}

export default function ScrollableContainer({
  children,
  className,
	items,
}: ScrollableContainerProps) {

  const [isScrolledTop, setIsScrolledTop] = useState(true);
  const [isScrolledBottom, setIsScrolledBottom] = useState(false);
  const scrollableRef = useRef<HTMLDivElement>(null);

	const handleScroll = () => {
	if (scrollableRef.current) {
		const { scrollTop, scrollHeight, clientHeight } = scrollableRef.current;

		const isTop = scrollableRef.current.scrollTop === 0;
		setIsScrolledTop(isTop);
		const isBottom = scrollTop + clientHeight >= scrollHeight;
		const hasOverflow = scrollHeight > clientHeight;
		setIsScrolledBottom(isBottom || !hasOverflow);
	}
  };

  useEffect(() => {
    handleScroll();
  }, [items]);

  return (
    <div className="relative h-full min-h-0">
      {!isScrolledTop && (
        <div className="from-muted pointer-events-none absolute top-0 right-0 left-0 z-10 hidden h-12 bg-gradient-to-b to-transparent md:block" />
      )}

      <div
        className={`divide-dark/8 bg-light no-scrollbar max-h-full w-full space-y-2 divide-y overflow-y-scroll rounded-lg pt-3 pl-4 ${className}`}
        onScroll={handleScroll}
        ref={scrollableRef}
      >
        {children}
      </div>

      {!isScrolledBottom && (
        <div className="from-muted pointer-events-none absolute right-0 bottom-0 left-0 z-10 hidden h-12 bg-gradient-to-t to-transparent md:block" />
      )}
    </div>
  );
}
