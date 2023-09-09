import { json } from "@remix-run/node";
import type { TypedResponse } from "@remix-run/node";
import * as marked from "marked";

export enum Permission {
	READ_POST = 1 << 0,      // 0000 0001
	WRITE_POST = 1 << 1,     // 0000 0010
	DELETE_POST = 1 << 2,    // 0000 0100
	VIEW_USERS = 1 << 3,     // 0000 1000
	EDIT_USER = 1 << 4,      // 0001 0000
}

export enum PermissionGroup {
	NONE = 0,
	GUEST = Permission.READ_POST,
	CONTRIBUTOR = Permission.READ_POST | Permission.WRITE_POST,
	ADMINISTRATOR = Permission.READ_POST | Permission.WRITE_POST | Permission.DELETE_POST | Permission.VIEW_USERS | Permission.EDIT_USER,
}

export enum UpdateType {
	Theme,
}

export function formatDate(date_instance: Date) {
	const [ _, month, date, full_year ] = date_instance.toDateString().split(" ");
	return `${ month } ${ date }, ${ full_year }`;
}

export function responded<T>(state: "idle" | "submitting" | "loading", data: any): data is T {
	return state === "idle" && data;
}

export function reject<T>(data: T): TypedResponse<T> {
	return json(data, { status: 400 });
}

export const parse = (() => {
	const renderer = {
		heading: (text: string, level: number) => `<h${ level } class="code-line">${ text }</h${ level }>`,
		paragraph: (text: string) => `<p class="has-line-data">${ text }</p>`,
		table: (header: string, body: string) => `<table class="table table-striped table-bordered"><thead>${ header }</thead>${ body }</table>`,
	};
	marked.use({ renderer });
	return marked.parse;
})();