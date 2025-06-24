"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState, useEffect, useCallback } from "react";
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
import { Switch } from "@/components/ui/switch";
import { fetchUser } from "@/lib/user/fetch-user";
import { userProps } from "@/components/types/user";
import { useAuth } from "@/contexts/auth-context";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User, Palette, Shield, Lock, Trash2 } from "lucide-react";
import { updateUser } from "@/lib/user/update-user";
import { createClient } from "@/lib/supabase/client";

const sidebarItems = [
  { id: "profile", label: "Profile", icon: User },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "account", label: "Account", icon: Lock },
  { id: "privacy", label: "Privacy", icon: Shield },
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

/*

const appearanceSchema = z.object({
  theme: z.enum(["light", "dark", "system"]),
  language: z.enum(["en", "es", "fr", "de"]),
  compactMode: z.boolean(),
});



const privacySchema = z.object({
  profileVisibility: z.boolean(),
  analytics: z.boolean(),
  thirdPartyCookies: z.boolean(),
  dataRetention: z.enum(["30days", "6months", "1year", "forever"]),
});

*/

export default function SettingsPage() {
  const { user: authUser } = useAuth();
  const [activeSection, setActiveSection] = useState("profile");
  const [user, setUser] = useState<userProps | null>(null);

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

  const profileForm = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      email: authUser?.email || "",
      goal: user?.goal || 4,
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

  /*

  const appearanceForm = useForm<z.infer<typeof appearanceSchema>>({
    resolver: zodResolver(appearanceSchema),
    defaultValues: {
      theme: "system",
      language: "en",
      compactMode: false,
    },
  });

  

  const privacyForm = useForm<z.infer<typeof privacySchema>>({
    resolver: zodResolver(privacySchema),
    defaultValues: {
      profileVisibility: true,
      analytics: true,
      thirdPartyCookies: false,
      dataRetention: "1year",
    },
  });
  */

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
      toast.success("Profile updated successfully");
      initializeUser(); // Refresh user data after update
    }
  }

  /*
  async function onAppearanceSubmit(values: z.infer<typeof appearanceSchema>) {
    // Handle appearance update
    console.log(values);
  }
*/
  /*
  async function onPrivacySubmit(values: z.infer<typeof privacySchema>) {
    // Handle privacy settings update
    console.log(values);
  }*/

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
                  <Label htmlFor="goal">Daily Goal (seconds lol)</Label>
                  <Input
                    {...profileForm.register("goal", { valueAsNumber: true })}
                    type="number"
                  />
                  {profileForm.formState.errors.goal && (
                    <p className="text-sm text-destructive">
                      {profileForm.formState.errors.goal.message}
                    </p>
                  )}
                </div>
                <Button type="submit">Save changes</Button>
              </form>
            </CardContent>
          </Card>
        );

      case "appearance":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Customize how the application looks and feels.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Theme</Label>
                <Select defaultValue="system">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Language</Label>
                <Select defaultValue="en">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Compact mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Use a more compact layout to fit more content on screen.
                  </p>
                </div>
                <Switch />
              </div>
              <Button>Save changes</Button>
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
              </CardContent>
            </Card>

            <Card className="border-destructive">
              <CardHeader>
                <CardTitle className="text-destructive">Danger Zone</CardTitle>
                <CardDescription>
                  Irreversible and destructive actions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="destructive" className="w-full">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Account
                </Button>
              </CardContent>
            </Card>
          </div>
        );

      case "privacy":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Privacy</CardTitle>
              <CardDescription>
                Control your privacy and data sharing preferences.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Profile visibility</Label>
                  <p className="text-sm text-muted-foreground">
                    Make your profile visible to other users.
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Analytics</Label>
                  <p className="text-sm text-muted-foreground">
                    Help us improve by sharing anonymous usage data.
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Third-party cookies</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow third-party services to set cookies.
                  </p>
                </div>
                <Switch />
              </div>
              <div className="space-y-2">
                <Label>Data retention</Label>
                <Select defaultValue="1year">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30days">30 days</SelectItem>
                    <SelectItem value="6months">6 months</SelectItem>
                    <SelectItem value="1year">1 year</SelectItem>
                    <SelectItem value="forever">Forever</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button>Save preferences</Button>
            </CardContent>
          </Card>
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
                width: `${100 / sidebarItems.length - 0.5}%`,
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
