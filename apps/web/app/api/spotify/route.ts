export const runtime = "edge";

export async function GET() {
	const lastFmToken = process.env.LAST_FM_TOKEN;

	if (!lastFmToken) {
		return Response.json({
			message: "Error fetching data from Audioscrobbler",
			status: 500,
		});
	}

	const res = await fetch(
		`https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=NGriiffin&api_key=${lastFmToken}&limit=10&format=json`,
		{
			headers: {
				"Content-Type": "application/json",
				"User-Agent": "NGWeb",
			},
		},
	);

	if (!res.ok) {
		return Response.json({
			message: "Error fetching data from Audioscrobbler",
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
