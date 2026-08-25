"use client";
import { ApexOptions } from "apexcharts";
import React from "react";
import ReactApexChart from "react-apexcharts";
import type { LicenseSplitItem } from "../../lib/api/analytics";

const COLORS = ["#2F5F3F", "#D9A441", "#8FBF9F"];
const COLOR_CLASSES = ["bg-[#2F5F3F]", "bg-[#D9A441]", "bg-[#8FBF9F]"];

const baseOptions: ApexOptions = {
  chart: {
    fontFamily: "Satoshi, sans-serif",
    type: "donut",
  },
  colors: COLORS,
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
    { breakpoint: 2600, options: { chart: { width: 380 } } },
    { breakpoint: 640, options: { chart: { width: 200 } } },
  ],
};

export default function LicenseSplitChart({
  title = "Sales by license type",
  data,
}: {
  title?: string;
  data: LicenseSplitItem[] | null;
}) {
  const items = data ?? [];
  const series = items.map((i) => i.count);
  const options: ApexOptions = {
    ...baseOptions,
    labels: items.map((i) => i.label),
  };

  return (
    <div className="col-span-12 rounded-lg border border-[#8FBF9F]/30 bg-white px-5 pb-5 pt-7.5 dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-5">
      <div className="mb-3 justify-between gap-4 sm:flex">
        <div>
          <h5 className="text-xl font-semibold text-[#1B3A2B] dark:text-white">
            {title}
          </h5>
        </div>
      </div>

      <div className="mb-2">
        <div id="licenseSplitChart" className="mx-auto flex justify-center">
          {data === null ? (
            <div className="flex h-52 items-center justify-center text-sm text-[#3B2F22]/40">
              Loading…
            </div>
          ) : items.every((i) => i.count === 0) ? (
            <div className="flex h-52 items-center justify-center text-sm text-[#3B2F22]/40">
              No sales yet
            </div>
          ) : (
            <ReactApexChart options={options} series={series} type="donut" />
          )}
        </div>
      </div>

      {data !== null && (
        <div className="-mx-8 flex flex-wrap items-center justify-center gap-y-3">
          {items.map((item, i) => (
            <div key={item.label} className="w-full px-8 sm:w-1/2">
              <div className="flex w-full items-center">
                <span
                  className={`mr-2 block h-3 w-full max-w-3 rounded-full ${COLOR_CLASSES[i % COLOR_CLASSES.length]}`}
                ></span>
                <p className="flex w-full justify-between text-sm font-medium text-[#1B3A2B] dark:text-white">
                  <span>{item.label}</span>
                  <span>{item.percent}%</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}