"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { fetchUser } from "@/lib/user/fetch-user";
import { userProps } from "@/components/types/user";
import { useAuth } from "@/contexts/auth-context";
import { toast } from "sonner";
import { User, RotateCcw, Lock, Trash2 } from "lucide-react";
import { updateUser } from "@/lib/user/update-user";
import { createClient } from "@/lib/supabase/client";
import TimePicker from "@/components/ui/time-picker";
import { resetIsland } from "@/lib/island/reset-island";
import { weekEndIsland } from "@/lib/island/week-end-island";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import ManageSubscriptionButton from "@/components/ui/manage-subscription-button";

const sidebarItems = [
  { id: "profile", label: "Profile", icon: User },
  { id: "reset", label: "Reset", icon: RotateCcw },
  { id: "account", label: "Account", icon: Lock },
];

const profileSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters"),
  email: z.string().email(),
  goal: z
    .number()
    .min(1200, "Please set at least a 20 minute goal")
    .max(46800, "Maximum goal is 13 hours ~ you need to live as well!"),
});

const accountSchema = z
  .object({
    currentPassword: z.string().min(6, "Current password is required"),
    newPassword: z
      .string()
      .min(6, "New password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Passwords must match"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export default function SettingsPage() {
  const { user: authUser } = useAuth();
  const [activeSection, setActiveSection] = useState("profile");
  const [user, setUser] = useState<userProps | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  //const [isDarkTheme, setIsDarkTheme] = useState(false);

  const initializeUser = useCallback(async () => {
    try {
      const userData = await fetchUser(authUser);
      if (userData) setUser(userData);
    } catch (error) {
      console.error("Failed to load user:", error);
    }
  }, [authUser]);

  useEffect(() => {
    initializeUser();
  }, [initializeUser]);

  useEffect(() => {
    // Check initial theme from localStorage or system preference
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    // Set initial state based on saved preference or system default
    const initialIsDark =
      savedTheme === "dark" || (savedTheme === null && prefersDark);

    //setIsDarkTheme(initialIsDark);

    // Apply theme on initial load
    document.documentElement.classList.toggle("dark", initialIsDark);
  }, []);

  const profileForm = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      email: authUser?.email || "",
      goal: user?.goal || 1,
    },
  });

  const accountForm = useForm<z.infer<typeof accountSchema>>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Helper function to convert seconds to HH:mm format
  const secondsToTimeString = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
  };

  // Helper function to convert HH:mm format to seconds
  const timeStringToSeconds = (timeString: string): number => {
    const [hours, minutes] = timeString.split(":").map(Number);
    return hours * 3600 + minutes * 60;
  };

  useEffect(() => {
    if (user) {
      profileForm.reset({
        name: user?.name || "",
        email: authUser?.email || "",
        goal: user?.goal || 4,
      });
    }
  }, [profileForm, user]);

  async function onProfileSubmit(values: z.infer<typeof profileSchema>) {
    if (!user) return;
    try {
      await updateUser(user.id, values.name, values.goal, authUser);
    } catch (error) {
      console.error("Failed to update user:", error);
      toast.error("Failed to update profile");
    } finally {
      initializeUser(); // Refresh user data after update
    }
  }

  const handleDeleteAccount = async () => {
    if (!authUser) return;

    try {
      setIsDeleting(true);
      const supabase = createClient();
      await supabase.rpc("delete_user");
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) {
        throw signOutError;
      }
      toast.success("Account deleted successfully");
      window.location.href = "/";
    } catch (error) {
      console.error("Failed to delete account:", error);
      toast.error("Failed to delete account");
    } finally {
      setIsDeleting(false);
    }
  };

  const getSliderPosition = () => {
    const index = sidebarItems.findIndex((item) => item.id === activeSection);
    return `${index * 100}%`;
  };

  const renderContent = () => {
    switch (activeSection) {
      case "profile":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>
                Update your profile information and how others see you.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={profileForm.handleSubmit(onProfileSubmit)}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input {...profileForm.register("name")} />
                  {profileForm.formState.errors.name && (
                    <p className="text-sm text-destructive">
                      {profileForm.formState.errors.name.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    {...profileForm.register("email")}
                    disabled
                    type="email"
                  />
                  {profileForm.formState.errors.email && (
                    <p className="text-sm text-destructive">
                      {profileForm.formState.errors.email.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="goal">Daily Goal</Label>
                  {user?.goal ? (
                    <div className="flex flex-row mx-12">
                      <TimePicker
                        mode="duration"
                        value={secondsToTimeString(user.goal)}
                        onChange={(value) => {
                          profileForm.setValue(
                            "goal",
                            timeStringToSeconds(value)
                          );
                        }}
                      />
                    </div>
                  ) : null}
                  {profileForm.formState.errors.goal && (
                    <p className="text-sm text-destructive">
                      {profileForm.formState.errors.goal.message}
                    </p>
                  )}
                </div>
                {/* <div className="space-y-2">
                  <Label htmlFor="theme">Theme</Label>
                  <div className="flex items-center space-x-2 mb-8">
                  <Switch
                    id="theme"
                    checked={isDarkTheme}
                    onCheckedChange={(checked) => {
                    // Update state
                    setIsDarkTheme(checked);

                    // Update DOM
                    document.documentElement.classList.toggle(
                      "dark",
                      checked
                    );

                    // Save preference
                    localStorage.setItem(
                      "theme",
                      checked ? "dark" : "light"
                    );
                    }}
                  />

                  <Label htmlFor="theme">
                    Dark mode{" "}
                    <span className="text-muted-foreground font-normal">
                    (not recommended)
                    </span>
                  </Label>
                  </div>
                </div> */}
                <Button type="submit" className="mt-6">
                  Save Changes
                </Button>
              </form>
            </CardContent>
          </Card>
        );

      case "reset":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Reset</CardTitle>
              <CardDescription>
                Start a new island. This will archive your current island.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="destructive"
                className="w-full"
                onClick={async () => {
                  toast.success("Resetting island...");
                  await resetIsland(authUser);
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Reset Island
              </Button>

              <h1 className="font-semibold text-2xl mt-12">End Week Early</h1>
              <p className="text-sm text-muted-foreground mb-6">
                This will end your island&apos;s week early, resetting your
                island in the process.
              </p>
              <Button
                variant="destructive"
                className="w-full"
                onClick={async () => {
                  toast.success("Simulating... Please return to dashboard.");
                  await weekEndIsland(authUser);
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                End
              </Button>
            </CardContent>
          </Card>
        );

      case "account":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>
                  Update your password to keep your account secure.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <form
                  onSubmit={accountForm.handleSubmit(async (data) => {
                    try {
                      const supabase = createClient();

                      // First verify current password
                      const { error: signInError } =
                        await supabase.auth.signInWithPassword({
                          email: authUser?.email || "",
                          password: data.currentPassword,
                        });

                      if (signInError) {
                        toast.error("Current password is incorrect");
                        return;
                      }

                      // If current password is correct, update to new password
                      const { error: updateError } =
                        await supabase.auth.updateUser({
                          password: data.newPassword,
                        });

                      if (updateError) throw updateError;

                      toast.success("Password updated successfully");
                      accountForm.reset();
                    } catch (error) {
                      console.error("Failed to update password:", error);
                      toast.error("Failed to update password");
                    }
                  })}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current password</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      {...accountForm.register("currentPassword")}
                    />
                    {accountForm.formState.errors.currentPassword && (
                      <p className="text-sm text-destructive">
                        {accountForm.formState.errors.currentPassword.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      {...accountForm.register("newPassword")}
                    />
                    {accountForm.formState.errors.newPassword && (
                      <p className="text-sm text-destructive">
                        {accountForm.formState.errors.newPassword.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">
                      Confirm new password
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      {...accountForm.register("confirmPassword")}
                    />
                    {accountForm.formState.errors.confirmPassword && (
                      <p className="text-sm text-destructive">
                        {accountForm.formState.errors.confirmPassword.message}
                      </p>
                    )}
                  </div>
                  <Button type="submit" className="mt-4">
                    Update password
                  </Button>
                </form>
                <div>
                  <h1 className="font-semibold text-2xl mt-12">
                    Manage Subscription
                  </h1>
                  <p className="text-sm text-muted-foreground mb-6">
                    Click the button below to manage your subscription. You will
                    be redirected to the customer portal.
                  </p>
                </div>
                {user?.is_subscribed ? (
                  <ManageSubscriptionButton />
                ) : (
                  <Button asChild>
                    <Link href="/subscribe">Upgrade Now</Link>
                  </Button>
                )}
              </CardContent>
            </Card>

            <Card className="border-destructive">
              <CardHeader>
                <CardTitle className="text-destructive">
                  Delete Your Account
                </CardTitle>
                <CardDescription>
                  Once you delete your account, there is no going back. Please
                  be certain.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="w-full">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Account
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete your account and remove your data from our
                        servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="w-full">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDeleteAccount}
                        disabled={isDeleting}
                        className="bg-destructive w-full text-background hover:bg-destructive/90"
                      >
                        {isDeleting ? "Deleting..." : "Delete Account"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardContent>
            </Card>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <h1 className="font-semibold tracking-tight text-2xl">Settings</h1>
      <div className="flex-1 p-2">
        <div className="mx-auto max-w-2xl space-y-2">
          <Card className="space-x-2 flex mx-auto text-center border p-2 rounded-lg relative">
            {/* Add the sliding background */}
            <motion.div
              className="absolute h-[80%] top-[10%] rounded-lg bg-muted"
              initial={false}
              animate={{
                x: getSliderPosition(),
                width: `${100 / sidebarItems.length - 0.7}%`,
              }}
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 50,
              }}
            />

            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`justify-center cursor-pointer right-[0.5em] relative flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-transparent ${
                    activeSection === item.id
                      ? "font-medium text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </button>
              );
            })}
          </Card>
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
