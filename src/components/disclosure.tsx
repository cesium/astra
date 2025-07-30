'use client';

import {
  ElementType,
  ReactNode,
  ComponentPropsWithoutRef,
  forwardRef,
  useRef,
  useState,
  useEffect,
} from "react";
import { Disclosure as HeadlessDisclosure } from "@headlessui/react";

interface IDisclosureProps<T extends ElementType = "div"> {
  defaultOpen?: boolean;
  as?: T;
  children: ReactNode;
  onToggle?: (open: boolean) => void;
  animationDuration?: number;
  animationEasing?: string;
  title: string;
}

type DisclosureComponentProps<T extends ElementType> = IDisclosureProps<T> &
  Omit<ComponentPropsWithoutRef<T>, keyof IDisclosureProps<T>>;

function ChevronToggle({
  open,
  label,
  ...props
}: {
  open: boolean;
  label: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className="mb-1 flex w-full items-center rounded-lg px-2 py-3 transition-colors hover:bg-zinc-100"
      {...props}
    >
      <span
        className="material-symbols-outlined mr-2 text-zinc-500"
        style={{ fontSize: 20 }}
        aria-hidden="true"
      >
        {open ? "expand_less" : "expand_more"}
      </span>
      <div className="w-full text-left font-medium">{label}</div>
    </button>
  );
}

function Collapsible({
  open,
  duration,
  easing,
  children,
}: {
  open: boolean;
  duration: number;
  easing: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [maxHeight, setMaxHeight] = useState(open ? "none" : 0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (open) {
      setMaxHeight(el.scrollHeight);
      const onEnd = () => {
        setMaxHeight("none");
        el.removeEventListener("transitionend", onEnd);
      };
      el.addEventListener("transitionend", onEnd);
      return () => el.removeEventListener("transitionend", onEnd);
    } else {
      setMaxHeight(el.scrollHeight);
      const timeoutId = setTimeout(() => setMaxHeight(0), 10);
      return () => clearTimeout(timeoutId);
    }
  }, [open]);

  return (
    <div
      ref={ref}
      style={{
        overflow: "hidden",
        transition: `max-height ${duration}ms ${easing}`,
        maxHeight,
      }}
    >
      {children}
    </div>
  );
}

function DisclosureInner<T extends ElementType = "div">({
  defaultOpen = false,
  as,
  children,
  onToggle,
  animationDuration = 300,
  animationEasing = "cubic-bezier(0.4, 0, 0.2, 1)",
  title,
  ...rest
}: DisclosureComponentProps<T>) {
  const Component = as || ("div" as T);
  const [open, setOpen] = useState(defaultOpen);

  return (
    <HeadlessDisclosure
      as={Component as ElementType}
      defaultOpen={defaultOpen}
      onChange={onToggle}
      {...rest}
    >
      <>
        <ChevronToggle
          open={open}
          label={title}
          onClick={() => setOpen(!open)}
        />
        <Collapsible
          open={open}
          duration={animationDuration}
          easing={animationEasing}
        >
          {children}
        </Collapsible>
      </>
    </HeadlessDisclosure>
  );
}

const Disclosure = forwardRef<HTMLDivElement, DisclosureComponentProps<"div">>(
  DisclosureInner,
);

export default Disclosure;
