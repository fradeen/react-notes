import { FormEvent, useContext, useRef, useState } from "react"
import { Button, Col, Form, Row, Stack } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"
import CreateableReactSelect from "react-select/creatable"
import { Note, NoteData, Tag } from "../pages/NoteList"
import { AuthContext } from "./AuthProvider"
import { addTag } from "../api/tags"
import { createNote, updateNote } from "../api/notes"

type NoteFormProps = {
    availableTags: Tag[]
    isUpdate: boolean,
} & Partial<Note>

export function NoteForm({ availableTags, title = "", markdown = "", tags = [], isUpdate = false, id }: NoteFormProps) {
    let [newTitle, setNewTitle] = useState<string>(title)
    let [newMarkdown, setNewMarkdown] = useState<string>(markdown);
    let [selectedTags, setSelectedTags] = useState<Tag[]>(tags)
    let navigate = useNavigate();
    let { user, refresh } = useContext(AuthContext);
    async function handleSubmit(e: FormEvent) {
        try {
            e.preventDefault();
            let newNoteData: NoteData = {
                title: newTitle,
                markdown: newMarkdown,
                tags: selectedTags
            }
            let success = false
            if (id && isUpdate)
                success = await updateNote(id, newNoteData, user!);
            else
                success = await createNote(newNoteData, user!)
            navigate("/", { replace: true });
        } catch (error: any) {
            if (error instanceof Error) {
                if (error.message.match("Auth token Expired, refreshing."))
                    await refresh();
            }
            window.alert(error);
        }
    }

    async function onAddTag(label: string) {
        try {
            return await addTag(label, user!);
        } catch (error: any) {
            if (error instanceof Error) {
                if (error.message.match("Auth token Expired, refreshing."))
                    await refresh();
            }
            window.alert(error);
        }
    }
    return (
        <Form onSubmit={handleSubmit}>
            <Stack gap={4}>
                <Row>
                    <Col>
                        <Form.Group controlId="title">
                            <Form.Label>Title</Form.Label>
                            <Form.Control value={newTitle} required onChange={(e) => { setNewTitle(e.target.value) }} />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId="tags">
                            <Form.Label>Tags</Form.Label>
                            <CreateableReactSelect
                                onCreateOption={async (label) => {
                                    let newTagId = await onAddTag(label)
                                    if (newTagId.length > 0) {
                                        let newTag = { _id: newTagId, label: label }
                                        setSelectedTags(prev => [...prev, newTag])
                                    }
                                }}
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
                <Form.Group controlId="markdown">
                    <Form.Label>Body</Form.Label>
                    <Form.Control value={newMarkdown} required as="textarea" rows={15} onChange={(e) => { setNewMarkdown(e.target.value) }} />
                </Form.Group>
                <Stack direction="horizontal" gap={2} className="justify-content-end">
                    <Button type="submit" variant="primary">Save</Button>
                    <Link to="..">
                        <Button type="button" variant="outline-secondary" >Close</Button>
                    </Link>
                </Stack>
            </Stack>
        </Form>
    )
}