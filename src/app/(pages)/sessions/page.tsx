"use client";
import { SessionCard } from "@/components/sessions/session-card";
import { fetchSessions } from "@/lib/sessions/fetch-sessions";
import { fetchCourses } from "@/lib/courses/fetch-courses";
import { useState, useEffect, useCallback } from "react";
import { sessionProps } from "@/components/types/session";
import { courseProps } from "@/components/types/course";
import { useAuth } from "@/contexts/auth-context";
import { EditSessionCard } from "@/components/sessions/edit-session-card";
import { SessionCardSkeleton } from "@/components/sessions/session-card-skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown, ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Sessions() {
  const { user: authUser, loading: authLoading } = useAuth();
  const [sessions, setSessions] = useState<sessionProps[]>([]);
  const [courses, setCourses] = useState<courseProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState<sessionProps | null>(
    null
  );
  const [periodFilter, setPeriodFilter] = useState<"all" | "week" | "month">(
    "all"
  );
  const [selectedCourses, setSelectedCourses] = useState<string[]>(["all"]);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const initializeData = useCallback(async () => {
    try {
      const [sessionData, courseData] = await Promise.all([
        fetchSessions(authUser),
        fetchCourses(authUser),
      ]);

      if (sessionData) setSessions(sessionData);
      if (courseData) setCourses(courseData);
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setLoading(false);
    }
  }, [authUser]);

  const handleSessionSubmit = async () => {
    setLoading(true);
    try {
      await initializeData();
      setSelectedSession(null); // Reset selection after update
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditSession = (session: sessionProps) => {
    setSelectedSession(session);
  };

  useEffect(() => {
    if (!authLoading && authUser) {
      initializeData();
    }
  }, [authLoading, authUser]);

  // Update filter logic
  const filteredSessions = sessions
    .filter((session) => {
      const matchesCourse =
        selectedCourses.includes("all") ||
        selectedCourses.includes(session.course_id);

      if (!matchesCourse) return false;

      if (periodFilter !== "all") {
        const date = new Date(session.start_time);
        const now = new Date();
        const daysDiff = Math.floor(
          (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (periodFilter === "week" && daysDiff > 7) return false;
        if (periodFilter === "month" && daysDiff > 30) return false;
      }

      return true;
    })
    .sort((a, b) => {
      const dateA = new Date(a.start_time).getTime();
      const dateB = new Date(b.start_time).getTime();
      return sortDirection === "desc" ? dateB - dateA : dateA - dateB;
    });

  // Replace the course filter with multi-select
  const CourseFilter = () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          {selectedCourses.length > 0
            ? selectedCourses.includes("all")
              ? "All Courses"
              : `${selectedCourses.length} selected`
            : "Select courses"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search courses..." />
          <CommandEmpty>No course found.</CommandEmpty>
          <CommandGroup>
            <CommandItem
              onSelect={() => {
                setSelectedCourses(["all"]);
              }}
            >
              <Check
                className={cn(
                  "mr-2 h-4 w-4",
                  selectedCourses.includes("all") ? "opacity-100" : "opacity-0"
                )}
              />
              All Courses
            </CommandItem>
            {courses.map((course) => (
              <CommandItem
                key={course.id}
                onSelect={() => {
                  setSelectedCourses((current) => {
                    if (current.includes("all")) {
                      return [course.id];
                    }

                    const updated = current.includes(course.id)
                      ? current.filter((id) => id !== course.id)
                      : [...current, course.id];

                    return updated.length === 0 ? ["all"] : updated;
                  });
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedCourses.includes(course.id)
                      ? "opacity-100"
                      : "opacity-0"
                  )}
                />
                <div className="flex items-center gap-2">
                  <div
                    className="size-3 rounded-sm"
                    style={{ backgroundColor: course.colour }}
                  />
                  {course.name}
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );

  // Update the filters card content
  return (
    <>
      <div className="text-2xl tracking-tight font-semibold">Sessions</div>
      <div className="flex flex-row w-full gap-4 justify-between items-start">
        <div className="flex flex-col gap-4 w-full">
          {loading ? (
            <>
              {Array.from({ length: 5 }).map((_, i) => (
                <SessionCardSkeleton key={i} />
              ))}
            </>
          ) : (
            <>
              {filteredSessions.map((session) => (
                <SessionCard
                  key={session.id}
                  session={session}
                  courses={courses}
                  onClick={() => handleEditSession(session)}
                  isSelected={selectedSession?.id === session.id}
                />
              ))}
            </>
          )}
        </div>
        <div className="flex flex-col gap-4 h-full">
          <Card>
            <CardHeader>
              <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-row gap-2">
              <div className="grid w-full items-center">
                <Label className="text-xs font-bold">Courses</Label>
                <CourseFilter />
              </div>

              <div className="grid w-full items-center">
                <Label className="text-xs font-bold">Sort Direction</Label>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() =>
                    setSortDirection((d) => (d === "asc" ? "desc" : "asc"))
                  }
                >
                  {sortDirection === "desc" ? "Newest First" : "Oldest First"}
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </div>

              <div className="grid w-full items-center">
                <Label className="text-xs font-bold" htmlFor="period">
                  Time Period
                </Label>
                <Select
                  value={periodFilter}
                  onValueChange={(value: "all" | "week" | "month") =>
                    setPeriodFilter(value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select time period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="week">Last Week</SelectItem>
                    <SelectItem value="month">Last Month</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
          <div className="relative h-full">
            <div className="sticky top-0 z-10">
              <EditSessionCard
                courses={courses}
                sessionProps={selectedSession}
                onSubmitSuccess={handleSessionSubmit}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
