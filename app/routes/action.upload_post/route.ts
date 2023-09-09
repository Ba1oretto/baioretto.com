import type { ActionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { BaseDraftProperties } from "~/routes/_content.post.new/DraftReducer";
import { parse, PermissionGroup, reject } from "~/util/helper";
import { db } from "~/util/database.server";
import { getSessionUser, hasPermission } from "~/util/user.server";
import { redirect } from "@remix-run/router";

export const FieldKeys = [ "title", "slug", "category", "tags", "visibility", "excerpt", "content" ];

interface PostUploadActionResponse {
	error: { [index: string]: string } | string;
}

const FieldValidateFunctions: {
	[index: string]: (value: any) => string | undefined
} = {
	title: value => {
		if (typeof value !== "string") return "illegal type";
		if (value.trim().length < 5) return "too short";
	},
	slug: value => {
		if (typeof value !== "string") return "illegal type";
		if (value.trim().length < 5) return "too short";
	},
	category: value => {
		if (typeof value !== "object") return "illegal type";
		if (!("id" in value && "name" in value)) return "illegal struct";
		const { id, name } = value;
		if (id.length != 36) return `${ name }: not a category`;
	},
	tags: value => {
		if (!Array.isArray(value)) return "illegal type";
		if (value.length > 1 && value.pop()?.id.length !== 0) return "illegal struct";
		for (const { id, name } of value) {
			if (id.length != 36) return `${ name }: not a tag`;
		}
	},
	visibility: value => {
		if (!(value in PermissionGroup)) return "illegal type";
		if (Number(value) === 0) return "not selected";
	},
	excerpt: value => {
		if (typeof value !== "string") return "illegal type";
		if (value.trim().length < 5) return "too short";
	},
	content: value => {
		if (typeof value !== "string") return "illegal type";
		if (value.trim().length < 5) return "too short";
	},
};

export const action = async ({ request }: ActionArgs) => {
	const user = await getSessionUser(request);
	if (!user) throw json("Invalid Access🖕", { status: 401 });
	const allowed = await hasPermission(user, PermissionGroup.CONTRIBUTOR);
	if (!allowed) throw json("You do not have the Permission to Access this Action🤗", { status: 403 });

	const body = await request.formData();
	const data_string = body.get("data") as string | null;
	if (!data_string) throw reject<PostUploadActionResponse>({ error: "No Data Passed" });

	let data: BaseDraftProperties;
	try {
		data = JSON.parse(data_string);
	} catch (_) {
		throw reject<PostUploadActionResponse>({ error: "Invalid Data Format" });
	}

	// check all fields are resolved
	const missed_fields = FieldKeys.filter(value => !(value in data));
	if (missed_fields.length) {
		const field_error = {} as { [index: string]: string };
		missed_fields.forEach(field => field_error[field] = "Field Missing");
		throw reject<PostUploadActionResponse>({ error: field_error });
	}

	// check if each field is valid
	const field_errors: { [index: string]: string } = {};
	let should_throw = false;
	for (const key in data) {
		const message = FieldValidateFunctions[key](data[key]);
		if (message) {
			field_errors[key] = message;
			should_throw = true;
		}
	}
	if (should_throw) throw reject<PostUploadActionResponse>({ error: field_errors });

	await db.category.findUniqueOrThrow({ where: { id: data.category.id } });

	for (const { id } of data.tags) {
		await db.tag.findUniqueOrThrow({ where: { id } });
	}

	const { title, slug, category, visibility, excerpt } = data;
	const raw_content = data.content;
	const content = parse(raw_content);
	const new_post = await db.post.create({
		data: {
			title,
			slug: slug,
			excerpt,
			content,
			raw_content,
			author_id: user.id,
			category_id: category.id,
			permission: Number(visibility),
		},
	});

	return redirect(`/post/${ new_post.slug }`);
};

export const loader = () => {
	throw reject("Invalid Access");
};