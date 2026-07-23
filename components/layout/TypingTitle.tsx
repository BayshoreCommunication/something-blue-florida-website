"use client";

import {
  Children,
  CSSProperties,
  ElementType,
  ReactElement,
  ReactNode,
  cloneElement,
  isValidElement,
  useEffect,
  useRef,
  useState,
} from "react";

type TypingTitleProps = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  id?: string;
};

type ChildElement = ReactElement<{ children?: ReactNode }>;

function getTextContent(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }

  if (Array.isArray(node)) {
    return node.map(getTextContent).join("");
  }

  if (isValidElement<{ children?: ReactNode }>(node)) {
    return getTextContent(node.props.children);
  }

  return "";
}

function renderStaggeredText(
  node: ReactNode,
  nextIndex: () => number
): ReactNode {
  if (typeof node === "string" || typeof node === "number") {
    return String(node)
      .split(/(\s+)/)
      .map((token, tokenIndex) => {
        if (!token) {
          return null;
        }

        if (token.trim() === "") {
          return token.split("").map((char, whitespaceIndex) => {
            if (char === "\n") {
              return <br key={`break-${tokenIndex}-${whitespaceIndex}`} />;
            }

            return char;
          });
        }

        return (
          <span key={`${token}-${tokenIndex}`} className="typing-title__word">
            {token.split("").map((char, charLocalIndex) => {
              const charIndex = nextIndex();

              return (
                <span
                  key={`${char}-${charLocalIndex}-${charIndex}`}
                  className="typing-title__char"
                  style={{ "--char-index": charIndex } as CSSProperties}
                >
                  {char}
                </span>
              );
            })}
          </span>
        );
      });
  }

  if (Array.isArray(node)) {
    return Children.map(node, (child) => renderStaggeredText(child, nextIndex));
  }

  if (isValidElement<{ children?: ReactNode }>(node)) {
    const element = node as ChildElement;

    return cloneElement(
      element,
      undefined,
      renderStaggeredText(element.props.children, nextIndex)
    );
  }

  return node;
}

export default function TypingTitle({
  as: Component = "h2",
  children,
  className = "",
  id,
}: TypingTitleProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;

    if (!node) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  let charIndex = 0;
  const accessibleText = getTextContent(children);
  const animatedChildren = renderStaggeredText(children, () => charIndex++);

  return (
    <Component
      id={id}
      ref={ref}
      aria-label={accessibleText || undefined}
      className={`typing-title ${isVisible ? "is-visible" : ""} ${className}`}
    >
      <span className="typing-title__content" aria-hidden={!!accessibleText}>
        {animatedChildren}
      </span>
    </Component>
  );
}
