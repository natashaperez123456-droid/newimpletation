import { revalidatePath, revalidateTag } from "next/cache";

type RevalidatePayload = {
	secret?: string;
	tags?: string[] | string;
	paths?: string[] | string;
};

const toList = (value?: string[] | string) => {
	if (!value) {
		return [];
	}
	return Array.isArray(value) ? value : [value];
};

const parseRequest = async (req: Request) => {
	const secret = process.env.REVALIDATE_SECRET;
	const url = new URL(req.url);
	const searchTags = url.searchParams.getAll("tags");
	const searchPaths = url.searchParams.getAll("paths");
	const searchSecret = url.searchParams.get("secret") ?? undefined;

	let body: RevalidatePayload = {};
	try {
		if (req.headers.get("content-type")?.includes("application/json")) {
			body = (await req.json()) as RevalidatePayload;
		}
	} catch {
		body = {};
	}

	const tags = Array.from(new Set([...searchTags, ...toList(body.tags)].filter(Boolean)));
	const paths = Array.from(new Set([...searchPaths, ...toList(body.paths)].filter(Boolean)));

	const providedSecret = body.secret ?? searchSecret;
	return { secret, providedSecret, tags, paths };
};

const handleRevalidate = async (req: Request) => {
	const { secret, providedSecret, tags, paths } = await parseRequest(req);

	if (secret && providedSecret !== secret) {
		console.warn("Revalidate blocked: invalid secret");
		return new Response("Unauthorized", { status: 401 });
	}

	console.log("Revalidate request", { url: req.url, tags, paths });

	for (const tag of tags) {
		revalidateTag(tag);
	}
	for (const path of paths) {
		revalidatePath(path);
	}

	return Response.json({ revalidated: true, tags, paths });
};

export async function POST(req: Request) {
	return handleRevalidate(req);
}

export async function GET(req: Request) {
	return handleRevalidate(req);
}
