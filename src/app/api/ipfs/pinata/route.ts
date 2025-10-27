import { NextRequest, NextResponse } from "next/server";

type PinataErrorCause = { message?: string; code?: string | number } | undefined;
type ExtendedError = Error & { code?: string | number; cause?: PinataErrorCause };

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const jwt = process.env.PINATA_JWT;
    if (!jwt) {
      return NextResponse.json({ error: "Missing PINATA_JWT on server" }, { status: 500 });
    }

    const formData = await req.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file selected" }, { status: 400 });
    }
    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json({ error: "Image size cannot exceed 2MB" }, { status: 400 });
    }

    const fd = new FormData();
    // Append filename for better compatibility with gateways/services
    fd.append("file", file, (file as File).name || "upload");

    const resp = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
      method: "POST",
      headers: { Authorization: `Bearer ${jwt}` },
      body: fd,
      // Node18 requires duplex setting for streaming request body
      // @ts-expect-error node18 fetch option
      duplex: "half",
      cache: "no-store",
    });

    if (!resp.ok) {
      // Pass through Pinata status code and error text/JSON for accurate frontend diagnosis
      const contentType = resp.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        const errJson = await resp.json();
        return NextResponse.json({ error: errJson?.error || errJson?.message || errJson || "Pinata upload failed" }, { status: resp.status });
      }
      const errText = await resp.text();
      return NextResponse.json({ error: errText || "Pinata upload failed" }, { status: resp.status });
    }
    const json = (await resp.json()) as { IpfsHash?: string };
    const cid = json.IpfsHash || "";
    if (!cid) {
      return NextResponse.json({ error: "Pinata returned invalid response" }, { status: 502 });
    }
    return NextResponse.json({ cid });
  } catch (e: unknown) {
    const err = e as ExtendedError;
    const msg = err.message || String(e);
    const causeObj = err.cause;
    const cause = typeof causeObj === "object" && causeObj !== null ? (causeObj.message || String(causeObj.code || "")) : undefined;
    const detail: { name?: string; code?: string | number; cause?: string } = {
      name: err.name,
      code: err.code,
      cause,
    };
    return NextResponse.json({ error: msg, detail }, { status: 500 });
  }
}


