import SubscribeButton from "@/components/ui/subscribe-button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";

export default function SubscribePage() {
  const monthlyPrice = 7.99;
  const sixMonthPrice = 39.99;
  const lifetimePrice = 149.99;
  const options = [
    {
      name: "Monthly Plan",
      price: monthlyPrice,
      period: "per month",
      island: 1,
      priceId: process.env.MONTHLY_PRICE_ID,
    },
    {
      name: "6-Month Plan",
      price: sixMonthPrice,
      period: "every 6 months",
      island: 2,
      priceId: process.env["6_MONTH_PRICE_ID"],
    },
    {
      name: "Lifetime",
      period: "one-time",
      price: lifetimePrice,
      island: 4,
      priceId: process.env.LIFETIME_PRICE_ID,
    },
  ];
  return (
    <div className="h-screen w-full">
      <div className="font-semibold text-2xl mb-1">Choose your plan</div>
      <section className="flex flex-col lg:flex-row gap-4">
        {options.map((option) => (
          <Card key={option.name} className="w-full">
            <CardHeader>
              <CardTitle>{option.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <Image
                src={`/images/onboarding/step-${option.island}.png`}
                alt={`${option.name} Plan Island`}
                width={128}
                height={64}
                className="w-96 mx-auto h-auto mt-4 pixelated"
                unoptimized
              />
              <h1 className="text-3xl font-semibold">
                ${option.price}{" "}
                <span className="text-lg font-normal">{option.period}</span>
              </h1>
              <div className="flex flex-col gap-1 text-sm">
                <p>Future features included</p>

                <p>
                  Create <span className="font-semibold">infinite</span> islands
                </p>

                <p>
                  Log <span className="font-semibold">unlimited</span> study
                </p>
                <p>Cloud synced data</p>
              </div>
            </CardContent>
            <CardFooter className="block">
              <SubscribeButton priceId={option.priceId} />
            </CardFooter>
          </Card>
        ))}
      </section>
    </div>
  );
}
