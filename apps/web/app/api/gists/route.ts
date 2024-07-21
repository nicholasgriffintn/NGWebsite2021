export const runtime = 'edge';

export async function GET() {
	const res = await fetch(
		"https://api.github.com/users/nicholasgriffintn/gists",
		{
			headers: {
				"Content-Type": "application/json",
				"User-Agent": "NGWeb",
			},
		},
	);

	if (!res.ok) {
		return Response.json({
			message: "Error fetching data from GitHub",
			status: 500,
		});
	}

	const data = await res.json();

	return Response.json(data, {
		headers: {
			"Cache-Control": "s-maxage=180000",
		},
	});
}
