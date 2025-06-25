import { MiniRadialChart } from "@/components/charts/mini-radial";
import { sessionProps } from "@/components/types/session";

interface GroupedSession {
  date: string;
  sessions: sessionProps[];
}

export const SessionDayCard = ({
  day,
  goal,
}: {
  day: GroupedSession;
  goal: number;
}) => {
  // Calculate total duration for the day
  const duration = day.sessions.reduce((total, session) => {
    return (
      total +
      (new Date(session.end_time).getTime() -
        new Date(session.start_time).getTime()) /
        1000 // Convert to seconds
    );
  }, 0);
  console.log(day.sessions[0]?.start_time);

  return (
    <div className="text-sm flex flex-col">
      <div className="text-muted-foreground text-center">
        {new Date(day.sessions[0]?.start_time).toLocaleDateString(undefined, {
          weekday: "short",
        })}
      </div>
      <MiniRadialChart
        chartData={[
          {
            total: duration,
            goal: goal, // Convert hours to seconds
            fill: "var(--chart-green)",
          },
        ]}
      />
    </div>
  );
};
