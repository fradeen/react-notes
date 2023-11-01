import { useContext, useState } from "react";
import { Button, Col, Container, Form, Modal, Row, Stack, Tab, Tabs } from "react-bootstrap";
import { AuthContext } from "./AuthProvider";

type LoginModalProps = {
    show: boolean,
    handleClose: () => void
}

export function LoginModal({ show, handleClose }: LoginModalProps) {
    let [email, setEmail] = useState('');
    let [password, setpassword] = useState('');
    let [signUpEmail, setSignUpEmail] = useState('');
    let [userName, setUserName] = useState('');
    let [signUpPassword, setSignUpPassword] = useState('');
    let [passwordVerify, setpasswordVerify] = useState('');
    let [isLogininProgress, setIsLoginInProgress] = useState(false);
    let { login, signUp } = useContext(AuthContext);

    let resetInputs = function () {
        setIsLoginInProgress(false);
        setEmail("");
        setpassword("");
        setSignUpEmail("");
        setSignUpPassword("");
        setUserName("");
        setpasswordVerify("");
        handleClose();
    }

    return (
        <Modal show={show}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}>

            <Modal.Body>
                <Tabs
                    defaultActiveKey="login"
                    id="uncontrolled-tab-example"
                    className="mb-3"
                >
                    <Tab eventKey="login" title="Login">
                        <Form>
                            <Stack gap={2}>
                                <Row>
                                    <Col>
                                        <Form.Group controlId="Email">
                                            <Form.Label>Email</Form.Label>
                                            <Form.Control required type="email" value={email} onChange={(e) => { setEmail(e.target.value) }} />
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
                                            setIsLoginInProgress(true);
                                            await login({ email: email, password: password });
                                            resetInputs();
                                        }}>Sign in</Button>

                                    </Col>
                                </Row>
                            </Stack>
                        </Form>
                    </Tab>
                    <Tab eventKey="signUp" title="Sign Up">
                        <Form>
                            <Stack gap={2}>
                                <Row>
                                    <Col>
                                        <Form.Group controlId="signUpEmail">
                                            <Form.Label>Email</Form.Label>
                                            <Form.Control required type="email" value={signUpEmail} onChange={(e) => { setSignUpEmail(e.target.value) }} />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Form.Group controlId="userName">
                                            <Form.Label>User Name</Form.Label>
                                            <Form.Control required type="text" value={userName} onChange={(e) => { setUserName(e.target.value) }} />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Form.Group controlId="signUpPassword">
                                            <Form.Label>Password</Form.Label>
                                            <Form.Control required type="password" value={signUpPassword} onChange={(e) => { setSignUpPassword(e.target.value) }} />
                                        </Form.Group>
                                        <Form.Text id="passwordHelpBlock" muted>
                                            Your password must be 8-20 characters long, contain letters and numbers,
                                            and must not contain spaces, special characters, or emoji.
                                        </Form.Text>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Form.Group controlId="verifyPassword">
                                            <Form.Label>Verify Password</Form.Label>
                                            <Form.Control required type="password" value={passwordVerify} onChange={(e) => { setpasswordVerify(e.target.value) }} />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col >

                                        <Button type="button" variant="primary" disabled={isLogininProgress} onClick={async () => {
                                            setIsLoginInProgress(true);
                                            await signUp({ email: signUpEmail, password: signUpPassword, userName: userName });
                                            setIsLoginInProgress(false);
                                            //resetInputs();
                                        }}>Sign Up</Button>

                                    </Col>
                                </Row>
                            </Stack>
                        </Form>
                    </Tab>
                </Tabs>
            </Modal.Body>
        </Modal>
    );
}
