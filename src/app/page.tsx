import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function LandingPage() {
  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-4xl font-bold">Landing Page </h1>
        <p>8=================D</p>
        <Button asChild>
          <Link href="/dashboard">Login</Link>
        </Button>
      </div>
    </>
  );
}
