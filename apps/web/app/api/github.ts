import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData = {
	message: string;
};

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<ResponseData>,
) {
	const data = await fetch(
		`https://api.github.com/users/nicholasgriffintn/repos?sort=updated&type=public&per_page=${
			req.query.limit || "8"
		}&page=${req.query.offset || "1"}`,
		{
			headers: {
				"User-Agent": "NGWeb",
			},
		},
	);

	if (!data.ok) {
		return res.status(500).json({ message: "Error fetching data from GitHub" });
	}

	const json = await data.json();

	res.setHeader("Cache-Control", "s-maxage=180000");
	res.status(200).json(json);
}
