import InfiniteMarqueeCTA from "@/components/ui/marquee";

export default function CTA() {
  const images = [
    {
      id: 1,
      src: "/images/landing/1.png",
      alt: "Island image 1",
    },
    {
      id: 2,
      src: "/images/landing/2.png",
      alt: "Island image 2",
    },
    {
      id: 3,
      src: "/images/landing/3.png",
      alt: "Island image 3",
    },
    {
      id: 4,
      src: "/images/landing/4.png",
      alt: "Island image 4",
    },
    {
      id: 5,
      src: "/images/landing/5.png",
      alt: "Island image 5",
    },
    {
      id: 6,
      src: "/images/landing/6.png",
      alt: "Island image 6",
    },
    {
      id: 7,
      src: "/images/landing/7.png",
      alt: "Island image 7",
    },
    {
      id: 8,
      src: "/images/landing/8.png",
      alt: "Island image 8",
    },
    {
      id: 9,
      src: "/images/landing/9.png",
      alt: "Island image 9",
    },
    {
      id: 10,
      src: "/images/landing/10.png",
      alt: "Island image 10",
    },
  ];
  return (
    <section className="mx-auto container">
      <div className="mx-auto my-10 max-w-7xl rounded-3xl p-2">
        <InfiniteMarqueeCTA images={images} />
      </div>
    </section>
  );
}
