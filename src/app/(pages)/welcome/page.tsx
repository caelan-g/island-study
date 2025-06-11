import OnboardingForm from "@/components/onboarding-form";
export default function Welcome() {
  //check for new users if they have island - two checks: 1. if island is in database/in user id 2. or if it got cut short and island is in buckets but not in database
  return (
    <div className="grow items-center">
      <OnboardingForm />
    </div>
  );
}
