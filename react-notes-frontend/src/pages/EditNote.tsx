import { useLocation } from "react-router-dom";
import { NoteForm } from "../components/NoteForm";
import { Note, Tag } from "./NoteList";
export function Editnote() {
    let { state } = useLocation();
    let note = state.note as Note;
    let availableTags = state.availableTags as Tag[];
    return (
        <>
            <h1 className="mb-4">Edit Note</h1>
            <NoteForm availableTags={availableTags} title={note.title} markdown={note.markdown} tags={note.tags as Tag[]} id={note.id} isUpdate={true} />
        </>
    )
}