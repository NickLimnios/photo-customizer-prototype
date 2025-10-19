import type { FC, ReactNode } from "react";

interface MainContentProps {
  children: ReactNode;
}

const MainContent: FC<MainContentProps> = ({ children }) => (
  <main className="flex-1 bg-background">{children}</main>
);

export default MainContent;
