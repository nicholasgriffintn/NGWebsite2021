"use client";

import { useState } from "react";

import { MetricDetails } from "./details";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CombinedMetricsChart } from "./chart";
import type { Metric } from "../types";

const parseMetadata = (metadataString: string) => {
	try {
		if (!metadataString) {
			return {};
		}
		return JSON.parse(metadataString);
	} catch (error) {
		console.error("Error parsing metadata:", error);
		return {};
	}
};

export function MetricsDashboard({ metrics }: { metrics: Metric[] }) {
	const [selectedMetric, setSelectedMetric] = useState<Metric | null>(null);

	const combinedChartData = metrics.map((metric) => {
		const metadata = parseMetadata(metric.metadata);
		const tokenUsage = metadata.tokenUsage || {};
		return {
			name: `${metadata.provider} (${metadata.model})`,
			latency: metric.value,
			promptTokens: tokenUsage.prompt_tokens || 0,
			completionTokens: tokenUsage.completion_tokens || 0,
			totalTokens: tokenUsage.total_tokens || 0,
		};
	});

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
			<Card className="md:col-span-1">
				<CardHeader>
					<CardTitle>AI Provider Metrics</CardTitle>
					<CardDescription>
						Latency and token usage for different AI providers and models
					</CardDescription>
				</CardHeader>
				<CardContent className="h-[600px]">
					<CombinedMetricsChart data={combinedChartData} />
				</CardContent>
			</Card>

			<Card className="md:col-span-1">
				<CardHeader>
					<CardTitle>Metrics Details</CardTitle>
					<CardDescription>
						Detailed information for each metric entry
					</CardDescription>
				</CardHeader>
				<CardContent className="h-[600px] p-0">
					<ScrollArea className="h-full">
						<div className="p-4">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Provider (Model)</TableHead>
										<TableHead>Latency (ms)</TableHead>
										<TableHead>Total Tokens</TableHead>
										<TableHead>Status</TableHead>
										<TableHead>Timestamp</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{metrics.map((metric) => {
										const metadata = parseMetadata(metric.metadata);
										const tokenUsage = metadata.tokenUsage || {};
										return (
											<TableRow
												key={metric.traceId}
												className="cursor-pointer hover:bg-muted/50"
												onClick={() => setSelectedMetric(metric)}
											>
												<TableCell>{`${metadata.provider} (${metadata.model})`}</TableCell>
												<TableCell>{metric.value}</TableCell>
												<TableCell>
													{tokenUsage.total_tokens || "N/A"}
												</TableCell>
												<TableCell>{metric.status}</TableCell>
												<TableCell>{metric.timestamp}</TableCell>
											</TableRow>
										);
									})}
								</TableBody>
							</Table>
						</div>
					</ScrollArea>
				</CardContent>
			</Card>
			{selectedMetric && (
				<MetricDetails
					metric={selectedMetric}
					onClose={() => setSelectedMetric(null)}
				/>
			)}
		</div>
	);
}
