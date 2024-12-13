import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function getGradient(index: number, total: number, colors: string[]) {
	const defaultColor = "hsl(var(--primary))";
	if (colors.length < 2) return colors[0] ?? defaultColor;

	const position = index / Math.max(1, total - 1);
	const colorIndex = position * (colors.length - 1);
	const start = Math.floor(colorIndex);
	const end = Math.min(start + 1, colors.length - 1);
	const t = colorIndex - start;

	const startColor = colors[start] ?? defaultColor;
	const endColor = colors[end] ?? defaultColor;

	return interpolateColor(startColor, endColor, t);
}

function interpolateColor(color1: string, color2: string, t: number) {
	const c1 = color1.startsWith("#") ? color1 : color1;
	const c2 = color2.startsWith("#") ? color2 : color2;

	return t < 0.5 ? c1 : c2;
}
