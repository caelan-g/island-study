import { CheckCircle } from "lucide-react";

export default function CompletionStep() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mb-4 rounded-full bg-primary/10 p-3">
        <CheckCircle className="h-12 w-12 text-primary" />
      </div>
      <h2 className="text-2xl font-bold">Setup Complete!</h2>
      <p className="mt-2 max-w-md text-muted-foreground">
        Thank you for completing the onboarding process. Your account has been
        set up successfully.
      </p>
    </div>
  );
}
