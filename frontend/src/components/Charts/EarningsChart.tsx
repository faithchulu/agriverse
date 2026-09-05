"use client";
import { ApexOptions } from "apexcharts";
import React from "react";
import ReactApexChart from "react-apexcharts";
import type { DashboardTrend } from "../../lib/api/analytics";

const options: ApexOptions = {
  legend: {
    show: false,
  },
  colors: ["#2F5F3F", "#D9A441"],
  chart: {
    fontFamily: "Satoshi, sans-serif",
    height: 335,
    type: "area",
    toolbar: {
      show: false,
    },
  },
  responsive: [
    {
      breakpoint: 1024,
      options: {
        chart: {
          height: 300,
        },
      },
    },
    {
      breakpoint: 1366,
      options: {
        chart: {
          height: 350,
        },
      },
    },
  ],
  stroke: {
    width: [2, 2],
    curve: "smooth",
  },
  grid: {
    xaxis: {
      lines: {
        show: true,
      },
    },
    yaxis: {
      lines: {
        show: true,
      },
    },
  },
  dataLabels: {
    enabled: false,
  },
  markers: {
    size: 4,
    colors: "#fff",
    strokeColors: ["#2F5F3F", "#D9A441"],
    strokeWidth: 3,
    strokeOpacity: 0.9,
    fillOpacity: 1,
    hover: {
      sizeOffset: 5,
    },
  },
  xaxis: {
    type: "category",
    categories: [
      "Sep",
      "Oct",
      "Nov",
      "Dec",
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
    ],
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    title: {
      style: {
        fontSize: "0px",
      },
    },
    min: 0,
  },
};

interface EarningsChartState {
  series: {
    name: string;
    data: number[];
  }[];
}

const EarningsChart: React.FC<{ data: DashboardTrend | null }> = ({ data }) => {
  const labels = data?.labels ?? [
    "Sep",
    "Oct",
    "Nov",
    "Dec",
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
  ];
  const state: EarningsChartState = {
    series: [
      { name: "Revenue", data: data?.primary ?? labels.map(() => 0) },
      { name: "Payouts", data: data?.secondary ?? labels.map(() => 0) },
    ],
  };

  return (
    <div className="col-span-12 rounded-lg border border-[#8FBF9F]/30 bg-white px-5 pb-5 pt-7.5 dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8">
      <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
        <div className="flex w-full flex-wrap gap-3 sm:gap-5">
          <div className="flex min-w-47.5">
            <span className="mr-2 mt-1 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-[#2F5F3F]">
              <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-[#2F5F3F]"></span>
            </span>
            <div className="w-full">
              <p className="font-semibold text-[#2F5F3F]">Revenue</p>
              <p className="text-sm font-medium text-[#3B2F22]/50 dark:text-bodydark2">
                Last 12 months
              </p>
            </div>
          </div>
          <div className="flex min-w-47.5">
            <span className="mr-2 mt-1 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-[#D9A441]">
              <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-[#D9A441]"></span>
            </span>
            <div className="w-full">
              <p className="font-semibold text-[#854F0B]">Payouts</p>
              <p className="text-sm font-medium text-[#3B2F22]/50 dark:text-bodydark2">
                Last 12 months
              </p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div id="earningsChart" className="-ml-5">
          <ReactApexChart
            options={{
              ...options,
              xaxis: { ...options.xaxis, categories: labels },
            }}
            series={state.series}
            type="area"
            height={350}
            width={"100%"}
          />
        </div>
      </div>
    </div>
  );
};

export default EarningsChart;
