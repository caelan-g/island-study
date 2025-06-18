import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                Your email has been confirmed!
              </CardTitle>
              <CardDescription>Log in to continue</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <p className="text-sm text-muted-foreground">
                  You&apos;ve successfully confirmed your email. Please sign in
                  to continue.
                </p>
                <Button className="w-full" asChild>
                  <a href="/auth/login">Sign in</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
