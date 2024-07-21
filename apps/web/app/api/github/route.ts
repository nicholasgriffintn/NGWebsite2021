export const runtime = "edge";

export async function GET(req: Request) {
	const { searchParams } = new URL(req.url);
	const limit = searchParams.get("limit") || "8";
	const offset = searchParams.get("offset") || "1";

	const res = await fetch(
		`https://api.github.com/users/nicholasgriffintn/repos?sort=updated&type=public&per_page=${limit}&page=${offset}`,
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
