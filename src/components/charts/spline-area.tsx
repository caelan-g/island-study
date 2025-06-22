"use client";

import React from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import { timeFilter } from "@/lib/filters/time-filter";

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
  const chartState: {
    series: ApexAxisChartSeries;
    fill: ApexFill;
    options: ApexOptions;
  } = {
    series: [
      {
        name: "course",
        data: data?.total || [0, 0, 0, 0, 0],
        color: "#212121", // Default color for the series
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
        formatter: function (value: number) {
          return timeFilter(value, "hours");
        },
      },
      stroke: {
        curve: "smooth",
      },
      xaxis: {
        categories: data?.course || ["1", "2", "3", "4", "5"],
        tooltip: {
          enabled: false,
        },
        labels: {
          rotate: -45,
          rotateAlways: true,
          offsetY: 10,
          style: {
            fontSize: "10px",
            fontFamily: "Inter, sans-serif",
            fontWeight: 400,
          },
        },
      },
      yaxis: {
        show: false,
        min: 0,
      },
      tooltip: {
        x: {},
        y: {
          formatter: function (value: number) {
            return timeFilter(value);
          },
        },
      },
    },
  };

  return (
    <div>
      <div id="chart">
        <ReactApexChart
          series={chartState.series}
          options={chartState.options}
          height={350}
          type="area"
        />
      </div>
    </div>
  );
}
