export default function IslandTag({ type }: { type: string }) {
  switch (type) {
    case "tropical":
      return (
        <p className="select-none text-sm rounded-full text-cyan-500 border-cyan-500 border bg-cyan-100 dark:bg-cyan-500 dark:text-background flex px-2 py-1">
          Tropical
        </p>
      );
    case "winter":
      return (
        <p className="select-none text-sm rounded-full text-blue-500 border-blue-500 border bg-blue-100 dark:bg-blue-500 dark:text-background flex px-2 py-1">
          Winter
        </p>
      );
    case "mountain":
      return (
        <p className="select-none text-sm rounded-full text-slate-500 border-slate-500 border bg-slate-100 dark:bg-slate-500 dark:text-background flex px-2 py-1">
          Mountain
        </p>
      );
    case "autumn":
      return (
        <p className="select-none text-sm rounded-full text-orange-500 border-orange-500 border bg-orange-100 dark:bg-orange-500 dark:text-background flex px-2 py-1">
          Autumn
        </p>
      );
    case "crystal":
      return (
        <p className="select-none text-sm rounded-full text-purple-500 border-purple-500 border bg-purple-100 dark:bg-purple-500 dark:text-background flex px-2 py-1">
          Crystal
        </p>
      );
    case "volcanic":
      return (
        <p className="select-none text-sm rounded-full text-red-500 border-red-500 border bg-red-100 dark:bg-red-500 dark:text-background flex px-2 py-1">
          Volcanic
        </p>
      );
  }
}
