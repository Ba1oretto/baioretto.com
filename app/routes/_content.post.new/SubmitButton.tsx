import type { DraftReducerArgs } from "~/routes/_content.post.new/DraftReducer";
import { useFetcher } from "@remix-run/react";

export default function SubmitButton({ reducer }: DraftReducerArgs) {
	const [ draft ] = reducer;
	const fetcher = useFetcher();

	function submit() {
		fetcher.submit({ data: JSON.stringify(draft, (key, value) => key.startsWith("_") ? undefined : value) }, { action: "/action/upload_post", method: "post" });
	}

	return (
		<section className="flex justify-end">
			<button type="button" onClick={ submit } className="px-4 py-2 mx-5 mb-3 -mt-2 rounded-lg text-xl bg-emerald-green text-light-gray disabled:opacity-80">
				submit new post
			</button>
		</section>
	);
}