'use client';

import { useState } from 'react';
import NextImage, { type ImageProps } from 'next/image';
import clsx from 'clsx';

export function Image({
  src,
  alt,
  width,
  height,
  placeholder = 'blur',
  className,
  unoptimized = false,
  blurDataURL,
  ...props
}: ImageProps) {
  const [imageError, setImageError] = useState(false);
  const [loadingComplete, setLoadingComplete] = useState(false);

  const classes = clsx(
    'image',
    !loadingComplete ? 'image--loading' : '',
    imageError ? 'image--error' : '',
    !width && !height ? 'image--fill' : '',
    className
  );

  return (
    <div className={classes}>
      <picture>
        <NextImage
          {...props}
          src={src}
          alt={alt}
          fill={!width && !height}
          sizes={
            !width && !height
              ? '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
              : undefined
          }
          width={width}
          height={height}
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
        />
      </picture>
    </div>
  );
}
