import { useMemo } from "react";
import { useTheme } from "./themeContext";

/* 图表配色：ECharts 的颜色写在 option 里，CSS 覆盖不到（尤其 richText tooltip），
   所以深浅两套画布/轴/提示框统一从这里出。 */
export const CHART_FONT = '"Microsoft YaHei", "PingFang SC", Arial, sans-serif';

/* 深底趋势图原本就是深色画布（浅色主题下同样如此）。 */
export const CHART_BACKGROUND = "#102036";

/* 深底画布用的轴样式：浅字、深网格。 */
export const AXIS_STYLE = {
  axisLine: { lineStyle: { color: "#4b6383" } },
  axisTick: { show: false },
  axisLabel: { color: "#c3d5ee", fontSize: 11, fontFamily: CHART_FONT },
  splitLine: { lineStyle: { color: "#293b55", width: 1 } },
};

/* 白底画布用的轴样式：深字、浅网格。 */
export const LIGHT_AXIS_STYLE = {
  axisLine: { lineStyle: { color: "#bfd4ed" } },
  axisTick: { show: false },
  axisLabel: { color: "#47658e", fontSize: 11, fontFamily: CHART_FONT },
  splitLine: { lineStyle: { color: "#e8f0fa", width: 1 } },
};

export type ChartPalette = {
  dark: boolean;
  /* 默认（浅底）图表的画布色：深色主题下换成深底，避免白块。 */
  canvas: string;
  /* 次级浅底图表（如 UE 横向对比）。 */
  softCanvas: string;
  /* 本来就是深底的趋势图。 */
  deepCanvas: string;
  /* 与画布匹配的轴样式，直接展开进 xAxis / yAxis。 */
  axis: typeof AXIS_STYLE | typeof LIGHT_AXIS_STYLE;
  axisName: string;
  markLineLabel: string;
  bandFill: string;
  gridLine: string;
  tooltip: {
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
    textStyle: { color: string; fontSize: number; fontFamily: string };
  };
};

export function chartPalette(dark: boolean): ChartPalette {
  if (dark) {
    return {
      dark,
      canvas: "#0e1a27",
      softCanvas: "#121d2b",
      deepCanvas: "#0e1a27",
      axis: AXIS_STYLE,
      axisName: "#a9bccf",
      markLineLabel: "#b7c8da",
      bandFill: "#1d3a5c",
      gridLine: "#22344a",
      tooltip: {
        backgroundColor: "rgba(9, 17, 27, 0.96)",
        borderColor: "#2c4560",
        borderWidth: 1,
        textStyle: { color: "#dbe7f4", fontSize: 11, fontFamily: CHART_FONT },
      },
    };
  }
  return {
    dark,
    canvas: "#fff",
    softCanvas: "#f7fbff",
    deepCanvas: CHART_BACKGROUND,
    axis: LIGHT_AXIS_STYLE,
    axisName: "#617a96",
    markLineLabel: "#607995",
    bandFill: "#d8e7ff",
    gridLine: "#eef3f9",
    tooltip: {
      backgroundColor: "rgba(255, 255, 255, 0.96)",
      borderColor: "#dbe7f3",
      borderWidth: 1,
      textStyle: { color: "#365478", fontSize: 11, fontFamily: CHART_FONT },
    },
  };
}

export function useChartPalette(): ChartPalette {
  const { resolved } = useTheme();
  return useMemo(() => chartPalette(resolved === "dark"), [resolved]);
}
