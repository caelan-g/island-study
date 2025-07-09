export default function About() {
  return (
    <div className="relative min-h-screen w-full mx-8">
      {/* Text and buttons aligned to the left */}
      <div className="lg:pl-36 relative z-10">
        <div className="font-normal text-xl tracking-tight pt-24 lg:pt-48">
          Goal
        </div>
        <div className="font-semibold text-5xl md:text-2xl lg:text-3xl tracking-tight mt-2">
          Make studying rewarding.
        </div>
        <div className="font-normal text-xl tracking-tight pt-12">
          To accomplish this, we are...
        </div>
        <div className="font-semibold text-5xl md:text-2xl lg:text-3xl tracking-tight mt-2">
          Developing a study app which is intuitive, engaging, and completely
          unique to you.
        </div>
      </div>
    </div>
  );
}
