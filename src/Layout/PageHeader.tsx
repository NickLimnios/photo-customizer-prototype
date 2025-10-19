import type { FC, ReactNode } from "react";

interface PageHeaderProps {
  children: ReactNode;
}

const PageHeader: FC<PageHeaderProps> = ({ children }) => (
  <div className="space-y-2">
    <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
      {children}
    </h1>
  </div>
);

export default PageHeader;
