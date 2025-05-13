const Footer = () => (
  <footer className="bg-topbar text-sm text-text-secondary py-4 mt-auto">
    <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center">
      <p>&copy; 2025 Photobook. All rights reserved.</p>
      <div className="flex space-x-4 mt-2 sm:mt-0">
        <a href="/about" className="hover:text-accent-bluegray">
          About
        </a>
        <a href="/contact" className="hover:text-accent-bluegray">
          Contact
        </a>
        <a href="/privacy" className="hover:text-accent-bluegray">
          Privacy Policy
        </a>
      </div>
    </div>
  </footer>
);

export default Footer;
