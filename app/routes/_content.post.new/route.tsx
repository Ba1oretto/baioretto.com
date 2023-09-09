import type { LinksFunction, LoaderArgs } from "@remix-run/node";
import editor_styles from "./editor.css";
import viewer_styles from "~/routes/_content.post.$slug/viewer.css";
import { useEffect, useId, useReducer, useRef, useState } from "react";
import { DraftPropertiesInit, draftReducer } from "~/routes/_content.post.new/DraftReducer";
import type { EditorAction } from "~/routes/_content.post.new/ActionButton";
import SwitchActionButton from "~/routes/_content.post.new/ActionButton";
import ContentEditor from "~/routes/_content.post.new/ContentEditor";
import { CategoryInput, ExcerptInput, SlugInput, TagsInput, TitleInput, VisibilitySelection } from "~/routes/_content.post.new/MetaEditor";
import SubmitButton from "~/routes/_content.post.new/SubmitButton";
import { Form } from "@remix-run/react";
import { parse, PermissionGroup } from "~/util/helper";
import { getSessionUser, hasPermission } from "~/util/user.server";
import { redirect } from "@remix-run/router";

export const links: LinksFunction = () => [
	{ rel: "stylesheet", href: editor_styles },
	{ rel: "stylesheet", href: viewer_styles },
];

export const loader = async ({ request }: LoaderArgs) => {
	if (!await hasPermission(await getSessionUser(request), PermissionGroup.CONTRIBUTOR)) {
		const back_to = request.headers.get("Referer");
		throw redirect(back_to && back_to !== request.url ? back_to : "/home");
	}

	return null;
};

export default function New() {
	const action_state = useState<EditorAction>("write");
	const [ action ] = action_state;

	const node_id = useId();
	const content_id = node_id + "content";
	const cursor_position = useRef(0);

	const reducer = useReducer(draftReducer, DraftPropertiesInit);
	const [ { content }, dispatch ] = reducer;

	useEffect(() => {
		const draft_cache = localStorage.getItem("DRAFT_CACHE");
		if (!draft_cache) return;
		dispatch(() => JSON.parse(draft_cache));
	}, [ dispatch ]);

	return (
		<Form method="post" className="editor-wrapper flex flex-col rounded-2xl border border-charcoal-gray bg-abyss-blue" replace>
			<TitleInput reducer={ reducer } />
			<SwitchActionButton content_id={ content_id } state={ action_state } />
			{ action === "write" ? (
				<ContentEditor id={ content_id } cursor_position={ cursor_position } reducer={ reducer } />
			) : action === "preview" ? (
				<section className="viewer m-5 p-4 rounded-md bg-abyss-blue" dangerouslySetInnerHTML={ { __html: parse(content ? content : "Nothing to preview...") } } />
			) : (
				<section className="grid grid-cols-2">
					<CategoryInput reducer={ reducer } />
					<VisibilitySelection reducer={ reducer } />
					<SlugInput reducer={ reducer } />
					<TagsInput reducer={ reducer } />
					<ExcerptInput reducer={ reducer } />
				</section>
			) }
			<SubmitButton reducer={ reducer } />
		</Form>
	);
}
