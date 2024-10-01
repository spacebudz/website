import * as React from "react";

export function useIsIntersecting(
  ref: React.RefObject<Element>,
  options?: IntersectionObserverInit & { once?: boolean },
  onIntersection?: () => unknown,
) {
  const [isIntersecting, setIsIntersecting] = React.useState<boolean>();

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        if (entry.isIntersecting && options?.once) observer.disconnect();
      },
      options,
    );
    if (ref.current) observer.observe(ref.current);
    return () => {
      observer.disconnect();
    };
  }, []);

  React.useEffect(() => {
    if (isIntersecting) onIntersection?.();
  }, [isIntersecting]);

  return isIntersecting;
}
