export default function Footer() {
  return (
    <footer className="w-full text-center mt-24 mb-6 z-50">
      <h4 className="tracking-tight">
        <span className="font-semibold">Islands</span>. Gamified study tracking.
      </h4>
      <p className="text-sm">&copy; {new Date().getFullYear()} Islands</p>
      <div className="flex flex-row gap-4 text-xs justify-center text-muted-foreground mt-2">
        <a href="/privacy-policy">Privacy Policy</a>
      </div>
    </footer>
  );
}
