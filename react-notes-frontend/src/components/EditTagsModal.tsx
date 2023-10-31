import { useRef } from "react";
import { Button, Col, Form, Modal, Row, Stack } from "react-bootstrap";
import { Tag } from "../pages/NoteList";

export type EditTagsModalProps = {
    availableTags: Tag[]
    handleClose: () => void
    show: boolean
    deleteTag: (id: string) => void
    updateTag: (id: string, label: string) => void
    editButonsStates: boolean[]
    setEditButonsStates: (data: boolean[]) => void
}

export function EditTagsModal({ availableTags, handleClose, show, updateTag, deleteTag, editButonsStates, setEditButonsStates }: EditTagsModalProps) {
    let editedNoteRefs = useRef<HTMLInputElement[]>([]);
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
                                <Col>
                                    <Form.Control ref={(ref: HTMLInputElement) => editedNoteRefs.current![index] = ref}
                                        required type="text" defaultValue={tag.label} onChange={e => {
                                            let newEditButtonsState = [...editButonsStates];
                                            newEditButtonsState[index] = false;
                                            setEditButonsStates(newEditButtonsState);
                                        }} />
                                </Col>
                                <Col xs="auto">
                                    <Button variant="primary" disabled={editButonsStates[index]} id={tag._id + "_save"} onClick={e => {
                                        updateTag(tag._id, editedNoteRefs.current![index].value);
                                        let newEditButtonsState = [...editButonsStates];
                                        newEditButtonsState[index] = true;
                                        setEditButonsStates(newEditButtonsState);
                                    }}>Save</Button>
                                </Col>
                                <Col xs="auto">
                                    <Button variant="outline-danger" onClick={e => {
                                        deleteTag(tag._id);
                                    }}>&times;</Button>
                                </Col>
                            </Row>
                        ))}
                    </Stack>
                </Form>
            </Modal.Body>
        </Modal>
    );
}
