import { useContext, useEffect, useMemo, useState } from "react";
import { Button, ButtonGroup, Col, Form, Row, Stack } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import ReactSelect from "react-select";
import { EditTagsModal } from "../components/EditTagsModal";
import { NoteCard } from "../components/NoteCard";
import { AuthContext } from "../components/AuthProvider";
import { fetchRawNotes } from "../api/notes";
import { deleteTag, fetchTags, updateTag } from "../api/tags";

export type Note = {
    id: string
} & NoteData
export type NoteData = {
    title: string
    markdown: string
    tags: Tag[]
}
export type Tag = {
    _id: string
    label: string
}

export type SimplifiedNote = {
    id: string
    title: string
    tags: Tag[]
}
export type EditTagsModalProps = {
    tags: Tag[]
    handleClose: () => void
    show: boolean
    deleteTag: (id: string) => void
    updateTag: (id: string, label: string) => void
    editButonsStates: boolean[]
    setEditButonsStates: (data: boolean[]) => void
}
export type RawNote = {
    _id: string
} & RawNoteData

export type RawNoteData = {
    title: string
    markdown: string
    tagIds: string[]
}

export function NoteList() {
    let [notes, setNotes] = useState<RawNote[]>([])
    let [tags, setTags] = useState<Tag[]>([])
    let notesWithTags = useMemo(() => {
        return notes.map(note => {
            return { ...note, tags: tags.filter(tag => note.tagIds.includes(tag._id)), id: note._id }
        })
    }, [notes, tags])
    let [selectedTags, setSelectedTags] = useState<Tag[]>([])
    let [title, setTitle] = useState("")
    let [editTagsModalIsOpen, setEditTagsModalIsOpen] = useState(false)
    let [editButonsStates, setEditButonsStates] = useState<boolean[]>([])
    let { user, refresh, logOut } = useContext(AuthContext);
    let navigate = useNavigate();
    let filteredNotes = useMemo(() => {
        return notesWithTags.filter(note => {
            return (
                (title === "" ||
                    note.title.toLowerCase().includes(title.toLowerCase())) &&
                (selectedTags.length === 0 ||
                    selectedTags.every(tag =>
                        note.tags.some(noteTag => noteTag._id === tag._id)
                    ))
            )
        })
    }, [title, selectedTags, notesWithTags])
    useEffect(() => {
        user && getNotes()
    }, [notes.length, user])
    useEffect(() => {
        user && getTags()
    }, [tags.length, user])
    useEffect(() => {
        if (!user) {
            setNotes([]);
            setTags([]);
            setTitle("");
            setSelectedTags([]);
        }

    }, [user]);

    async function getNotes() {
        if (!user!.authToken) return
        try {
            let notes = await fetchRawNotes(user!);
            notes && setNotes(notes);
        }
        catch (error: any) {
            if (error instanceof Error) {
                if (error.message.match("Auth token Expired, refreshing."))
                    await refresh();
            }
            else { window.alert(error); }
        }
    }

    async function getTags() {
        if (!user!.authToken) return
        try {
            let tags = await fetchTags(user!);
            tags && setTags(tags!);
        }
        catch (error: any) {
            if (error instanceof Error) {
                if (error.message.match("Auth token Expired, refreshing."))
                    await refresh();
            }
            else { window.alert(error); }
        }
    }

    async function onUpdateTag(id: string, label: string) {
        if (!user!.authToken) return
        try {
            let updated = await updateTag(id, label, user!)
            updated && getTags();
        } catch (error: any) {
            if (error instanceof Error) {
                if (error.message.match("Auth token Expired, refreshing."))
                    await refresh();
            }
            else { window.alert(error); }
        }
    }

    async function onDeleteTag(id: string) {
        if (!user!.authToken) return
        try {
            let updated = await deleteTag(id, user!)
            updated && getTags();
        } catch (error: any) {
            if (error instanceof Error) {
                if (error.message.match("Auth token Expired, refreshing."))
                    await refresh();
            }
            else { window.alert(error); }
        }
    }

    let LogOutButton = function () {
        //TODO: implement modal for usee detials update;
        if (user)
            return (
                <ButtonGroup>
                    <Button variant="outline-dark" >{user.userName}</Button>
                    <Button variant="danger" onClick={async () => {
                        await logOut();
                        //navigate("/");
                    }}>Log Out</Button>
                </ButtonGroup>
            );
        else
            return (
                <></>
            );
    }

    return (
        <>
            <Row className="align-items-center mb-4">
                <Col><h1>Notes</h1></Col>
                <Col xs="auto">
                    <Stack gap={2} direction="horizontal">
                        <ButtonGroup>
                            <Button variant="primary" onClick={() => {
                                navigate("/new", { state: { tags: tags } });
                            }}>Create</Button>
                            <Button variant="outline-secondary" onClick={() => {
                                setEditTagsModalIsOpen(true)
                                setEditButonsStates(Array(tags.length).fill(true))
                            }}>Edit Tags</Button>
                        </ButtonGroup>
                        <LogOutButton />
                    </Stack>
                </Col>
            </Row>
            <Form>
                <Row className="mb-4">
                    <Col>
                        <Form.Group controlId="title">
                            <Form.Label>Title</Form.Label>
                            <Form.Control type="text" value={title}
                                onChange={e => setTitle(e.target.value)}
                            />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId="tags">
                            <Form.Label>Tags</Form.Label>
                            <ReactSelect

                                value={selectedTags.map(tag => {
                                    return {
                                        label: tag.label,
                                        value: tag._id
                                    }
                                })}
                                onChange={tags => {
                                    setSelectedTags(tags.map(tag => {
                                        return { label: tag.label, _id: tag.value }
                                    }))
                                }}
                                options={tags.map(tag => {
                                    return { label: tag.label, value: tag._id }
                                })}
                                isMulti />
                        </Form.Group>
                    </Col>
                </Row>
            </Form>
            <Row xs={1} sm={2} lg={3} xl={4} className="g-3" >
                {filteredNotes.map(note => (
                    <Col key={note.id}>
                        <NoteCard note={{
                            title: note.title,
                            markdown: note.markdown,
                            tags: note.tags,
                            id: note.id
                        }}
                            availableTags={tags} />
                    </Col>
                ))}
            </Row>
            <EditTagsModal editButonsStates={editButonsStates} setEditButonsStates={(data) => setEditButonsStates(data)} deleteTag={onDeleteTag} updateTag={onUpdateTag} show={editTagsModalIsOpen} handleClose={() => { setEditTagsModalIsOpen(false) }} availableTags={tags} />
        </>
    )
}

