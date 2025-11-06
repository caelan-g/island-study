export default function Footer() {
  return (
    <footer className="w-full text-center mt-24 mb-6 z-50">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="2 2 20 15"
        stroke="currentColor"
        className="size-6 mx-auto"
      >
        <path
          d="m21 7.5-9-4.25L3 7.5v4l9 4.25 9-4.25z"
          fill="#fff"
          stroke="none"
        />
        <path
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m21 7.5-9-4.25L3 7.5m18 0-9 4.25m9-4.25v4l-9 4.25M3 7.5l9 4.25M3 7.5v4l9 4.25m0-4v4"
        />
      </svg>
      <h4 className="tracking-tight">
        <span className="font-semibold">Islands</span>. Gamified study tracking.
      </h4>
      <p className="text-sm">&copy; {new Date().getFullYear()} Islands</p>
      <div className="flex flex-row gap-4 text-xs justify-center text-muted-foreground mt-2">
        <a href="/privacy-policy">Privacy Policy</a>
        <a href="/terms-of-service">Terms of Service</a>
        <a href="mailto:contact@islands.study">Report an Issue</a>
        <a>ABN 21 718 700 624</a>
      </div>
    </footer>
  );
}
