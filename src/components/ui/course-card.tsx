import { courseProps } from "@/components/types/course";
import { Card, CardHeader } from "@/components/ui/card";

interface CourseCardProps {
  course: courseProps;
}

export function CourseCard({ course }: CourseCardProps) {
  return (
    <Card key={course.name}>
      <CardHeader className="flex flex-row text-xl font-bold gap-2">
        <div
          className="size-8 rounded-sm"
          style={{ backgroundColor: course.colour }}
        />
        <span>{course.name}</span>
      </CardHeader>
    </Card>
  );
}
