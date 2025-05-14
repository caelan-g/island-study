"use client";

import React from "react";
import dynamic from "next/dynamic";

// Dynamically import ApexCharts to avoid SSR issues
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface SplineAreaChartProps {
  data?: {
    series1: number[];
    series2: number[];
    categories: string[];
  };
}

export function SplineAreaChart({ data }: SplineAreaChartProps) {
  const chartState = {
    series: [
      {
        name: "series1",
        data: [
          0, 4, 7, 12, 12, 17, 22, 22, 22, 29, 34, 34, 40, 44, 44, 50, 55, 59,
          59, 59, 64, 70, 75, 75, 81, 85, 89, 93, 97, 100,
        ],
        color: "#000000",
      },
      {
        name: "series2",
        data: [
          0, 2, 4, 6, 6, 6, 10, 14, 14, 19, 23, 23, 26, 29, 33, 33, 38, 38, 42,
          45, 48, 52, 52, 54, 55, 58, 58, 58, 59, 60,
        ],
        color: "#000000",
      },
      {
        name: "series3",
        data: [
          0, 6, 12, 19, 19, 25, 31, 38, 38, 44, 50, 50, 56, 63, 63, 69, 75, 75,
          81, 88, 88, 93, 97, 97, 100, 100, 100, 100, 100, 100,
        ],
        color: "#000000",
      },
      {
        name: "series4",
        data: [
          0, 3, 6, 9, 9, 13, 16, 16, 20, 23, 27, 27, 31, 35, 39, 43, 47, 50, 53,
          57, 60, 64, 64, 66, 68, 70, 72, 74, 76, 78,
        ],
        color: "#000000",
      },
      {
        name: "series5",
        data: [
          0, 1, 2, 3, 4, 4, 6, 7, 8, 8, 10, 12, 13, 15, 16, 18, 18, 18, 20, 21,
          21, 23, 24, 24, 24, 25, 26, 27, 28, 28,
        ],
        color: "#000000",
      },
    ],

    options: {
      chart: {
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
        enabled: false,
      },
      stroke: {
        curve: "smooth",
      },
      xaxis: {
        type: "datetime",
        categories: data?.categories || [
          "2024-04-01T00:00:00Z",
          "2024-04-02T00:00:00Z",
          "2024-04-03T00:00:00Z",
          "2024-04-04T00:00:00Z",
          "2024-04-05T00:00:00Z",
          "2024-04-06T00:00:00Z",
          "2024-04-07T00:00:00Z",
          "2024-04-08T00:00:00Z",
          "2024-04-09T00:00:00Z",
          "2024-04-10T00:00:00Z",
          "2024-04-11T00:00:00Z",
          "2024-04-12T00:00:00Z",
          "2024-04-13T00:00:00Z",
          "2024-04-14T00:00:00Z",
          "2024-04-15T00:00:00Z",
          "2024-04-16T00:00:00Z",
          "2024-04-17T00:00:00Z",
          "2024-04-18T00:00:00Z",
          "2024-04-19T00:00:00Z",
          "2024-04-20T00:00:00Z",
          "2024-04-21T00:00:00Z",
          "2024-04-22T00:00:00Z",
          "2024-04-23T00:00:00Z",
          "2024-04-24T00:00:00Z",
          "2024-04-25T00:00:00Z",
          "2024-04-26T00:00:00Z",
          "2024-04-27T00:00:00Z",
          "2024-04-28T00:00:00Z",
          "2024-04-29T00:00:00Z",
          "2024-04-30T00:00:00Z",
        ],
      },
      yaxis: {
        show: false,
      },
      tooltip: {
        x: {
          format: "dd/MM/yy HH:mm",
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
