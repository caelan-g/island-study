"use client";

import { useEffect, useState, useCallback } from "react";
import SubscribeButton from "@/components/ui/subscribe-button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { ChartArea, Check, CloudUpload, Infinity } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { userProps } from "@/components/types/user";
import { fetchUser } from "@/lib/user/fetch-user";
import { sessionProps } from "@/components/types/session";
import { courseProps } from "@/components/types/course";
import { islandProps } from "@/components/types/island";
import { fetchIslands } from "@/lib/island/fetch-islands";
import { fetchSessions } from "@/lib/sessions/fetch-sessions";
import { set } from "date-fns";

const currencies = {
  AUD: {
    monthly: 7.99,
    sixMonth: 39.99,
    lifetime: 99.99,
    symbol: "$",
    name: "AUD",
  },
  USD: {
    monthly: 4.99,
    sixMonth: 24.99,
    lifetime: 64.99,
    symbol: "$",
    name: "USD",
  },
  EUR: {
    monthly: 4.99,
    sixMonth: 21.99,
    lifetime: 54.99,
    symbol: "€",
    name: "EUR",
  },
  INR: {
    monthly: 499,
    sixMonth: 2299,
    lifetime: 5699,
    symbol: "₹",
    name: "INR",
  },
};

type Currency = keyof typeof currencies;

export default function SubscribePage() {
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>("AUD");

  const currentCurrency = currencies[selectedCurrency];

  const options = [
    {
      name: "Monthly Plan",
      price: currentCurrency.monthly,
      period: 1,
      periodText: "p/month",
      subtext: "Pay monthly, cancel anytime",
      island: 1,
      priceId: process.env.NEXT_PUBLIC_MONTHLY_PRICE_ID,
    },
    {
      name: "6-Month Plan",
      price: currentCurrency.sixMonth,
      period: 6,
      periodText: "p/month",
      subtext: `${currentCurrency.symbol}${currentCurrency.sixMonth} paid every 6 months, cancel anytime`,
      island: 2,
      priceId: process.env.NEXT_PUBLIC_6_MONTH_PRICE_ID,
    },
    {
      name: "Lifetime",
      period: 24,
      periodText: "p/month*",
      subtext: `${currentCurrency.symbol}${currentCurrency.lifetime} paid once, owned forever`,
      astrix: "*Assuming 2 years of use.",
      price: currentCurrency.lifetime,
      island: 4,
      priceId: process.env.NEXT_PUBLIC_LIFETIME_PRICE_ID,
    },
  ];

  const { user: authUser, loading: authLoading } = useAuth();
  const [islandCount, setIslandCount] = useState<number>(0);
  const [sessionCount, setSessionCount] = useState<number>(0);
  const [totalStudy, setTotalStudy] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  const initializeData = useCallback(async () => {
    setLoading(true);
    const islandData = await fetchIslands(authUser);
    const sessionData = await fetchSessions(authUser);

    if (islandData) setIslandCount(islandData.length);
    if (sessionData) {
      setSessionCount(sessionData.length);
      const totalMilliseconds = sessionData.reduce((acc, session) => {
        const startTime = new Date(session.start_time).getTime();
        const endTime = new Date(session.end_time).getTime();
        if (!isNaN(startTime) && !isNaN(endTime) && endTime > startTime) {
          return acc + (endTime - startTime);
        }
        return acc;
      }, 0);
      const totalSeconds = Math.round(totalMilliseconds / 1000);
      setTotalStudy(totalSeconds);
    }
    setLoading(false);
  }, [authUser]);

  useEffect(() => {
    if (!authLoading && authUser) {
      initializeData();
    }
  }, [authLoading, authUser, initializeData]);

  return (
    <div className="lg:min-h-screen w-full">
      <div className=" justify-center text-center pt-18 pb-4">
        <div className="font-semibold text-4xl mb-2">
          Invest in your study with Islands.
        </div>
        <div className="text-xl mb-1 lg:justify-center lg:text-center lg:flex">
          You've logged{" "}
          <span className="font-semibold ml-0.5 lg:ml-1.5">
            {Math.floor(totalStudy / 3600)} hours
          </span>
          , created{" "}
          <span className="font-semibold ml-0.5 lg:ml-1.5">
            {sessionCount} sessions
          </span>
          , and generated{" "}
          <span className="font-semibold ml-0.5 lg:ml-1.5">
            {islandCount} islands.
          </span>
        </div>
      </div>
      <div className="flex justify-center my-4">
        <div className="flex items-center gap-1 bg-muted/60 backdrop-blur-xl rounded-full p-1 border border-white/30">
          {(Object.keys(currencies) as Currency[]).map((currency) => (
            <Button
              key={currency}
              variant={selectedCurrency === currency ? "secondary" : "ghost"}
              className={cn(
                "rounded-full",
                selectedCurrency === currency &&
                  "shadow-sm bg-white transition-all"
              )}
              onClick={() => setSelectedCurrency(currency)}
            >
              {currency}
            </Button>
          ))}
        </div>
      </div>
      <section className="flex flex-col lg:flex-row gap-4">
        {options.map((option) => (
          <Card
            key={option.name}
            className="w-full hover:shadow-lg hover:-translate-y-1 transition-all "
          >
            <CardHeader>
              <CardTitle className="text-center font-semibold text-2xl">
                {option.name}
              </CardTitle>
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
              <h1 className="text-3xl font-bold">
                {currentCurrency.symbol}
                {(option.price / option.period).toFixed(2)}{" "}
                {currentCurrency.name}{" "}
                <span className="text-lg font-normal">{option.periodText}</span>
              </h1>
              <h2 className="text-md font-normal">{option.subtext}</h2>
              <div className="flex flex-col gap-1 text-sm mt-4">
                <p className="flex items-center">
                  <Check className="w-4 h-4 mr-1.5" />
                  Future features included
                </p>

                <p className="flex items-center">
                  <Infinity className="w-4 h-4 mr-1.5" />
                  Create{" "}
                  <span className="font-semibold mx-[.2rem]">
                    infinite
                  </span>{" "}
                  islands
                </p>
                <p className="flex items-center">
                  <ChartArea className="w-4 h-4 mr-1.5" />
                  Log{" "}
                  <span className="font-semibold mx-[.2rem]">
                    unlimited
                  </span>{" "}
                  study
                </p>
                <p className="flex items-center">
                  <CloudUpload className="w-4 h-4 mr-1.5" />
                  Cloud synced data
                </p>
              </div>
            </CardContent>
            <CardFooter className="block">
              <SubscribeButton priceId={option.priceId} />
              <p className="text-sm text-muted-foreground mt-1">
                Fast and secure checkout with Stripe
              </p>
              {option.astrix && (
                <p className="text-xs text-muted-foreground mt-1">
                  {option.astrix}
                </p>
              )}
            </CardFooter>
          </Card>
        ))}
      </section>
    </div>
  );
}
