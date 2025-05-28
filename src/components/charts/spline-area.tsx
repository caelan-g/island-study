"use client";

import React from "react";
import dynamic from "next/dynamic";
import { useTimeFilter } from "@/hooks/time-filter";

// Dynamically import ApexCharts to avoid SSR issues
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface SplineAreaChartProps {
  data?: {
    course: string[];
    total: number[];
  };
}

export function SplineAreaChart({ data }: SplineAreaChartProps) {
  const chartState = {
    series: [
      {
        name: "course",
        data: data?.total || [0, 0, 0, 0, 0],
        color: "#121212",
      },
    ],
    fill: {
      type: "gradient",
      gradient: {
        shade: "dark",
        type: "vertical",
        shadeIntensity: 0.5,
        gradientToColors: undefined,
        inverseColors: true,
        opacityFrom: 1,
        opacityTo: 0.1,
        stops: [0, 50, 100],
        colorStops: [],
      },
    },
    options: {
      chart: {
        zoom: {
          enabled: false,
        },
        height: 350,
        type: "area",
        toolbar: {
          show: false,
        },
        animations: {
          enabled: true,
          speed: 800,
          animateGradually: {
            enabled: true,
            delay: 150,
          },
          dynamicAnimation: {
            enabled: true,
            speed: 350,
          },
        },
      },
      dataLabels: {
        enabled: true,
        formatter: function (value) {
          return useTimeFilter(value, "hours");
        },
      },
      stroke: {
        curve: "smooth",
      },
      xaxis: {
        type: "string",
        categories: data?.course || ["1", "2", "3", "4", "5"],
        tooltip: {
          enabled: false,
        },
        labels: {
          rotate: -45,
          rotateAlways: true,
          textAnchor: "end",
          offsetY: 10,
        },
      },
      yaxis: {
        show: false,
        min: 0,
      },
      tooltip: {
        x: {},
        y: {
          formatter: function (value) {
            return useTimeFilter(value);
          },
        },
      },
    },
  };

  return (
    <div>
      <div id="chart">
        <ReactApexChart
          options={chartState.options}
          series={chartState.series}
          type="area"
          height={350}
        />
      </div>
    </div>
  );
}
