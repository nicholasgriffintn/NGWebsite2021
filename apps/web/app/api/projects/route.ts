export const runtime = 'edge';

import data from "./data.json";

export async function GET() {
	return Response.json(data, {
		headers: {
			"Cache-Control": "s-maxage=180000",
		},
	});
}
