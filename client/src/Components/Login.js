import React from 'react'
import { Link } from 'react-router-dom';
import styled from 'styled-components';

export const Login = () => {

    const isEmpty = (str) => {
        return str.length === 0 || !str.trim();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        let username = document.forms.login.elements["username"].value;
        let password = document.forms.login.elements["password"].value;
        
        if (!isEmpty(username) && !isEmpty(password)) {
            fetch("/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username,
                    password,
                }),
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.status != 200) {
                        //ERROR
                    } else {
                        //SET USER
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        } else {
            //SET ERROR. FIELDS CANT BE EMPTY
        }
    };

    return (
        <Wrapper>
            <LoginContent>
                <h2>Login</h2>
                <form id="login" onSubmit={handleSubmit}>
                    <FormWrapper>
                        <input id="username" placeholder="Username"></input>
                        <input
                            id="password"
                            type="password"
                            placeholder="Password"
                        ></input>
                        <button type="submit">Login</button>
                    </FormWrapper>
                </form>
                <p>error</p>
                <StyledLink to="/register">
                    <p>Create Account</p>
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
