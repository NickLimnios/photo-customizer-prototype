import React from "react";
import PageHeader from "./PageHeader";
import PageBody from "./PageBody";

interface PageLayoutProps {
  title: React.ReactNode;
  children: React.ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ title, children }) => (
  <div className="max-w-7xl mx-auto px-4 py-8 tablet:py-12 desktop:py-16">
    <PageHeader>{title}</PageHeader>
    <PageBody>{children}</PageBody>
  </div>
);

export default PageLayout;
