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
	Cell,
} from "recharts";

import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";

import { getGradient } from "@/lib/utils";

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

	const barColors = [
		"#FF6B6B", // Coral Red
		"#4ECDC4", // Turquoise
		"#45B7D1", // Sky Blue
		"#96CEB4", // Sage Green
		"#FFEEAD", // Cream Yellow
		"#D4A5A5", // Dusty Rose
		"#9B5DE5", // Purple
		"#F15BB5", // Pink
		"#00BBF9", // Bright Blue
		"#00F5D4", // Mint
		"#FEE440", // Yellow
		"#FF99C8", // Light Pink
		"#A8E6CF", // Mint Green
		"#FFB3BA", // Light Red
		"#BFCFF7", // Lavender
	];

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
					<CartesianGrid strokeDasharray="3 3" opacity={0.2} />
					<XAxis
						dataKey="name"
						angle={-45}
						textAnchor="end"
						height={60}
						interval={0}
						tick={{ fontSize: 11, fill: "var(--foreground)" }}
					/>
					<YAxis
						yAxisId="left"
						orientation="left"
						stroke="var(--foreground)"
						tick={{ fontSize: 11, fill: "var(--foreground)" }}
						tickFormatter={formatLatency}
						width={80}
					/>
					<YAxis
						yAxisId="right"
						orientation="right"
						stroke="var(--foreground)"
						tick={{ fontSize: 11, fill: "var(--foreground)" }}
						tickFormatter={formatTokens}
						width={80}
					/>
					<ChartTooltip
						content={<ChartTooltipContent />}
						cursor={{ fill: "rgba(255, 255, 255, 0.1)" }}
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
						name="Latency (ms)"
						opacity={0.9}
					>
						{data.map((entry, index) => (
							<Cell
								key={`cell-${index}-${entry.name}`}
								fill={barColors[index % barColors.length]}
								style={{
									filter: "brightness(1.1)",
								}}
							/>
						))}
					</Bar>
					<Line
						yAxisId="right"
						type="monotone"
						dataKey="promptTokens"
						stroke="#00F5D4"
						strokeWidth={2}
						name="Prompt Tokens"
						dot={false}
					/>
					<Line
						yAxisId="right"
						type="monotone"
						dataKey="completionTokens"
						stroke="#FF6B6B"
						strokeWidth={2}
						name="Completion Tokens"
						dot={false}
					/>
					<Line
						yAxisId="right"
						type="monotone"
						dataKey="totalTokens"
						stroke="#FEE440"
						strokeWidth={2}
						name="Total Tokens"
						dot={false}
					/>
				</ComposedChart>
			</ResponsiveContainer>
		</ChartContainer>
	);
}
