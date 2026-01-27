import { NextRequest, NextResponse } from "next/server";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getProductFileKey } from "@/lib/productFileMap";

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME;

const S3 = new S3Client({
	region: "auto",
	endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
	credentials: {
		accessKeyId: R2_ACCESS_KEY_ID || "",
		secretAccessKey: R2_SECRET_ACCESS_KEY || "",
	},
});

export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;
	const slug = searchParams.get("slug");
	const format = searchParams.get("format");
	const token = searchParams.get("cf-turnstile-response");

	if (!slug || !format || (format !== "PDF" && format !== "PNG")) {
		return NextResponse.json({ error: "Missing slug or valid format (PDF/PNG)" }, { status: 400 });
	}

	if (!token) {
		return NextResponse.json({ error: "Missing Turnstile token" }, { status: 400 });
	}

	// Lógica de validación de Turnstile
	const formData = new FormData();
	formData.append("secret", process.env.TURNSTILE_SECRET_KEY || "");
	formData.append("response", token);
	// Opcional: pasar la IP del usuario para mayor seguridad
	// formData.append('remoteip', request.ip);

	const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
		method: "POST",
		body: formData,
	});

	const outcome: { success: boolean } = await response.json();
	if (!outcome.success) {
		return NextResponse.json({ error: "Invalid Turnstile token" }, { status: 403 });
	}

	const fileKey = getProductFileKey(slug, format as "PDF" | "PNG");

	if (!fileKey) {
		return NextResponse.json({ error: "File not found for this product" }, { status: 404 });
	}

	try {
		const command = new GetObjectCommand({
			Bucket: R2_BUCKET_NAME,
			Key: fileKey,
		});

		// Generar URL firmada válida por 15 minutos (900 segundos)
		// Esto minimiza el riesgo si la URL es compartida
		const signedUrl = await getSignedUrl(S3, command, { expiresIn: 900 });

		return NextResponse.redirect(signedUrl);
	} catch (error) {
		console.error("Error generating signed URL:", error);
		return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
	}
}
