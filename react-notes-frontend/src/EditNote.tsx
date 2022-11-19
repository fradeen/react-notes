import { NoteData, Tag } from "./App";
import { NoteForm } from "./NoteForm";
import { useNote } from "./NotesLayout";
type EditNoteProps = {
    onSubmit: (id: string, data: NoteData) => void
    onAddTag: (tag: Tag) => void
    availableTags: Tag[]
}
export function Editnote({ onSubmit, onAddTag, availableTags }: EditNoteProps) {
    const note = useNote()
    return (
        <>
            <h1 className="mb-4">Edit Note</h1>
            <NoteForm onSubmit={data => onSubmit(note.id, data)} onAddTag={onAddTag} availableTags={availableTags}
                title={note.title} markdown={note.markdown} tags={note.tags} />
        </>
    )
}