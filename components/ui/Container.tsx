import type { ElementType, ReactNode } from "react";

export function Container({
  as: Tag = "div",
  className,
  children,
}: {
  as?: ElementType;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Tag className={["container-x", className].filter(Boolean).join(" ")}>
      {children}
    </Tag>
  );
}
