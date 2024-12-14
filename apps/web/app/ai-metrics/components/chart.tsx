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

interface MetricDataPoint {
	timestamp: string;
	provider: string;
	latency: number;
	promptTokens: number;
	completionTokens: number;
	totalTokens: number;
}

interface CombinedMetricsChartProps {
	data: MetricDataPoint[];
}

export function CombinedMetricsChart({ data }: CombinedMetricsChartProps) {
	const formatLatency = (value: number) => `${value.toLocaleString()}ms`;
	const formatTokens = (value: number) => `${value.toLocaleString()}`;
	const formatTimestamp = (timestamp: string) => {
		try {
			if (!timestamp) return "";
			const [_, time] = timestamp.split(" ");
			if (!time) return "";
			const [hours, minutes] = time.split(":");
			return `${hours}:${minutes}`;
		} catch (error) {
			console.error("Error formatting timestamp:", timestamp);
			return timestamp;
		}
	};

	const providerColors: { [key: string]: string } = {
		openai: "#9d94ec",
		anthropic: "#f8a054",
		bedrock: "#4693ff",
		gork: "#cf7ee9",
		openrouter: "#fb97b9",
		mistral: "#73cee6",
		"perplexity-ai": "#ffce4b",
		workers: "#4693ff",
		groq: "#f8a054",
		"google-ai-studio": "#f8a054",
		replicate: "#0071f1",
	};

	const getProviderColor = (provider: string) => {
		const normalizedProvider = provider.toLowerCase();
		return providerColors[normalizedProvider] || "#0071f1";
	};

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
					margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
				>
					<CartesianGrid strokeDasharray="3 3" opacity={0.2} />
					<XAxis
						dataKey="timestamp"
						angle={-45}
						textAnchor="end"
						height={60}
						interval="preserveStartEnd"
						tick={{ fontSize: 11, fill: "var(--foreground)" }}
						tickFormatter={formatTimestamp}
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
						height={24}
						iconSize={10}
						wrapperStyle={{
							paddingBottom: "10px",
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
								key={`cell-${index}-${entry.timestamp}`}
								fill={getProviderColor(entry.provider)}
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
