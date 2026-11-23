/* 图表基础组件：ECharts 注册、公共面板与轴样式转出。 */
import { useEffect, useRef, type CSSProperties } from "react";
import * as echarts from "echarts/core";
import { BarChart, LineChart, HeatmapChart, GraphChart } from "echarts/charts";
import { GridComponent, TooltipComponent, VisualMapComponent, MarkLineComponent, MarkAreaComponent } from "echarts/components";
import { SVGRenderer } from "echarts/renderers";
import type { EChartsOption } from "echarts";
import "./ChartPanel.css";

echarts.use([
  BarChart,
  LineChart,
  HeatmapChart,
  GraphChart,
  GridComponent,
  TooltipComponent,
  VisualMapComponent,
  MarkLineComponent,
  MarkAreaComponent,
  SVGRenderer,
]);

interface Props {
  title: string;
  description: string;
  option: EChartsOption;
  height?: number;
  className?: string;
  onSelect?: (ueId: string) => void;
}
export default function ChartPanel({
  title,
  description,
  option,
  height = 190,
  className = "",
  onSelect,
}: Props) {
  const container = useRef<HTMLDivElement>(null);
  const chart = useRef<ReturnType<typeof echarts.init> | null>(null);
  const latestOption = useRef(option);
  const latestSelect = useRef(onSelect);
  useEffect(() => {
    latestOption.current = option;
    chart.current?.setOption(option, { notMerge: true });
  }, [option]);
  useEffect(() => { latestSelect.current = onSelect; }, [onSelect]);
  useEffect(() => {
    const element = container.current;
    if (!element) return;
    let instance: ReturnType<typeof echarts.init> | null = null;
    // Inactive workspace tabs stay mounted. Initialize only after layout supplies a
    // real size; ResizeObserver also handles returning to a previously hidden tab.
    const resize = () => {
      if (!element.isConnected || element.clientWidth <= 0 || element.clientHeight <= 0) return;
      if (!instance) {
        instance = echarts.init(element, null, { renderer: "svg" });
        chart.current = instance;
        instance.setOption(latestOption.current, { notMerge: true });
        instance.on("click", "series.bar", (event: { name?: string }) => {
          if (event.name) latestSelect.current?.(event.name);
        });
      } else if (!instance.isDisposed()) instance.resize();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(element);
    resize();
    return () => {
      observer.disconnect();
      instance?.dispose();
      chart.current = null;
    };
  }, []);
  return (
    <figure className={`ain-chart-slot ain-real-chart ${className}`}>
      <figcaption className="ain-slot-heading">
        <h2>{title}</h2>
        <p>{description}</p>
      </figcaption>
      <div
        ref={container}
        className="ain-echart"
        style={{ height, "--ain-chart-height": `${height}px` } as CSSProperties}
        role="img"
        aria-label={`${title}：${description}`}
      />
    </figure>
  );
}
// 第二批：统一图表字体与轴样式。颜色改为从 theme/chartPalette 出（深浅两套），
// 这里只做转出，保持既有 `from "../charts/ChartPanel"` 的引用不变。
export { CHART_FONT, AXIS_STYLE, LIGHT_AXIS_STYLE, CHART_BACKGROUND } from "../../theme/chartPalette";
