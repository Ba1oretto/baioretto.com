import type { ChangeEvent, FormEvent, KeyboardEvent, MouseEvent } from "react";
import { useEffect, useRef, useState } from "react";
import type { DraftCompound, DraftProperties, DraftReducerArgs } from "~/routes/_content.post.new/DraftReducer";
import { DraftCompoundInit } from "~/routes/_content.post.new/DraftReducer";
import { useFetcher } from "@remix-run/react";
import { PermissionGroup, responded } from "~/util/helper";

export function TitleInput({ reducer }: DraftReducerArgs) {
	const [ { title }, dispatch ] = reducer;

	function handleInput(event: ChangeEvent<HTMLInputElement>) {
		dispatch({ key: "title", value: event.currentTarget.value });
	}

	return (
		<label>
			<input
				type="text"
				value={ title }
				onChange={ handleInput }
				spellCheck="false"
				placeholder="Title"
				autoFocus
			/>
		</label>
	);
}

export function SlugInput({ reducer }: DraftReducerArgs) {
	const [ { slug }, dispatch ] = reducer;

	function handleInput(event: ChangeEvent<HTMLInputElement>) {
		dispatch({ key: "slug", value: event.currentTarget.value });
	}

	return (
		<label className="col-span-2">
			<input
				type="text"
				value={ slug }
				onChange={ handleInput }
				spellCheck="false"
				placeholder="Slug"
			/>
		</label>
	);
}

export function CategoryInput({ reducer }: DraftReducerArgs) {
	const [ { category, _visible_category_suggestion }, dispatch ] = reducer;
	const [ is_input_focus, setInputFocus ] = useState(false);
	const editable = !category.id.length;

	const fetcher = useFetcher();
	const timeout_id = useRef<NodeJS.Timeout>();

	const input_element = useRef({} as HTMLInputElement);

	function searchCategory(event: FormEvent<HTMLInputElement>) {
		if (!editable) return;

		clearTimeout(timeout_id.current);
		dispatch({ key: "category", value: { id: "", name: event.currentTarget.value } });
		dispatch({ key: "_category_suggestion", value: DraftCompoundInit });
		dispatch({ key: "_visible_category_suggestion", value: "" });

		timeout_id.current = setTimeout(async query => {
			const url = new URL("/api/query_search", window.location.origin);
			url.search = new URLSearchParams({ category: query }).toString();
			fetcher.load(url.pathname + url.search);
		}, 300, event.currentTarget.value);
	}

	function restCategory() {
		dispatch({ key: "category", value: DraftCompoundInit });
		dispatch({ key: "_category_suggestion", value: DraftCompoundInit });
		dispatch({ key: "_visible_category_suggestion", value: "" });
		input_element.current.focus();
	}

	// handle suggestion response
	useEffect(() => {
		const suggestion = fetcher.data;
		if (!responded<DraftCompound>(fetcher.state, suggestion)) return;

		dispatch(prev_state => {
			const next_state: DraftProperties = { ...prev_state, _category_suggestion: suggestion };
			const category = prev_state.category;
			let visible_suggestion;

			if (category.name === suggestion.name) {
				// actual: Presentation, suggestion: Presentation
				next_state["_visible_category_suggestion"] = "";
				next_state["_category_suggestion"] = DraftCompoundInit;
				next_state["category"] = suggestion;
			} else if (category.name === (visible_suggestion = category.name + suggestion.name.slice(category.name.length))) {
				// actual: presentation, suggestion: Presentation
				next_state["_visible_category_suggestion"] = suggestion.name;
			} else {
				// actual: prese, suggestion: ntation
				next_state["_visible_category_suggestion"] = visible_suggestion;
			}

			return next_state;
		});
	}, [ fetcher, dispatch ]);

	function autocomplete(event: KeyboardEvent<HTMLInputElement>) {
		if (event.key !== "Enter") return;
		event.preventDefault();
		dispatch(prev_state => {
			if (!prev_state._category_suggestion.id) return prev_state;
			return {
				...prev_state,
				category: prev_state._category_suggestion,
				_visible_category_suggestion: "",
				_category_suggestion: DraftCompoundInit,
			};
		});
	}

	return (
		<label className="relative flex items-center" data-highlight={ is_input_focus }>
			<span className="absolute p-4 text-xl text-dusky-gray">{ _visible_category_suggestion }</span>
			<input
				ref={ input_element }
				className="relative w-full"
				type="text"
				value={ category.name }
				onKeyDown={ autocomplete }
				onChange={ searchCategory }
				spellCheck="false"
				autoComplete="off"
				placeholder="Category"
				onBlur={ () => setInputFocus(false) }
				onFocus={ () => setInputFocus(true) }
			/>
			<button
				className="absolute right-4 self-center p-1 rounded-full text-dim-gray opacity-0 pointer-events-none data-[display]:opacity-100 data-[display]:pointer-events-auto"
				type="button"
				data-display={ editable ? undefined : true }
				disabled={ editable }
				onClick={ restCategory }
			>
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 96 960 960" height="28" width="28" fill="currentColor">
					<path d="m251.333 857.71-53.043-53.043L426.957 576 198.29 347.333l53.043-53.043L480 522.957 708.667 294.29l53.043 53.043L533.043 576 761.71 804.667l-53.043 53.043L480 629.043 251.333 857.71Z" />
				</svg>
			</button>
		</label>
	);
}

export function VisibilitySelection({ reducer }: DraftReducerArgs) {
	const [ { visibility }, dispatch ] = reducer;

	function handleOptionSelect(event: ChangeEvent<HTMLSelectElement>) {
		dispatch({ key: "visibility", value: event.currentTarget.value });
	}

	return (
		<label className="selection-wrapper relative after:content-['▼'] after:absolute after:right-4 after:top-1/2 after:-translate-y-1/2 after:text-dusky-gray after:text-2xl after:pointer-events-none">
			<select
				value={ visibility ? visibility : "default" }
				onChange={ handleOptionSelect }
				data-default={ visibility ? undefined : visibility }
			>
				<option value="default" disabled>Select a permission group</option>
				{ Object.keys(PermissionGroup).filter(key => isNaN(Number(key)) && key !== "NONE").map(key => (
					<option key={ key } value={ PermissionGroup[key as keyof typeof PermissionGroup] }>
						{ key }
					</option>
				)) }
			</select>
		</label>
	);
}

export function TagsInput({ reducer }: DraftReducerArgs) {
	const [ { tags, _visible_tag_suggestion }, dispatch ] = reducer;

	const [ is_input_focus, setInputFocus ] = useState(false);
	const tags_container_element = useRef({} as HTMLDivElement);
	const tag_input_element = useRef({} as HTMLInputElement);
	const suggestion_element = useRef({} as HTMLSpanElement);

	const fetcher = useFetcher();
	const timeout_id = useRef<NodeJS.Timeout>();

	function searchTag(event: FormEvent<HTMLInputElement>) {
		clearTimeout(timeout_id.current);
		dispatch({ key: "tags", value: { id: "", name: event.currentTarget.value } });
		dispatch({ key: "_tag_suggestion", value: DraftCompoundInit });
		dispatch({ key: "_visible_tag_suggestion", value: "" });

		timeout_id.current = setTimeout(async query => {
			const url = new URL("/api/query_search", window.location.origin);
			url.search = new URLSearchParams({ tag: query }).toString();
			fetcher.load(url.pathname + url.search);
		}, 300, event.currentTarget.value);
	}

	function removeTag(event: MouseEvent<HTMLButtonElement>, index: number) {
		event.preventDefault();
		dispatch(prev_state => {
			const next_tag = prev_state.tags;
			next_tag.splice(index, 1);
			return {
				...prev_state,
				tags: next_tag,
			};
		});
	}

	function autocomplete(event: KeyboardEvent<HTMLInputElement>) {
		if (event.key !== "Enter") return;
		event.preventDefault();
		dispatch(prev_state => {
			if (!prev_state._tag_suggestion.id) return prev_state;
			const next_tag = prev_state.tags;
			next_tag[next_tag.length - 1] = prev_state._tag_suggestion;
			next_tag.push(DraftCompoundInit);
			return {
				...prev_state,
				tags: next_tag,
				_visible_tag_suggestion: "",
				_tag_suggestion: DraftCompoundInit,
			};
		});
	}

	// handle suggestion response
	useEffect(() => {
		const suggestion = fetcher.data;
		if (!responded<DraftCompound>(fetcher.state, suggestion)) return;

		dispatch(prev_state => {
			if (prev_state.tags.some(({ id }) => id === suggestion.id)) return prev_state;

			const next_tag = prev_state.tags;
			const next_state: DraftProperties = { ...prev_state, _tag_suggestion: suggestion, tags: next_tag };

			const tag = next_tag.at(-1)!;  // we already passed a initialized value to reducer
			let visible_suggestion;

			if (tag.name === suggestion.name) {
				// actual: Assignment, suggestion: Assignment
				next_state["_visible_tag_suggestion"] = "";
				next_state["_tag_suggestion"] = DraftCompoundInit;
				tag.id = suggestion.id;
				next_tag.push(DraftCompoundInit);
			} else if (tag.name === (visible_suggestion = tag.name + suggestion.name.slice(tag.name.length))) {
				// actual: assignment, suggestion: Assignment
				next_state["_visible_tag_suggestion"] = suggestion.name;
			} else {
				// actual: assi, suggestion: gnment
				next_state["_visible_tag_suggestion"] = visible_suggestion;
			}

			return next_state;
		});
	}, [ dispatch, fetcher ]);

	// set input text indent
	useEffect(() => {
		const indent = tags_container_element.current.offsetWidth - Number(!(tags.length - 1)) * 16 + "px";
		tag_input_element.current.style.textIndent = indent;
		suggestion_element.current.style.textIndent = indent;
	}, [ tags ]);

	return (
		<label className="relative flex items-center col-span-2" data-highlight={ is_input_focus }>
			<span ref={ suggestion_element } className="absolute pl-4 text-xl text-dusky-gray">{ _visible_tag_suggestion }</span>
			<input
				className="relative"
				ref={ tag_input_element }
				placeholder={ tags.length - 1 ? "add more..." : "Tags" }
				value={ tags.at(-1)!.name }
				type="text"
				spellCheck="false"
				onChange={ searchTag }
				onFocus={ () => setInputFocus(true) }
				onBlur={ () => setInputFocus(false) }
				onKeyDown={ autocomplete }
			/>
			<section ref={ tags_container_element } className="absolute flex gap-x-4 pl-4 text-xl">
				{ tags.slice(0, tags.length - 1).map(({ id, name }, index) => (
					<span key={ id } className="flex">
						{ name }
						<button className="ml-2 self-center rounded-full text-dim-gray" onClick={ event => removeTag(event, index) } type="button">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 96 960 960" height="24" width="24" fill="currentColor">
								<path d="m251.333 857.71-53.043-53.043L426.957 576 198.29 347.333l53.043-53.043L480 522.957 708.667 294.29l53.043 53.043L533.043 576 761.71 804.667l-53.043 53.043L480 629.043 251.333 857.71Z" />
							</svg>
						</button>
					</span>
				)) }
			</section>
		</label>
	);
}

export function ExcerptInput({ reducer }: DraftReducerArgs) {
	const [ { excerpt }, dispatch ] = reducer;

	function handleInput(event: ChangeEvent<HTMLTextAreaElement>) {
		dispatch({ key: "excerpt", value: event.currentTarget.value });
	}

	return (
		<label className="col-span-2">
			<textarea
				value={ excerpt }
				onChange={ handleInput }
				spellCheck="false"
				placeholder="Excerpt"
			/>
		</label>
	);
}
