"use client";

import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";

interface ScrollableContainerProps<T> {
  children: React.ReactNode;
  className?: string;
  items: T[];
}

export default function ScrollableContainer<T>({
  children,
  className,
  items,
}: ScrollableContainerProps<T>) {
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
        <div className="from-muted pointer-events-none absolute top-0 right-0 left-0 z-10 h-12 bg-gradient-to-b to-transparent" />
      )}

      <div
        className={twMerge(
          clsx(
            "no-scrollbar max-h-full w-full overflow-y-scroll pb-14",
            className,
          ),
        )}
        onScroll={handleScroll}
        ref={scrollableRef}
      >
        <div className="divide-dark/8 bg-light space-y-3 divide-y rounded-lg pt-3 pl-4">
          {children}
        </div>
      </div>

      {!isScrolledBottom && (
        <div className="from-muted pointer-events-none absolute right-0 bottom-0 left-0 z-10 h-12 bg-gradient-to-t to-transparent" />
      )}
    </div>
  );
}
