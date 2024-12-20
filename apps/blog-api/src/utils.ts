import { JSON_HEADERS } from "./constants";

export const createResponse = (data: any, status = 200): Response => {
    return new Response(
        JSON.stringify(data),
        { 
            status,
            headers: JSON_HEADERS
        }
    );
};