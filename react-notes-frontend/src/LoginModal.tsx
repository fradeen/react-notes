import { useContext, useState } from "react";
import { Button, Col, Form, Modal, Row, Stack } from "react-bootstrap";
import { CurrentUserContext, User, userContextType } from "./App";

type LoginModalProps = {
    show: boolean,
    handleClose: () => void
}

type LoginFormData = {
    email: string,
    password: string
}

let login = async function (userData: LoginFormData): Promise<User | null> {
    try {
        let resp = await fetch('https://localhost:5000/auth/login', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(userData),
        });
        if (resp.status !== 200)
            throw new Error("Something went wrong");
        let authToken = resp.headers.get("authorization");
        if (!authToken)
            throw new Error("Something went wrong");
        localStorage.setItem("authToken", authToken);
        let respJson = await resp.json();
        let user = respJson.data as User;
        return user;

    } catch (error) {
        window.alert(error);
        return null;
    }
}

let refresh = async function () {
    try {
        let resp = await fetch('https://localhost:5000/auth/refresh', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });
        if (resp.status !== 201)
            throw new Error("Something went wrong");
        let authToken = resp.headers.get("authorization");
        if (!authToken)
            throw new Error("Something went wrong");
        localStorage.setItem("authToken", authToken)

    } catch (error) {
        window.alert(error);
        return;
    }
}

export function LoginModal({ show, handleClose }: LoginModalProps) {
    let [email, setEmail] = useState('');
    let [password, setpassword] = useState('');
    let [isLogininProgress, setIsLoginInProgress] = useState(false);
    let userContext = useContext<userContextType>(CurrentUserContext);

    let onLogin = function (user: User | null) {
        if (!user) return
        userContext.setUser!(user);
        handleClose();
    }

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
                                    let user = await login({ email, password });
                                    onLogin(user);
                                }}>Login</Button>
                            </Col>
                        </Row>
                        <Row>
                            <Col >
                                <Button type="button" variant="primary" disabled={isLogininProgress} onClick={() => refresh()}>Refresh</Button>
                            </Col>
                        </Row>
                    </Stack>
                </Form>
            </Modal.Body>
        </Modal>
    );
}
