import React, { useState, useContext } from 'react';
import { Container, Form, Button, Card, Row, Col } from 'react-bootstrap';
import { Link, Navigate, useNavigate} from 'react-router-dom';
import { Notyf } from 'notyf';
import UserContext from '../context/UserContext';

export default function LoginForm(props){

    const notyf = new Notyf();

    const navigate = useNavigate();

    const { user, setUser } = useContext(UserContext);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [willRedirect, setWillRedirect] = useState(false);

    const authenticate = (e) => {

        e.preventDefault();

        fetch(`${ import.meta.env.VITE_API_URL }/users/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: email,
                password: password
            })
        })
        .then(res => res.json())
        .then(data => {


            if (typeof data.access !== 'undefined') {
                localStorage.setItem('token', data.access);
                retrieveUserDetails(data.access);
                notyf.success("Successful Login")
                navigate("/products")
            } else {
                notyf.error("Login Unsuccessful. Try Again.")
            }

        })
    }
    
    const retrieveUserDetails = (token) => {

        fetch(`${import.meta.env.VITE_API_URL}/users/details`, {
            headers: { Authorization: `Bearer ${ token }`}
        })
        .then(res => res.json())
        .then(data => {

            setUser({ id: data._id, isAdmin: data.isAdmin });

            if (data.isAdmin === true) {
                setWillRedirect(true);
            } else {
                if (props.location.state.from === 'cart') {
                   
                } else {
                    setWillRedirect(true);
                }
            }
        })
    }

    return(
        <Container>
            {
                willRedirect === true ?
                    user.isAdmin === true ?
                        <Navigate to='/products'/>
                    :
                        <Navigate to='/'/>
                :
                <Row className="justify-content-center mt-5 ">
                    <Col xs md="6">
                        <h2 className="text-center my-4">Log In</h2>
                        <Card>
                            <Form onSubmit={e => authenticate(e)}>
                                <Card.Body>
                                    <Form.Group controlId="userEmail">
                                        <Form.Label>Email:</Form.Label>
                                        <Form.Control
                                            type="email"
                                            placeholder="Enter your email"
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                            required
                                        />
                                    </Form.Group>
    
                                    <Form.Group controlId="password">
                                        <Form.Label>Password:</Form.Label>
                                        <Form.Control
                                            type="password"
                                            placeholder="Enter your password"
                                            value={password}
                                            onChange={e => setPassword(e.target.value)}
                                            required
                                        />
                                    </Form.Group>
    
                                </Card.Body>
                                <Card.Footer>
                                    <Button variant="primary" type="submit" block>
                                        Submit
                                    </Button>
                                </Card.Footer>
                            </Form>
                        </Card>
                        <p className="text-center mt-3">
                            Don't have an account yet? <Link to="/register">Click here</Link> to register.
                        </p>
                    </Col>              
                </Row>
            }
        </Container>

    );
    
}
