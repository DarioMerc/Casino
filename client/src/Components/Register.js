import React from 'react'
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Register = () => {
    const isEmpty = (str) => {
        return str.length === 0 || !str.trim();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        let username = document.forms.register.elements["username"].value;
        let password = document.forms.register.elements["password"].value;
        let passwordConfirm =
            document.forms.register.elements["confirmPassword"].value;

        if (
            isEmpty(username) ||
            isEmpty(password) ||
            isEmpty(passwordConfirm)
        ) {
            // setError("All fields must be filled.");
        } else if (password !== passwordConfirm) {
            // setError("Passwords do not match.");
        } else {
            fetch("/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username,
                    password,
                    "balance":1000
                }),
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.status == 201) {
                        //CREATE USER AND LOG THEM IN
                    } else {
                        //ERROR
                    }
                });
        }
    };

    return (
        <Wrapper>
            <LoginContent>
                <h2>Register</h2>
                <form id="login" onSubmit={handleSubmit}>
                    <FormWrapper>
                        <input id="username" placeholder="Username"></input>
                        <input
                            id="password"
                            type="password"
                            placeholder="Password"
                        ></input>
                        <input
                            id="confirmPassword"
                            type="password"
                            placeholder="Confirm Password"
                        ></input>
                        <button type="submit">Register</button>
                    </FormWrapper>
                </form>
                <p>error</p>
                <StyledLink to="/login">
                    <p>Login</p>
                </StyledLink>
            </LoginContent>
        </Wrapper>
    );
};
const Wrapper = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 90vh;
`
const LoginContent = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    border: 2px solid black;
    align-items: center;
    padding: 10px;
`;
const FormWrapper = styled.div`
    display: flex;
    flex-direction: column;
    height: auto;
`;
const StyledLink = styled(Link)`
    text-decoration: none;
    font-weight: bold;
    color: orange;
    &:hover {
        color: red;
        transition: 0.5s;
    }
`;

export default Register
