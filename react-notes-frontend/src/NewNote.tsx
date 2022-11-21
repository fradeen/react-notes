import { NoteData, Tag } from "./App";
import { NoteForm } from "./NoteForm";
type NewNoteProps = {
    onSubmit: (data: NoteData) => void
    onAddTag: (label: string) => Promise<string>
    availableTags: Tag[]
}
export function NewNote({ onSubmit, onAddTag, availableTags }: NewNoteProps) {
    return (
        <>
            <h1 className="mb-4">New Note</h1>
            <NoteForm onSubmit={onSubmit} onAddTag={onAddTag} availableTags={availableTags} />
        </>
    )
}