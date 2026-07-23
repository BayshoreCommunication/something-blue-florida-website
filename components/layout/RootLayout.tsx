import { ReactNode } from "react";

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayoutComponent({ children }: RootLayoutProps) {
  return <div className="min-h-screen bg-white text-black">{children}</div>;
}
