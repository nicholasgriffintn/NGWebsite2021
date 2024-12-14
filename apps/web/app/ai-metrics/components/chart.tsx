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
	ReferenceLine,
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
	interval: number;
}

export function CombinedMetricsChart({
	data,
	interval = 60,
}: CombinedMetricsChartProps) {
	const extendedData = [...data];
	const lastEntry = data[data.length - 1];

	if (lastEntry) {
		const currentDate = new Date();
		const lastEntryDate = new Date(lastEntry.timestamp.replace(" ", "T"));

		while (lastEntryDate < currentDate) {
			lastEntryDate.setMinutes(lastEntryDate.getMinutes() + interval);

			if (lastEntryDate < currentDate) {
				const interpolatedTimestamp = `${lastEntryDate.toISOString().split("T")[0]} ${lastEntryDate.getHours().toString().padStart(2, "0")}:${lastEntryDate.getMinutes().toString().padStart(2, "0")}`;

				extendedData.push({
					timestamp: interpolatedTimestamp,
					provider: lastEntry.provider,
					latency: 0,
					promptTokens: 0,
					completionTokens: 0,
					totalTokens: 0,
				});
			}
		}

		const currentMinutes = currentDate.getMinutes();
		const roundedMinutes = Math.floor(currentMinutes / interval) * interval;
		currentDate.setMinutes(roundedMinutes);

		const currentTimestamp = `${currentDate.toISOString().split("T")[0]} ${currentDate.getHours().toString().padStart(2, "0")}:${currentDate.getMinutes().toString().padStart(2, "0")}`;

		if (currentTimestamp > lastEntry.timestamp) {
			extendedData.push({
				timestamp: currentTimestamp,
				provider: lastEntry.provider,
				latency: 0,
				promptTokens: 0,
				completionTokens: 0,
				totalTokens: 0,
			});
		}
	}

	const formatLatency = (value: number) => `${value.toLocaleString()}ms`;
	const formatTokens = (value: number) => `${value.toLocaleString()}`;
	const formatTimestamp = (timestamp: string) => {
		try {
			if (!timestamp) return "";
			const [date, time] = timestamp.split(" ");
			if (!time) return "";
			const [hours, minutes] = time.split(":");

			const index = data.findIndex((d) => d.timestamp === timestamp);

			const prevDate =
				index > 0 ? data[index - 1]?.timestamp?.split(" ")[0] : null;

			if (index === 0 || (prevDate && prevDate !== date)) {
				return `${date} ${hours}:${minutes}`;
			}

			return `${hours}:${minutes}`;
		} catch (error) {
			console.error("Error formatting timestamp:", timestamp);
			return timestamp;
		}
	};

	const isDayChange = (currentTimestamp: string, index: number) => {
		if (index === 0 || !data[index - 1]?.timestamp) return false;
		const [currentDate] = currentTimestamp.split(" ");
		const [previousDate] = data[index - 1]?.timestamp?.split(" ") || [];
		return currentDate !== previousDate;
	};

	const providerColors: { [key: string]: string } = {
		openai: "#6A5ACD",
		anthropic: "#FF6B6B",
		bedrock: "#4682B4",
		grok: "#9370DB",
		openrouter: "#FF69B4",
		mistral: "#20B2AA",
		"perplexity-ai": "#FFD700",
		workers: "#5F9EA0",
		groq: "#FF4500",
		"google-ai-studio": "#4CAF50",
		replicate: "#1E90FF",
		"github-models": "#2196F3",
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
					data={extendedData}
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
					{data.map((entry, index) =>
						isDayChange(entry.timestamp, index) ? (
							<ReferenceLine
								key={`ref-${entry.timestamp}`}
								x={entry.timestamp}
								stroke="var(--foreground)"
								strokeDasharray="3 3"
								opacity={0.5}
							/>
						) : null,
					)}
				</ComposedChart>
			</ResponsiveContainer>
		</ChartContainer>
	);
}
