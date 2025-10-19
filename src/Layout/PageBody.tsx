import type { FC, ReactNode } from "react";

interface PageBodyProps {
  children: ReactNode;
}

const PageBody: FC<PageBodyProps> = ({ children }) => (
  <div className="space-y-6 sm:space-y-8">{children}</div>
);

export default PageBody;
