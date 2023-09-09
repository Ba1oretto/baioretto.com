import type { Dispatch } from "react";
import { PermissionGroup } from "~/util/helper";

export interface DraftCompound {
	id: string;
	name: string;
}

export interface BaseDraftProperties {
	[index: string]: string | DraftCompound | DraftCompound[] | PermissionGroup;

	title: string;
	slug: string;
	category: DraftCompound;
	tags: DraftCompound[];
	visibility: PermissionGroup;
	excerpt: string;
	content: string;
}

export interface DraftProperties extends BaseDraftProperties {
	_visible_category_suggestion: string;
	_visible_tag_suggestion: string;

	_category_suggestion: DraftCompound;
	_tag_suggestion: DraftCompound;
}

interface DraftSingleAction<T extends keyof DraftProperties = keyof DraftProperties> {
	key: T;
	value: DraftProperties[T];
}

type DraftCallbackAction = (prev_state: DraftProperties) => DraftProperties;

export interface DraftReducerArgs {
	reducer: [ DraftProperties, Dispatch<DraftSingleAction | DraftCallbackAction> ];
}

export const DraftCompoundInit: DraftCompound = {
	id: "",
	name: "",
};

export const DraftPropertiesInit: DraftProperties = {
	title: "",
	slug: "",
	category: DraftCompoundInit,
	tags: [ DraftCompoundInit ],
	visibility: PermissionGroup.NONE,
	excerpt: "",
	content: "",

	_visible_category_suggestion: "",
	_visible_tag_suggestion: "",

	_category_suggestion: DraftCompoundInit,
	_tag_suggestion: DraftCompoundInit,
};

function isCallback(action: DraftSingleAction | DraftCallbackAction): action is DraftCallbackAction {
	return typeof action === "function";
}

export function draftReducer(prev_state: DraftProperties, action: DraftSingleAction | DraftCallbackAction) {
	// Make sure the previous state is not modified.
	let next_state = structuredClone(prev_state);

	if (isCallback(action)) {
		next_state = action(next_state);
	} else {
		if (action.key === "tags") {
			const new_tags = next_state.tags;
			// Not replace, but modify the last one of tags.
			new_tags[new_tags.length - 1] = action.value as DraftCompound;
		} else {
			next_state[action.key] = action.value;
		}
	}

	localStorage.setItem("DRAFT_CACHE", JSON.stringify(next_state));

	return next_state;
}
