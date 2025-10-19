import type { FC, ReactNode } from "react";

import PageHeader from "./PageHeader";
import PageBody from "./PageBody";

interface PageLayoutProps {
  title: ReactNode;
  children: ReactNode;
}

const PageLayout: FC<PageLayoutProps> = ({ title, children }) => (
  <div className="bg-background py-12 md:py-16">
    <div className="container max-w-5xl space-y-8">
      <PageHeader>{title}</PageHeader>
      <PageBody>{children}</PageBody>
    </div>
  </div>
);

export default PageLayout;
