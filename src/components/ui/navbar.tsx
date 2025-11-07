import Link from "next/link";
import { Button } from "@/components/ui/button";

export function LandingNavigationMenu() {
  const navlinks = [
    { name: "Islands.", href: "/" },
    { name: "Features", href: "/#features" },
    { name: "Info", href: "/#info" },
    { name: "Pricing", href: "/pricing" },
  ];
  return (
    <div className="w-full text-sm lg:px-8">
      <div className="flex justify-between items-center p-4">
        <div className="hidden md:flex space-x-4">
          {navlinks.map((link) => (
            <Button variant="link" asChild key={link.name}>
              <Link href={link.href}>{link.name}</Link>
            </Button>
          ))}
        </div>

        <Button variant="link" className="flex md:hidden text-sm" asChild>
          <Link href="/">Islands.</Link>
        </Button>

        <div className="space-x-4">
          <Button variant="ghost" asChild>
            <Link href="/auth/login" className="">
              Login
            </Link>
          </Button>
          <Button asChild>
            <Link href="/auth/sign-up" className="">
              Sign Up
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
