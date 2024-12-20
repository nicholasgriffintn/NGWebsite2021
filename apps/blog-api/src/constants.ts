export const CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
}

export const JSON_HEADERS = {
    "Content-Type": "application/json",
    ...CORS_HEADERS,
}