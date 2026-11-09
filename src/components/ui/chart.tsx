"use client";

import * as React from "react";
import {
  Tooltip,
  ResponsiveContainer,
  type TooltipContentProps,
} from "recharts";
import { cn } from "@/lib/utils";

export type ChartConfig = Record<
  string,
  {
    label?: React.ReactNode;
    color?: string;
  }
>;

type ChartContextValue = {
  config: ChartConfig;
};

const ChartContext = React.createContext<ChartContextValue | null>(null);

function useChart() {
  const context = React.useContext(ChartContext);

  if (!context) {
    throw new Error("useChart must be used inside a <ChartContainer />");
  }

  return context;
}

function ChartContainer({
  id,
  className,
  children,
  config,
  ...props
}: React.ComponentProps<"div"> & {
  config: ChartConfig;
  children: React.ComponentProps<typeof ResponsiveContainer>["children"];
}) {
  const uniqueId = React.useId();
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`;

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-slot="chart"
        data-chart={chartId}
        className={cn(
          "flex aspect-auto h-[260px] w-full justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-[#8B95A1] [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-[#E5E8EB] [&_.recharts-tooltip-cursor]:fill-[#F2F4F6]",
          className
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <ResponsiveContainer>{children}</ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
}

function ChartStyle({ id, config }: { id: string; config: ChartConfig }) {
  const colorConfig = Object.entries(config).filter(([, value]) => value.color);

  if (!colorConfig.length) return null;

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `[data-chart=${id}] {${colorConfig
          .map(([key, value]) => `--color-${key}: ${value.color};`)
          .join("")}}`,
      }}
    />
  );
}

const ChartTooltip = Tooltip;

function ChartTooltipContent({
  active,
  payload,
  label,
}: TooltipContentProps) {
  const { config } = useChart();

  if (!active || !payload?.length) return null;

  return (
    <div className="min-w-32 rounded-xl border border-[#E5E8EB] bg-white px-3 py-2 shadow-lg">
      {label && <p className="mb-1 text-[12px] font-semibold text-[#4E5968]">{label}</p>}
      {payload.map((item) => {
        const key = String(item.dataKey || item.name || "");
        const labelText = config[key]?.label || item.name || key;

        return (
          <div key={key} className="flex items-center justify-between gap-4 text-[13px]">
            <span className="flex items-center gap-1.5 text-[#6B7684]">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              {labelText}
            </span>
            <span className="font-bold tabular-nums text-[#191F28]">
              {Number(item.value || 0).toLocaleString()}회
            </span>
          </div>
        );
      })}
    </div>
  );
}

export { ChartContainer, ChartTooltip, ChartTooltipContent };
