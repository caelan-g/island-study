"use client";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useSpring, animated, useTrail } from "@react-spring/web";
import { useGesture } from "@use-gesture/react";
import { islandProps } from "@/components/types/island";
import { fetchIslands } from "@/lib/island/fetch-islands";
import { useAuth } from "@/contexts/auth-context";
import IslandSelect from "@/components/ui/island-select";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { fetchSessions } from "@/lib/sessions/fetch-sessions";
import { Spinner } from "@/components/ui/spinner";

export default function Islands() {
  const { user: authUser, loading: authLoading } = useAuth();
  const [islands, setIslands] = useState<islandProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState(1);
  const [selectedIsland, setSelectedIsland] = useState<islandProps | null>(
    null
  );
  const [isPanelVisible, setIsPanelVisible] = useState(false);
  const [maxRow, setMaxRow] = useState(0);
  const viewportRef = useRef(null);
  const [sessionCount, setSessionCount] = useState<number>(0);
  const [totalStudy, setTotalStudy] = useState<number>(0);

  // Map island ids to their index for animation ordering
  const islandIndexMap = useMemo(() => {
    const map: Record<string, number> = {};
    islands.forEach((isl, idx) => {
      map[isl.id] = idx;
    });
    return map;
  }, [islands]);

  // Sequential trail animation for islands (left-to-right by insertion order)
  const trail = useTrail(islands.length, {
    from: { opacity: 0, transform: "translateY(48px) scale(0.92)" },
    to: { opacity: 1, transform: "translateX(0px) scale(1)" },
    config: { tension: 480, friction: 26 },
    delay: 60,
  });

  const [{ x, y, scale }, api] = useSpring(() => ({
    x: 0,
    y: 0,
    scale: 1,
    config: { mass: 10, tension: 400, friction: 250 },
  }));

  useGesture(
    {
      onDrag: ({ down, movement: [mx, my], memo = [x.get(), y.get()] }) => {
        api.start({ x: memo[0] + mx, y: memo[1] + my, immediate: down });
        return memo;
      },
      onDragEnd: () => {
        if (scale.get() <= 1) {
          api.start({ x: 0, y: 0 });
        }
      },
      onWheel: ({ event, movement: [, my], memo = scale.get() }) => {
        event.preventDefault();
        const newScale = Math.min(Math.max(memo - my / 500, 0.25), 6);
        if (newScale <= 1) {
          api.start({ scale: newScale, x: 0, y: 0 });
        } else {
          api.start({ scale: newScale });
        }
        return newScale;
      },
      onClick: ({ event }) => {
        const target = event.target as HTMLElement;
        const islandDiv = target.closest("[data-island-id]");
        if (!islandDiv) return;
        const islandId = islandDiv.getAttribute("data-island-id");
        const islandToSelect = islands.find((isl) => isl.id === islandId);
        if (islandToSelect) handleSelectIsland(islandToSelect);
      },
    },
    {
      target: viewportRef,
      eventOptions: { passive: false },
      drag: { filterTaps: true },
    }
  );

  const initializeData = useCallback(async () => {
    const islandData = await fetchIslands(authUser);
    const sessionData = await fetchSessions(authUser);

    if (sessionData) {
      setSessionCount(sessionData.length);
      const totalMilliseconds = sessionData.reduce((acc, session) => {
        const startTime = new Date(session.start_time).getTime();
        const endTime = new Date(session.end_time).getTime();
        if (!isNaN(startTime) && !isNaN(endTime) && endTime > startTime) {
          return acc + (endTime - startTime);
        }
        return acc;
      }, 0);
      const totalSeconds = Math.round(totalMilliseconds / 1000);
      setTotalStudy(totalSeconds);
    }
    if (islandData && islandData.length > 0) {
      const sortedData = islandData.sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
      setIslands(sortedData);
      const numIslands = sortedData.length;
      const calculatedMaxRow = Math.ceil(Math.sqrt(numIslands));
      setMaxRow(calculatedMaxRow);
      setRows(calculatedMaxRow * 2 - 1);
    }
    setLoading(false);
  }, [authUser]);

  useEffect(() => {
    if (!authLoading && authUser) {
      initializeData();
    }
  }, [authLoading, authUser, initializeData]);

  const handleSelectIsland = (island: islandProps) => {
    setSelectedIsland(island);
    setIsPanelVisible(true);
    const islandElement = document.getElementById(`island-${island.id}`);
    if (islandElement && viewportRef.current) {
      const viewportRect = (
        viewportRef.current as HTMLElement
      ).getBoundingClientRect();
      const elemRect = islandElement.getBoundingClientRect();

      const newScale = 5;
      // Center element in viewport
      const newX = viewportRect.width / 2 - elemRect.left - elemRect.width / 2;
      const newY = viewportRect.height / 2 - elemRect.top - elemRect.height / 2;

      //console.log(newX, newY, newScale);

      api.start({
        scale: newScale,
        x: newX,
        y: newY,

        config: { tension: 1000, friction: 30 },
      });
    }
  };

  const handleDeselect = () => {
    setIsPanelVisible(false);
    setTimeout(() => setSelectedIsland(null), 500); // Delay removal for transition
    api.start({ x: 0, y: 0, scale: 1 }); // Reset view
  };

  const generateDiamondGrid = () => {
    if (!islands.length || rows === 0 || maxRow === 0) return null;

    const grid: (islandProps | null)[][] = [];
    let islandIndex = 0;

    for (let i = 0; i < rows; i++) {
      const isExpanding = i < maxRow;
      const numCols = isExpanding ? i + 1 : rows - i;
      const row: (islandProps | null)[] = [];

      for (let j = 0; j < numCols; j++) {
        if (islandIndex < islands.length) {
          row.push(islands[islandIndex]);
          islandIndex++;
        } else {
          row.push(null); // Add placeholder for remaining spots
        }
      }
      grid.push(row);
    }

    // This logic is to balance the diamond if it's not full.
    // It's a simple approach and might need refinement for perfect visual balance.
    const totalCells = maxRow * maxRow;
    if (islands.length < totalCells) {
      // Attempt to make it more diamond-like by rearranging placeholders
      // This is a complex problem, for now we fill from top-left
    }

    return grid;
  };

  const diamondGrid = generateDiamondGrid();

  return (
    <div
      ref={viewportRef}
      className="min-h-screen w-full overflow-hidden touch-none cursor-grab active:cursor-grabbing fixed inset-0 lg:ml-24 bg-white"
    >
      {loading ? (
        <div className="flex items-center justify-center h-full">
          <Spinner />
        </div>
      ) : (
        <>
          <div
            className={cn(
              "fixed lg:right-2 bottom-0 lg:top-1/2 -translate-y-1/2 z-20 min-h-96 transition-transform duration-500 ease-in-out",
              isPanelVisible
                ? "translate-y-0 lg:translate-x-0 lg:-translate-y-1/2"
                : "translate-y-[110%] lg:-translate-y-1/2 lg:translate-x-[110%]"
            )}
            onPointerDown={(e) => e.stopPropagation()}
            onPointerMove={(e) => e.stopPropagation()}
            onWheel={(e) => e.stopPropagation()}
          >
            {selectedIsland && (
              <IslandSelect {...selectedIsland} onDeselect={handleDeselect} />
            )}
          </div>
          <animated.div
            style={{ x, y, scale }}
            className="flex flex-col items-center justify-center h-full w-full"
            onClick={handleDeselect}
          >
            <div className="text-xs mb-1 lg:justify-center lg:text-center lg:flex">
              You&apos;ve logged{" "}
              <span className="font-semibold mx-0.5 lg:mx-1">
                {sessionCount} sessions
              </span>
              totalling{" "}
              <span className="font-semibold mx-0.5 lg:mx-1">
                {Math.floor(totalStudy / 3600)} hours
              </span>
            </div>
            <section className="-space-y-[73px]">
              {diamondGrid &&
                diamondGrid.map((row, rowIndex) => (
                  <div
                    key={rowIndex}
                    className="flex justify-center -space-x-[6px]"
                  >
                    {row.map((island, colIndex) => {
                      const content = island ? (
                        <div
                          id={`island-${island.id}`}
                          data-island-id={island.id}
                          className={cn(
                            "relative w-[256px] h-[128px] will-change-transform will-change-opacity transition-transform duration-200 hover:-translate-y-1 hover:z-0",
                            selectedIsland && island.id === selectedIsland.id
                              ? "-translate-y-3 pointer-events-none"
                              : ""
                          )}
                          onClick={() => handleSelectIsland(island)}
                        >
                          <Image
                            src={island.current_url}
                            alt="Island Image"
                            width={256}
                            height={128}
                            className="pixelated select-none pointer-events-none"
                            unoptimized
                            style={{
                              cursor: selectedIsland ? "default" : "pointer",
                            }}
                          />
                        </div>
                      ) : (
                        <div
                          className="w-[256px] h-[128px]"
                          onClick={handleDeselect}
                        ></div>
                      );

                      // For placeholders, just return plain wrapper (no animation)
                      if (!island) {
                        return (
                          <div
                            key={colIndex}
                            onClick={(e) => e.stopPropagation()}
                          >
                            {content}
                          </div>
                        );
                      }

                      const trailIndex = islandIndexMap[island.id];
                      const style = trail[trailIndex] || {};
                      return (
                        <animated.div
                          key={island.id}
                          style={style}
                          onClick={(e) => e.stopPropagation()}
                        >
                          {content}
                        </animated.div>
                      );
                    })}
                  </div>
                ))}
            </section>
          </animated.div>
        </>
      )}
    </div>
  );

  /*
  return (
    <>
      {loading ? (
        <>
          <div className="font-semibold tracking-tight text-2xl">
            My Archipelago
          </div>
          <div className="space-y-4">
            <Card className="min-h-[31rem]">
              <CardHeader>
                <CardTitle className="flex flex-row gap-4">
                  <Skeleton className="h-8 w-48"></Skeleton>
                </CardTitle>
              </CardHeader>
              <CardContent className="">
                <Skeleton className="h-10 w-72"></Skeleton>
              </CardContent>
            </Card>
            <Card className="">
              <CardHeader>
                <CardTitle className="flex flex-row gap-4">
                  <Skeleton className="h-8 w-48"></Skeleton>
                </CardTitle>
              </CardHeader>
              <CardContent className="min-h-[27.6rem]">
                <Skeleton className="h-12 w-72"></Skeleton>
              </CardContent>
            </Card>
          </div>
        </>
      ) : (
        <div className="">
          <div className="font-semibold tracking-tight text-2xl">
            My Archipelago
          </div>
          <div className="space-y-4">
            {islands.map((island) => (
              <Card key={island.id}>
                <CardHeader>
                  <CardTitle className="flex flex-row gap-4">
                    {new Date(island.created_at).toLocaleDateString()}
                    <IslandTag type={island.type} />
                    {island.active ? (
                      <p className="text-sm select-none rounded-full text-emerald-500 border-emerald-500 border bg-emerald-100 dark:bg-emerald-500 dark:text-background flex px-2 py-1">
                        Active
                      </p>
                    ) : null}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0 flex flex-row overflow-x-hidden">
                  <div className="w-full">
                    {island.previous_urls && island.previous_urls.length > 0 ? (
                      <PerspectiveCarousel
                        urls={[...island.previous_urls, island.current_url]}
                      />
                    ) : (
                      <PerspectiveCarousel urls={[island.current_url]} />
                    )}
                  </div>
                  <div className="absolute ml-6 flex flex-row gap-8 z-100">
                    <IslandLevelMetric level={island.level} />
                    <IslandXPMetric
                      threshold={island.threshold}
                      level={island.level}
                      xp={island.xp}
                    />
                    <IslandTimeMetric
                      threshold={island.threshold}
                      level={island.level}
                      xp={island.xp}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </>
  );
  */
}
