import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="border-t bg-background">
    <div className="container flex flex-col items-center justify-between gap-4 py-10 text-sm text-muted-foreground md:flex-row">
      <div>© {new Date().getFullYear()} LumiBook</div>
      <div className="flex items-center gap-6">
        <Link to="/about" className="hover:text-foreground">
          About
        </Link>
        <Link to="/support" className="hover:text-foreground">
          Support
        </Link>
        <Link to="/privacy" className="hover:text-foreground">
          Privacy
        </Link>
      </div>
    </div>
  </footer>
);

export default Footer;
