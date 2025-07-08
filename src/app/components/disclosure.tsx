import {
  ElementType,
  ReactNode,
  ComponentPropsWithoutRef,
  forwardRef,
  useRef,
  useState,
  createContext,
  useContext,
  useLayoutEffect,
} from "react";
import {
  Disclosure as HeadlessDisclosure,
  DisclosureButton as HeadlessDisclosureButton,
  DisclosurePanel as HeadlessDisclosurePanel,
} from "@headlessui/react";

interface IAnimationContextType {
  duration: number;
  easing: string;
}

const DisclosureAnimationContext = createContext<IAnimationContextType>({
  duration: 300,
  easing: "cubic-bezier(0.4, 0, 0.2, 1)",
});

interface IDisclosureProps<T extends ElementType = "div"> {
  defaultOpen?: boolean;
  as?: T;
  children: ReactNode | ((state: { open: boolean }) => ReactNode);
  onToggle?: (open: boolean) => void;
  animationDuration?: number;
  animationEasing?: string;
}

type DisclosureComponentProps<T extends ElementType> = IDisclosureProps<T> &
  Omit<ComponentPropsWithoutRef<T>, keyof IDisclosureProps<T>>;

function DisclosureInner<T extends ElementType = "div">(
  {
    defaultOpen = false,
    as,
    children,
    onToggle,
    animationDuration = 300,
    animationEasing = "cubic-bezier(0.4, 0, 0.2, 1)",
    ...rest
  }: DisclosureComponentProps<T>,
  ref: React.Ref<unknown>,
) {
  const Component = as || ("div" as T);

  return (
    <DisclosureAnimationContext.Provider
      value={{ duration: animationDuration, easing: animationEasing }}
    >
      <HeadlessDisclosure
        as={Component}
        defaultOpen={defaultOpen}
        onChange={onToggle}
        ref={ref}
        {...rest}
      >
        {({ open }) => (
          <div
            style={
              {
                "--disclosure-duration": `${animationDuration}ms`,
                "--disclosure-easing": animationEasing,
              } as React.CSSProperties
            }
          >
            {typeof children === "function" ? children({ open }) : children}
          </div>
        )}
      </HeadlessDisclosure>
    </DisclosureAnimationContext.Provider>
  );
}

const Disclosure = forwardRef<HTMLDivElement, DisclosureComponentProps<"div">>(
  DisclosureInner,
);

interface IDisclosureButtonProps<T extends ElementType = "button"> {
  as?: T;
  disabled?: boolean;
  children: ReactNode | ((state: { open: boolean }) => ReactNode);
}

type DisclosureButtonComponentProps<T extends ElementType> =
  IDisclosureButtonProps<T> &
    Omit<ComponentPropsWithoutRef<T>, keyof IDisclosureButtonProps<T>>;

export const DisclosureButton = forwardRef<
  HTMLElement,
  DisclosureButtonComponentProps<ElementType>
>(({ as, disabled = false, children, className = "", style = {}, ...rest }) => {
  const Component = as || ("button" as ElementType);
  return (
    <HeadlessDisclosureButton
      as={Component}
      disabled={disabled}
      className={`disclosure-button ${className}`}
      style={{
        ...style,
        transition:
          "all var(--disclosure-duration, 300ms) var(--disclosure-easing, cubic-bezier(0.4, 0, 0.2, 1))",
      }}
      {...rest}
    >
      {({ open }) =>
        typeof children === "function" ? children({ open }) : children
      }
    </HeadlessDisclosureButton>
  );
});

DisclosureButton.displayName = "DisclosureButton";

interface IDisclosurePanelProps<T extends ElementType = "div"> {
  as?: T;
  children: ReactNode;
  static?: boolean;
  unmount?: boolean;
}

type DisclosurePanelComponentProps<T extends ElementType> =
  IDisclosurePanelProps<T> &
    Omit<ComponentPropsWithoutRef<T>, keyof IDisclosurePanelProps<T>>;

export const DisclosurePanel = forwardRef<
  HTMLDivElement,
  DisclosurePanelComponentProps<ElementType>
>(
  (
    {
      as,
      static: staticProp = true,
      children,
      unmount = false,
      className = "",
      style = {},
      ...rest
    },
    ref,
  ) => {
    const Component = as || ("div" as ElementType);
    const { duration, easing } = useContext(DisclosureAnimationContext);

    return (
      <HeadlessDisclosurePanel
        as={Component}
        static={staticProp}
        unmount={unmount}
        ref={ref}
        className={`disclosure-panel ${className}`}
        style={{
          ...style,
        }}
        {...rest}
      >
        {({ open }) => (
          <AnimatedPanel
            open={open}
            animationDuration={duration}
            animationEasing={easing}
          >
            {children}
          </AnimatedPanel>
        )}
      </HeadlessDisclosurePanel>
    );
  },
);

DisclosurePanel.displayName = "DisclosurePanel";

interface IAnimatedPanelProps {
  open: boolean;
  children: ReactNode;
  animationDuration: number;
  animationEasing: string;
}

const AnimatedPanel = ({
  open,
  children,
  animationDuration,
  animationEasing,
}: IAnimatedPanelProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | "auto">(0);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (open) {
      const scrollHeight = el.scrollHeight;
      setHeight(scrollHeight);

      const timer = setTimeout(() => {
        setHeight("auto");
      }, animationDuration);

      return () => clearTimeout(timer);
    } else {
      const currentHeight = el.scrollHeight;
      setHeight(currentHeight);

      void el.offsetHeight;

      setTimeout(() => {
        setHeight(0);
      }, 10);

      const timer = setTimeout(() => {}, animationDuration);

      return () => clearTimeout(timer);
    }
  }, [open, animationDuration]);

  return (
    <div
      ref={ref}
      style={{
        height: height === "auto" ? "auto" : `${height}px`,
        overflow: "hidden",
        transition: `height ${animationDuration}ms ${animationEasing}`,
        willChange: "height",
      }}
    >
      {children}
    </div>
  );
};

const DisclosureCompound = Object.assign(Disclosure, {
  Button: DisclosureButton,
  Panel: DisclosurePanel,
});

export { DisclosureCompound as Disclosure };
export default DisclosureCompound;
