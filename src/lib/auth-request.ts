import { NextRequest } from "next/server";

export type AuthBody = Record<string, unknown>;

export async function readRequestBody(req: NextRequest): Promise<AuthBody> {
  try {
    const contentType = req.headers.get("content-type") ?? "";

    if (contentType.includes("application/json")) {
      return (await req.json()) as AuthBody;
    }

    if (contentType.includes("multipart/form-data") || contentType.includes("application/x-www-form-urlencoded")) {
      const formData = await req.formData();
      const body: AuthBody = {};

      formData.forEach((value, key) => {
        body[key] = value instanceof File ? value.name : String(value);
      });

      return body;
    }

    const text = await req.text();
    if (!text) {
      return {};
    }

    try {
      return JSON.parse(text) as AuthBody;
    } catch {
      const params = new URLSearchParams(text);
      const body: AuthBody = {};
      params.forEach((value, key) => {
        body[key] = value;
      });
      return body;
    }
  } catch {
    return {};
  }
}

export function getStringValue(body: AuthBody, keys: string[]): string {
  for (const key of keys) {
    const value = body[key];
    if (typeof value === "string") {
      const trimmed = value.trim();
      if (trimmed) {
        return trimmed;
      }
    }
  }

  return "";
}
