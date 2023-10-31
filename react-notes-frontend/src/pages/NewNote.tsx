import { useLocation } from "react-router-dom";
import { NoteForm } from "../components/NoteForm";

export function NewNote() {
    let { state } = useLocation();
    let { tags } = state;
    return (
        <>
            <h1 className="mb-4">New Note</h1>
            <NoteForm availableTags={tags} isUpdate={false} />
        </>
    )
}