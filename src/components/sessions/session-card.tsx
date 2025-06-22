import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Ellipsis, Pencil, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { sessionProps } from "@/components/types/session";
import { courseProps } from "@/components/types/course";
import { timeFilter } from "@/lib/filters/time-filter";
import { deleteSession } from "@/lib/sessions/delete-session";
import { User } from "@supabase/supabase-js";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

export const SessionCard = ({
  session,
  courses,
  user,
  onEdit,
  onDelete, // Add this prop
}: {
  session: sessionProps;
  courses: courseProps[];
  user: User | null;
  onEdit?: (session: sessionProps) => void;
  onDelete?: () => void; // Add this type
}) => {
  const [course, setCourse] = useState<courseProps | null>(null);

  useEffect(() => {
    const foundCourse = courses.find((c) => c.id === session.course_id);
    setCourse(foundCourse || null);
  }, [courses, session.course_id]);

  const handleDelete = async () => {
    try {
      await deleteSession(session, user);
      toast.success("Session deleted");
      onDelete?.(); // Call onDelete callback to refresh parent
    } catch (error) {
      console.error("Failed to delete session:", error);
      toast.error("Failed to delete session");
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex flex-row justify-between">
          <div className="truncate">{course?.name || "Unknown Course"}</div>
          <div>
            {timeFilter(
              (new Date(session.end_time).getTime() -
                new Date(session.start_time).getTime()) /
                1000
            )}
          </div>
        </CardTitle>
        <CardDescription>
          {session.end_time
            ? new Date(session.end_time).toLocaleDateString()
            : new Date(session.start_time).toLocaleDateString()}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-row justify-between">
        {session.end_time ? (
          <>
            <div className="truncate">
              {session.description || "No description available"}
              <p className="text-sm text-gray-500">
                {new Date(session.start_time).toLocaleTimeString()} -{" "}
                {new Date(session.end_time).toLocaleTimeString()}
              </p>
            </div>
            {onEdit ? (
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Ellipsis size={16} />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => onEdit(session)}>
                    <Pencil className="text-primary" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleDelete}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="text-destructive" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : null}
          </>
        ) : (
          <div>Started {new Date(session.start_time).toLocaleTimeString()}</div>
        )}
      </CardContent>
    </Card>
  );
};
