import { Badge, Card, Stack } from "react-bootstrap";
import { Link } from "react-router-dom";
import styles from "../styles/NotesList.module.css";
import { Note, Tag } from "../pages/NoteList";
export type NoteCardProps = {
    note: Note,
    availableTags: Tag[]
}
export function NoteCard({ note, availableTags }: NoteCardProps) {
    return (
        <Card as={Link} to={`/${note.id}`} state={{ note: note, availableTags: availableTags }} className={`h-100 text-reset text-decoration-none ${styles.card} `}>
            <Card.Body>
                <Stack gap={2} className="align-items-center justify-content-center h-100">
                    <span className="fs-5">{note.title}</span>
                    {note.tags.length > 0 && (
                        <Stack gap={1} direction="horizontal"
                            className="justify-content-center flex-wrap">
                            {note.tags.map(tag => (
                                <Badge className="text-truncate" key={tag._id}>{tag.label}</Badge>
                            ))}
                        </Stack>
                    )}
                </Stack>
            </Card.Body>
        </Card >
    );
}
