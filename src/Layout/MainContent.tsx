import React from "react";

interface MainContentProps {
  children: React.ReactNode;
}

const MainContent: React.FC<MainContentProps> = ({ children }) => {
  return <main className="flex-grow">{children}</main>;
};

export default MainContent;
