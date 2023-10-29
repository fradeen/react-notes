import { useMemo, useState } from "react";
import { Button, Col, Form, Row, Stack } from "react-bootstrap";
import { Link } from "react-router-dom";
import ReactSelect from "react-select";
import { Tag } from "./App";
import { EditTagsModal } from "./EditTagsModal";
import { LoginModal } from './LoginModal'
import { NoteCard } from "./NoteCard";

type NoteListProp = {
    availableTags: Tag[]
    notes: SimplifiedNote[]
    deleteTag: (id: string) => Promise<void>
    updateTag: (id: string, label: string) => Promise<void>
}

export type SimplifiedNote = {
    id: string
    title: string
    tags: Tag[]
}
export type EditTagsModalProps = {
    availableTags: Tag[]
    handleClose: () => void
    show: boolean
    deleteTag: (id: string) => void
    updateTag: (id: string, label: string) => void
    editButonsStates: boolean[]
    setEditButonsStates: (data: boolean[]) => void
}

export function NoteList({ availableTags, notes, updateTag, deleteTag }: NoteListProp) {
    const [selectedTags, setSelectedTags] = useState<Tag[]>([])
    const [title, setTitle] = useState("")
    const [editTagsModalIsOpen, setEditTagsModalIsOpen] = useState(false)
    const [loginModalIsOpen, setLoginModalIsOpen] = useState(false)
    const [editButonsStates, setEditButonsStates] = useState<boolean[]>([])
    const filteredNotes = useMemo(() => {
        return notes.filter(note => {
            return (
                (title === "" ||
                    note.title.toLowerCase().includes(title.toLowerCase())) &&
                (selectedTags.length === 0 ||
                    selectedTags.every(tag =>
                        note.tags.some(noteTag => noteTag._id === tag._id)
                    ))
            )
        })
    }, [title, selectedTags, notes])
    return (
        <>
            <Row className="align-items-center mb-4">
                <Col><h1>Notes</h1></Col>
                <Col xs="auto">
                    <Stack gap={2} direction="horizontal">
                        <Link to="/new">
                            <Button variant="primary">Create</Button>
                        </Link>
                        <Button variant="outline-secondary" onClick={() => {
                            setEditTagsModalIsOpen(true)
                            setEditButonsStates(Array(availableTags.length).fill(true))
                        }}>Edit Tags</Button>
                        <Button variant="outline-secondary" onClick={() => {
                            setLoginModalIsOpen(true)
                        }}>Login Modal</Button>
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
                                options={availableTags.map(tag => {
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
                        <NoteCard id={note.id} title={note.title} tags={note.tags} />
                    </Col>
                ))}
            </Row>
            <EditTagsModal editButonsStates={editButonsStates} setEditButonsStates={(data) => setEditButonsStates(data)} deleteTag={deleteTag} updateTag={updateTag} show={editTagsModalIsOpen} handleClose={() => { setEditTagsModalIsOpen(false) }} availableTags={availableTags} />
            <LoginModal show={loginModalIsOpen} handleClose={() => { setLoginModalIsOpen(false) }} />
        </>
    )
}

