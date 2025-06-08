import React from "react";

interface PageHeaderProps {
  children: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({ children }) => (
  <h1 className="text-3xl font-bold mb-6 text-text-primary">{children}</h1>
);

export default PageHeader;
