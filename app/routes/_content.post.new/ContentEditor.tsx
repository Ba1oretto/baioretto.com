import type { ChangeEvent, DragEvent, MutableRefObject } from "react";
import { useEffect, useId, useRef, useState } from "react";
import type { action } from "~/routes/action.upload_image/route";
import { useFetcher } from "@remix-run/react";
import type { DraftReducerArgs } from "~/routes/_content.post.new/DraftReducer";

const IMAGE_URL = "/resource/images";

interface EditorArgs extends DraftReducerArgs {
  id: string;
  cursor_position: MutableRefObject<number>;
}

export default function ContentEditor({ id, cursor_position, reducer }: EditorArgs) {
  const [ is_image_drag_over, setImageDragging ] = useState(false);
  const [ { content }, dispatch ] = reducer;
  const file_upload_id = useId() + "upload";

  const textarea_element = useRef({} as HTMLTextAreaElement);
  const fetcher = useFetcher();

  function handleImageDragging(event: DragEvent<HTMLTextAreaElement>) {
    event.preventDefault();
    setImageDragging(true);
  }

  function handleImageDragged(event: DragEvent<HTMLTextAreaElement>) {
    event.preventDefault();
    setImageDragging(false);
  }

  function handleImageDrop(event: DragEvent<HTMLTextAreaElement>) {
    event.preventDefault();
    uploadImage(event.dataTransfer.files);
    setImageDragging(false);
  }

  function handleImageUpload(event: ChangeEvent<HTMLInputElement>) {
    event.preventDefault();
    uploadImage(event.currentTarget.files);
  }

  function handleInput(event: ChangeEvent<HTMLTextAreaElement>) {
    dispatch({ key: "content", value: event.currentTarget.value });
  }

  function saveCursorPosition() {
    cursor_position.current = textarea_element.current.selectionStart ?? 0;
  }

  function restoreCursorPosition() {
    textarea_element.current.selectionStart = cursor_position.current;
    textarea_element.current.selectionEnd = cursor_position.current;
  }

  function uploadImage(files: FileList | null) {
    if (!files) return;

    const data = new FormData();
    for (const file of files) {
      data.append("sampleFiles", file);
    }

    fetcher.submit(data, { action: "/action/upload_image", method: "post", encType: "multipart/form-data" });
  }

  // handle image upload response
  useEffect(() => {
    const data: Awaited<ReturnType<typeof action>> | null = fetcher.data;
    if (fetcher.state !== "idle" || !data) return;

    dispatch(prev_state => ({
      ...prev_state,
      content: prev_state.content.slice(0, cursor_position.current) + data.map(({ name, path }) => `![${ name }](${ IMAGE_URL }/${ path })`).join("\n") + prev_state.content.slice(cursor_position.current),
    }));
  }, [ cursor_position, dispatch, fetcher ]);

  return (
    <section
      className="editor-input-wrapper group flex flex-col p-[3px] data-[dragging]:shadow-aureole-blue-highlight"
      data-dragging={ is_image_drag_over ? true : undefined }
      onDragOver={ handleImageDragging } onDragEnter={ handleImageDragging } onDragLeave={ handleImageDragged }
      onDrop={ handleImageDrop }
    >
      <textarea
        className="border-b-2 border-dashed border-charcoal-gray focus:border-light-midnight-blue/80 group-data-[dragging]:border-light-midnight-blue/80 transition-colors"
        id={ id } value={ content } ref={ textarea_element }
        onChange={ handleInput } onBlur={ saveCursorPosition } onFocus={ restoreCursorPosition }
        rows={ 15 } dir="auto" spellCheck="false" placeholder="Type something..."
      />
      <label htmlFor={ file_upload_id } className="!m-0 p-4 !shadow-none cursor-pointer">
        <input id={ file_upload_id } type="file" className="hidden" onChange={ handleImageUpload } />
        <span className="text-lg text-dusky-gray font-medium select-none">Attach files by dragging & dropping, selecting or pasting them.</span>
      </label>
    </section>
  );
}
