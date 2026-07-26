"use client";
import { ApexOptions } from "apexcharts";
import React, { useState } from "react";
import ReactApexChart from "react-apexcharts";

interface LicenseSplitChartState {
  series: number[];
}

const options: ApexOptions = {
  chart: {
    fontFamily: "Satoshi, sans-serif",
    type: "donut",
  },
  colors: ["#2F5F3F", "#D9A441", "#8FBF9F"],
  labels: ["One-time download", "Time-limited access", "Research-only"],
  legend: {
    show: false,
  },
  plotOptions: {
    pie: {
      donut: {
        size: "65%",
        background: "transparent",
      },
    },
  },
  dataLabels: {
    enabled: false,
  },
  responsive: [
    {
      breakpoint: 2600,
      options: {
        chart: {
          width: 380,
        },
      },
    },
    {
      breakpoint: 640,
      options: {
        chart: {
          width: 200,
        },
      },
    },
  ],
};

const LEGEND = [
  { label: "One-time download", value: 45, color: "bg-[#2F5F3F]" },
  { label: "Time-limited access", value: 35, color: "bg-[#D9A441]" },
  { label: "Research-only", value: 20, color: "bg-[#8FBF9F]" },
];

const LicenseSplitChart: React.FC = () => {
  const [state] = useState<LicenseSplitChartState>({
    series: [45, 35, 20],
  });

  return (
    <div className="col-span-12 rounded-lg border border-[#8FBF9F]/30 bg-white px-5 pb-5 pt-7.5 dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-5">
      <div className="mb-3 justify-between gap-4 sm:flex">
        <div>
          <h5 className="text-xl font-semibold text-[#1B3A2B] dark:text-white">
            Sales by license type
          </h5>
        </div>
      </div>

      <div className="mb-2">
        <div id="licenseSplitChart" className="mx-auto flex justify-center">
          <ReactApexChart
            options={options}
            series={state.series}
            type="donut"
          />
        </div>
      </div>

      <div className="-mx-8 flex flex-wrap items-center justify-center gap-y-3">
        {LEGEND.map((item) => (
          <div key={item.label} className="w-full px-8 sm:w-1/2">
            <div className="flex w-full items-center">
              <span
                className={`mr-2 block h-3 w-full max-w-3 rounded-full ${item.color}`}
              ></span>
              <p className="flex w-full justify-between text-sm font-medium text-[#1B3A2B] dark:text-white">
                <span>{item.label}</span>
                <span>{item.value}%</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LicenseSplitChart;
