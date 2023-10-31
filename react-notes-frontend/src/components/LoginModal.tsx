import { useContext, useState } from "react";
import { Button, Col, Form, Modal, Row, Stack } from "react-bootstrap";
import { useLocalStorage } from "../customHooks/useLocalStorage";
import { AuthContext } from "./AuthProvider";

type LoginModalProps = {
    show: boolean,
    handleClose: () => void
}

export function LoginModal({ show, handleClose }: LoginModalProps) {
    let [email, setEmail] = useState('');
    let [password, setpassword] = useState('');
    let [isLogininProgress, setIsLoginInProgress] = useState(false);
    let { login } = useContext(AuthContext);

    return (
        <Modal show={show}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}>
            <Modal.Header>
                <Modal.Title>Login</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Stack gap={2}>
                        <Row>
                            <Col>
                                <Form.Group controlId="Email">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control required type="email" value={email} onChange={(e) => { setEmail(e.target.value) }} autoFocus />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Group controlId="Password">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control required type="password" value={password} onChange={(e) => { setpassword(e.target.value) }} />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col >
                                <Button type="button" variant="primary" disabled={isLogininProgress} onClick={async () => {
                                    login({ email, password });
                                    handleClose();
                                }}>Login</Button>
                            </Col>
                        </Row>
                        <Row>
                            <Col >
                                <Button type="button" variant="primary" disabled={isLogininProgress} onClick={() => { }}>Refresh</Button>
                            </Col>
                        </Row>
                    </Stack>
                </Form>
            </Modal.Body>
        </Modal>
    );
}
