import React from "react";

interface PageBodyProps {
  children: React.ReactNode;
}

const PageBody: React.FC<PageBodyProps> = ({ children }) => (
  <div className="space-y-4">{children}</div>
);

export default PageBody;
