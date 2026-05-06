export const Footer = () => (
  <footer className="border-t border-border py-10">
    <div className="container flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
      <div className="flex items-center gap-2 font-display">
        <span className="w-2 h-2 rounded-full bg-gradient-accent" />
        <span>
          Powered by{" "}
          <a
            href="https://www.nellidesign.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground font-medium hover:underline"
          >
            NelliDESiGN
          </a>
        </span>
      </div>
      <p>© {new Date().getFullYear()} NelliDESiGN · Brochure Design Expert in India</p>
    </div>
  </footer>
);
