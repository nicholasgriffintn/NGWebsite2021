import { cookies } from "next/headers";

export async function validateToken() {
	const systemAuthToken = process.env.AUTH_TOKEN || "";
	if (!systemAuthToken) return null;

	const cookieStore = await cookies();
	const userAuthToken = cookieStore.get("authToken");
	return userAuthToken?.value === systemAuthToken ? userAuthToken.value : null;
}
