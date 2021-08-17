//Login boilerplate from https://serverless-stack.com/chapters/create-a-login-page.html
import "./Login.css";
import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import {Navbar, Nav, NavDropdown, Form, Button, Container} from "react-bootstrap";
import axios from "axios";

export default function Login() {
    const history = useHistory();
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [invalid,setInvalid] = useState(true);

    function validateForm() {
        return email.length > 0 && password.length >0;
    }

    async function handleSubmit(event) {
        event.preventDefault(); //Not sure what this does
        //TODO: Add validation of user credentials. If validated, prime user data for use
        setInvalid(false);
        try {
            const res = await axios.post('/api/auth', {email: email , password: password});
            if (res) {
                //localStorage.setItem('email',res.data ); //make sure to clear on logout
                localStorage.setItem('email',JSON.stringify(res.data)); //make sure to clear on logout
                let path = `/Landing`;
                history.push(path);
            } else {
                setInvalid(true);//set invalid flag, render a error box
            }
            console.log(res.data);
        } catch (err) {
            //setInvalid(true);
        }
    }

    return (
        <div className={"Login"}>
            <Form onSubmit={handleSubmit}>
                <img
                    src="/Brews.svg"
                    width="50"
                    height="50"
                    className=""
                    alt="BREWS logo"
                />
                <span className="Logoname">BREWS</span>
                <div className="instructions">Welcome to the Brewery REcommendation for Walk-in and Enjoying System. Login with your email and password, or create an account to begin.</div>

                <Form.Group className="mt-2" size={"lg"} controlId={"email"}>
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        autoFocus
                        type={"email"}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </Form.Group>
                <Form.Group className="mt-2" size={"lg"} controlId={"password"}>
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type={"password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Form.Group>
                <Button variant="outline-info" className="mt-4" block size={"lg"} type={"Submit"} disabled={!validateForm()}>
                    Login
                </Button>
                <Form.Text hidden={invalid}>Invalid Credentials</Form.Text>
                <div className="mt-3">Not registered?<a class="Register" href="#">Create an account</a></div>
            </Form>
        </div>
    );
}
