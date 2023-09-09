import type { Dispatch, KeyboardEvent, MouseEvent, SetStateAction } from "react";
import { useRef } from "react";

export type EditorAction = "write" | "preview" | "fillinfo";

interface SwitchActionArgs {
	content_id: string;
	state: [ EditorAction, Dispatch<SetStateAction<EditorAction>> ];
}

export default function ActionButton({ content_id, state }: SwitchActionArgs) {
	const [ action, setAction ] = state;
	const write_button = useRef<HTMLButtonElement>(null);
	const preview_button = useRef<HTMLButtonElement>(null);
	const fillinfo_button = useRef<HTMLButtonElement>(null);

	function switchToWrite(event: MouseEvent<HTMLButtonElement>) {
		event.preventDefault();
		setAction("write");
		setTimeout(() => (document.getElementById(content_id) as HTMLTextAreaElement).focus(), 1);
	}

	function switchToPreview(event: MouseEvent<HTMLButtonElement>) {
		event.preventDefault();
		setAction("preview");
	}

	function switchToFillinfo(event: MouseEvent<HTMLButtonElement>) {
		event.preventDefault();
		setAction("fillinfo");
	}

	function handleArrowNavigation(event: KeyboardEvent<HTMLButtonElement>) {
		if (!(event.key === "ArrowRight" || event.key === "ArrowLeft")) return;

		const mode = event.key === "ArrowRight";
		let action_target: [ EditorAction, HTMLButtonElement | null ];
		switch (event.target) {
			case write_button.current:
				action_target = mode ? [ "preview", preview_button.current ] : [ "fillinfo", fillinfo_button.current ];
				break;
			case preview_button.current:
				action_target = mode ? [ "fillinfo", fillinfo_button.current ] : [ "write", write_button.current ];
				break;
			case fillinfo_button.current:
				action_target = mode ? [ "write", write_button.current ] : [ "preview", preview_button.current ];
				break;
			default:
				throw new Error(`Unexpected event target ${ event.currentTarget.name }`);
		}

		const [ action, target ] = action_target;
		setAction(action);
		target?.focus();
	}

	return (
		<section className="action-toggler flex gap-x-4 px-5 mt-4 border-b border-charcoal-gray">
			<button
				ref={ write_button }
				onClick={ switchToWrite }
				onKeyDown={ handleArrowNavigation }
				type="button"
				data-active={ action === "write" }
			>
				Write
			</button>
			<button
				ref={ preview_button }
				onClick={ switchToPreview }
				onKeyDown={ handleArrowNavigation }
				type="button"
				tabIndex={ -1 }
				data-active={ action === "preview" }
			>
				Preview
			</button>
			<button
				ref={ fillinfo_button }
				onClick={ switchToFillinfo }
				onKeyDown={ handleArrowNavigation }
				type="button"
				tabIndex={ -1 }
				data-active={ action === "fillinfo" }
			>
				Meta
			</button>
		</section>
	);
}