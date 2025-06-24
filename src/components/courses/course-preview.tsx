import { courseProps } from "@/components/types/course";
import { User } from "@supabase/supabase-js";

interface CoursePreviewProps {
  course: courseProps;
  user: User | null; // User object for authentication
  onEdit?: (session: courseProps) => void;
  onDelete?: () => void; // Optional callback for deletion
}

export function CoursePreview({ course }: CoursePreviewProps) {
  return (
    <div key={course.name}>
      <div className="flex flex-row text-sm gap-2 justify-between">
        <div className="flex gap-2 my-auto items-center">
          <div
            className="size-4 rounded-sm"
            style={{ backgroundColor: course.colour }}
          />
          <span>{course.name}</span>
        </div>
      </div>
    </div>
  );
}
