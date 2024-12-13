"use client";

import {
	Bar,
	ComposedChart,
	Line,
	CartesianGrid,
	Legend,
	ResponsiveContainer,
	XAxis,
	YAxis,
} from "recharts";

import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";

interface CombinedMetricsChartProps {
	data: Array<{
		name: string;
		latency: number;
		promptTokens: number;
		completionTokens: number;
		totalTokens: number;
	}>;
}

export function CombinedMetricsChart({ data }: CombinedMetricsChartProps) {
	const formatLatency = (value: number) => `${value.toLocaleString()}ms`;
	const formatTokens = (value: number) => `${value.toLocaleString()}`;

	return (
		<ChartContainer
			config={{
				latency: {
					label: "Latency (ms)",
					color: "hsl(var(--chart-1))",
				},
				promptTokens: {
					label: "Prompt Tokens",
					color: "hsl(var(--chart-2))",
				},
				completionTokens: {
					label: "Completion Tokens",
					color: "hsl(var(--chart-3))",
				},
				totalTokens: {
					label: "Total Tokens",
					color: "hsl(var(--chart-4))",
				},
			}}
			className="h-full w-full"
		>
			<ResponsiveContainer width="100%" height="100%">
				<ComposedChart
					data={data}
					margin={{ top: 40, right: 60, left: 30, bottom: 40 }}
				>
					<CartesianGrid strokeDasharray="3 3" opacity={0.3} />
					<XAxis
						dataKey="name"
						angle={-45}
						textAnchor="end"
						height={60}
						interval={0}
						tick={{ fontSize: 11 }}
					/>
					<YAxis
						yAxisId="left"
						orientation="left"
						stroke="var(--color-latency)"
						tick={{ fontSize: 11 }}
						tickFormatter={formatLatency}
						width={80}
					/>
					<YAxis
						yAxisId="right"
						orientation="right"
						stroke="var(--color-totalTokens)"
						tick={{ fontSize: 11 }}
						tickFormatter={formatTokens}
						width={80}
					/>
					<ChartTooltip
						content={<ChartTooltipContent />}
						cursor={{ fill: "rgba(0, 0, 0, 0.1)" }}
					/>
					<Legend
						verticalAlign="top"
						height={36}
						iconSize={10}
						wrapperStyle={{
							paddingBottom: "20px",
							fontSize: "12px",
						}}
					/>
					<Bar
						yAxisId="left"
						dataKey="latency"
						fill="var(--color-latency)"
						name="Latency (ms)"
					/>
					<Line
						yAxisId="right"
						type="monotone"
						dataKey="promptTokens"
						stroke="var(--color-promptTokens)"
						name="Prompt Tokens"
					/>
					<Line
						yAxisId="right"
						type="monotone"
						dataKey="completionTokens"
						stroke="var(--color-completionTokens)"
						name="Completion Tokens"
					/>
					<Line
						yAxisId="right"
						type="monotone"
						dataKey="totalTokens"
						stroke="var(--color-totalTokens)"
						strokeWidth={2}
						name="Total Tokens"
					/>
				</ComposedChart>
			</ResponsiveContainer>
		</ChartContainer>
	);
}
