import { courseProps } from "@/components/types/course";
import { Card, CardHeader } from "@/components/ui/card";
import { Ellipsis } from "lucide-react";
import { deleteCourse } from "@/lib/courses/delete-course";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { User } from "@supabase/supabase-js";
import { toast } from "sonner";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Pencil, Trash2 } from "lucide-react";

interface CourseCardProps {
  course: courseProps;
  user: User | null; // User object for authentication
  onEdit?: (session: courseProps) => void;
  onDelete?: () => void; // Optional callback for deletion
}

export function CourseCard({
  course,
  user,
  onEdit,
  onDelete,
}: CourseCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteCourse(course, user);
      toast.success("Course deleted");
      onDelete?.();
    } catch (error) {
      console.error("Failed to delete course:", error);
      toast.error("Failed to delete course");
    }
  };

  return (
    <Card key={course.name}>
      <CardHeader className="flex flex-row text-xl font-bold gap-2 justify-between">
        <div className="flex gap-2">
          <div
            className="size-8 rounded-sm"
            style={{ backgroundColor: course.colour }}
          />
          <span>{course.name}</span>
        </div>
        {onEdit ? (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Ellipsis size={16} />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => onEdit(course)}>
                <Pencil className="text-primary" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setShowDeleteDialog(true)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="text-destructive" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null}
      </CardHeader>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete &quot;{course.name}&quot; and cannot
              be undone. All associated sessions will be deleted as well.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="w-full">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="w-full bg-destructive text-primary-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
