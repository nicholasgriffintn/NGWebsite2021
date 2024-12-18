"use client";

import { useState, useEffect } from "react";
import NextImage, { type ImageProps } from "next/image";
import clsx from "clsx";

const loadImage = async (setImageDimensions, setError, imageUrl) => {
	const imageDataUrl = `https://images.s3rve.co.uk/?width=1920&format=json&image=${imageUrl}`;

	const imageData = await fetch(imageDataUrl);

	if (!imageData.ok) {
		setError(true);
		return;
	}

	const imageDataJson = (await imageData.json()) as {
		width: number;
		height: number;
	};

	if (!imageDataJson.width || !imageDataJson.height) {
		setError(true);
		return;
	}

	setImageDimensions({
		width: imageDataJson.width,
		height: imageDataJson.height,
	});
};

export function Image({
	src,
	alt,
	width,
	height,
	placeholder = "blur",
	className,
	unoptimized = false,
	blurDataURL,
	...props
}: ImageProps) {
	const [imageDimensions, setImageDimensions] = useState<{
		width?: number;
		height?: number;
	}>({
		width: width ? Number(width) : undefined,
		height: height ? Number(height) : undefined,
	});
	const [imageError, setImageError] = useState(false);
	const [loadingComplete, setLoadingComplete] = useState(false);

	useEffect(() => {
		const load = async () => {
			if (!width && !height) {
				await loadImage(setImageDimensions, setImageError, src);
			}
		};

		load();
	}, [src, width, height]);

	const classes = clsx(
		"image",
		!loadingComplete ? "image--loading" : "",
		imageError ? "image--error" : "",
		!width && !height ? "image--fill" : "",
		className,
	);

	return (
		<div className={classes}>
			<picture>
				<NextImage
					{...props}
					src={src}
					alt={alt}
					fill={!imageDimensions?.width && !imageDimensions?.height}
					sizes={
						!imageDimensions?.width && !imageDimensions?.height
							? "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
							: undefined
					}
					width={imageDimensions?.width}
					height={imageDimensions?.height}
					className="image__img"
					placeholder="blur"
					blurDataURL="data:image/..."
					onError={() => {
						setImageError(true);
						setLoadingComplete(true);
					}}
					onLoad={() => {
						setLoadingComplete(true);
					}}
					unoptimized={unoptimized}
				/>
			</picture>
		</div>
	);
}
