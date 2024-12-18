const normalizeSrc = (src: string) => {
    return src.startsWith("/") ? src.slice(1) : src;
};

export default function cloudflareLoader({
    src,
    width,
    quality,
    ...props
}: { src: string; width: number; quality?: number }) {
    console.log(props);
    const isExternal = src.startsWith("http");
    if (isExternal) {
        return src;
    }
    
    const params = [`format=auto,width=${width}`];
    if (quality) {
        params.push(`quality=${quality}`);
	}
	const paramsString = params.join(",");
	return `https://ng-blog.s3rve.co.uk/cdn-cgi/image/${paramsString}/${normalizeSrc(src)}`;
}
