"use client";
import { ApexOptions } from "apexcharts";
import React from "react";
import ReactApexChart from "react-apexcharts";
import type { DashboardTrend } from "../../lib/api/analytics";

const options: ApexOptions = {
  colors: ["#2F5F3F", "#8FBF9F"],
  chart: {
    fontFamily: "Satoshi, sans-serif",
    type: "bar",
    height: 335,
    stacked: true,
    toolbar: {
      show: false,
    },
    zoom: {
      enabled: false,
    },
  },
  responsive: [
    {
      breakpoint: 1536,
      options: {
        plotOptions: {
          bar: {
            borderRadius: 0,
            columnWidth: "25%",
          },
        },
      },
    },
  ],
  plotOptions: {
    bar: {
      horizontal: false,
      borderRadius: 0,
      columnWidth: "25%",
      borderRadiusApplication: "end",
      borderRadiusWhenStacked: "last",
    },
  },
  dataLabels: {
    enabled: false,
  },
  xaxis: {
    categories: ["M", "T", "W", "T", "F", "S", "S"],
  },
  legend: {
    position: "top",
    horizontalAlign: "left",
    fontFamily: "Satoshi",
    fontWeight: 500,
    fontSize: "14px",
    markers: {
      radius: 99,
    },
  },
  fill: {
    opacity: 1,
  },
};

interface SalesWeekChartState {
  series: {
    name: string;
    data: number[];
  }[];
}

const SalesWeekChart: React.FC<{ data: DashboardTrend | null }> = ({
  data,
}) => {
  const labels = data?.labels ?? ["M", "T", "W", "T", "F", "S", "S"];
  const state: SalesWeekChartState = {
    series: [
      { name: "Datasets sold", data: data?.primary ?? labels.map(() => 0) },
      { name: "Disputes", data: data?.secondary ?? labels.map(() => 0) },
    ],
  };

  return (
    <div className="col-span-12 rounded-lg border border-[#8FBF9F]/30 bg-white p-7.5 dark:border-strokedark dark:bg-boxdark xl:col-span-4">
      <div className="mb-4 justify-between gap-4 sm:flex">
        <div>
          <h4 className="text-xl font-semibold text-[#1B3A2B] dark:text-white">
            Sales this week
          </h4>
        </div>
      </div>

      <div>
        <div id="salesWeekChart" className="-mb-9 -ml-5">
          <ReactApexChart
            options={{
              ...options,
              xaxis: { ...options.xaxis, categories: labels },
            }}
            series={state.series}
            type="bar"
            height={350}
            width={"100%"}
          />
        </div>
      </div>
    </div>
  );
};

export default SalesWeekChart;
