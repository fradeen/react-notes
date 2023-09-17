import { useMemo, useState, useRef } from "react";
import { Badge, Button, Card, Col, Form, Modal, Row, Stack } from "react-bootstrap";
import { Link } from "react-router-dom";
import ReactSelect from "react-select";
import { Tag } from "./App";
import styles from "./NotesList.module.css"

type NoteListProp = {
    availableTags: Tag[]
    notes: SimplifiedNote[]
    deleteTag: (id: string) => Promise<void>
    updateTag: (id: string, label: string) => Promise<void>
}

type SimplifiedNote = {
    id: string
    title: string
    tags: Tag[]
}
type EditTagsModalProps = {
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
        </>
    )
}

function NoteCard({ id, title, tags }: SimplifiedNote) {
    return (
        <Card as={Link} to={`/${id}`} className={`h-100 text-reset text-decoration-none ${styles.card} `}>
            <Card.Body>
                <Stack gap={2} className="align-items-center justify-content-center h-100">
                    <span className="fs-5">{title}</span>
                    {tags.length > 0 && (
                        <Stack gap={1} direction="horizontal"
                            className="justify-content-center flex-wrap">
                            {tags.map(tag => (
                                <Badge className="text-truncate" key={tag._id}>{tag.label}</Badge>
                            ))}
                        </Stack>
                    )}
                </Stack>
            </Card.Body>
        </Card>
    )
}


function EditTagsModal({ availableTags, handleClose, show, updateTag, deleteTag, editButonsStates, setEditButonsStates }: EditTagsModalProps) {
    let editedNoteRefs = useRef<HTMLInputElement[]>([])
    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Edit tags</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Stack gap={2}>
                        {availableTags.map((tag, index) => (
                            <Row key={tag._id}>
                                <Col >
                                    <Form.Control ref={(ref: HTMLInputElement) => editedNoteRefs.current![index] = ref}
                                        required type="text" defaultValue={tag.label} onChange={e => {
                                            let newEditButtonsState = [...editButonsStates]
                                            newEditButtonsState[index] = false
                                            setEditButonsStates(newEditButtonsState)
                                        }} />
                                </Col>
                                <Col xs="auto">
                                    <Button variant="primary" disabled={editButonsStates[index]} id={tag._id + "_save"} onClick={e => {
                                        updateTag(tag._id, editedNoteRefs.current![index].value)
                                        let newEditButtonsState = [...editButonsStates]
                                        newEditButtonsState[index] = true
                                        setEditButonsStates(newEditButtonsState)
                                    }} >Save</Button>
                                </Col>
                                <Col xs="auto">
                                    <Button variant="outline-danger" onClick={e => {
                                        deleteTag(tag._id)
                                    }} >&times;</Button>
                                </Col>
                            </Row>
                        ))}
                    </Stack>
                </Form>
            </Modal.Body>
        </Modal>
    )
}