import { courseProps } from "@/components/types/course";
import { Card, CardHeader } from "@/components/ui/card";
import { Ellipsis } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

interface CourseCardProps {
  course: courseProps;
  onEdit: (session: courseProps) => void;
}

export function CourseCard({ course, onEdit }: CourseCardProps) {
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
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Ellipsis size={16} />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => onEdit(course)}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
    </Card>
  );
}
