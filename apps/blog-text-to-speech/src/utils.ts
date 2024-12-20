export function parseFrontmatter(fileContent: string): { content: string } {
	const frontmatterRegex = /---\s*([\s\S]*?)\s*---/;
	const match = frontmatterRegex.exec(fileContent);
	if (!match) {
		throw new Error("No frontmatter block found");
	}

	const content = fileContent.replace(frontmatterRegex, "").trim();

	return {
		content
	};
}

interface Transformation {
	pattern: RegExp;
	replacement: string | ((match: string, ...args: string[]) => string);
}

export function formatContentForSpeech(markdownContent: string): string {
    if (!markdownContent?.trim()) {
        return '';
    }

    const PAUSE_LENGTHS = {
        SHORT: '0.3s',
        MEDIUM: '0.8s',
        LONG: '1.0s'
    };

    let content = markdownContent;

    content = content
        // Replace HTML entities
        .replace(/&quot;/g, '"')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        // Escape existing SSML tags
        .replace(/<break/g, '&lt;break')
        .replace(/<emphasis/g, '&lt;emphasis');

    const transformations: Transformation[] = [
        // Remove markdown links while preserving text
        {
            pattern: /\[([^\]]+)\]\([^)]+\)/g,
            replacement: '$1'
        },
        // Convert images to descriptive text
        {
            pattern: /!\[([^\]]*)\]\([^)]*\)/g,
            replacement: (_match: string, alt: string) => alt ? `Image: ${alt}` : ''
        },
        // Remove code blocks (multi-line)
        {
            pattern: /```[\s\S]*?```/g,
            replacement: ''
        },
        // Remove inline code
        {
            pattern: /`[^`]*`/g,
            replacement: ''
        },
        // Convert headers to emphasized text with pauses
        {
            pattern: /#{1,6}\s*(.*)/g,
            replacement: (_match: string, header: string) => 
                `<break time="${PAUSE_LENGTHS.LONG}" /><emphasis level="strong">${header}</emphasis><break time="${PAUSE_LENGTHS.MEDIUM}" />`
        },
        // Add pauses after paragraphs
        {
            pattern: /\n\n/g,
            replacement: ` <break time="${PAUSE_LENGTHS.MEDIUM}" /> `
        },
        // Convert bullet points to spoken format
        {
            pattern: /^\s*[-*]\s/gm,
            replacement: `<break time="${PAUSE_LENGTHS.SHORT}" />• `
        },
        // Handle numbered lists
        {
            pattern: /^\s*\d+\.\s/gm,
            replacement: `<break time="${PAUSE_LENGTHS.SHORT}" /> `
        },
        // Convert emphasis markers (* and _) to SSML
        {
            pattern: /(\*\*|__)(.*?)\1/g,
            replacement: '<emphasis level="strong">$2</emphasis>'
        },
        {
            pattern: /(\*|_)(.*?)\1/g,
            replacement: '<emphasis level="moderate">$2</emphasis>'
        }
    ];

    transformations.forEach(({ pattern, replacement }) => {
        content = content.replace(pattern, replacement as string & ((substring: string, ...args: any[]) => string));
    });

    content = content
        // Normalize whitespace
        .replace(/\s+/g, ' ')
        // Remove any remaining markdown symbols
        .replace(/[#*_~`]/g, '')
        // Clean up any double breaks
        .replace(/(<break[^>]+>\s*){2,}/g, '<break time="1.0s" />')
        .trim();

    return content;
}