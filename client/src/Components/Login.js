import React, { useContext, useState } from 'react'
import { Link,useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { UserContext } from "./UserContext";

const isEmpty = (str) => {
    return str.length === 0 || !str.trim();
};

export const Login = () => {
    const {setUser} = useContext(UserContext)
    const [error,setError] = useState();
    let history = useHistory()

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
                        setError(data.message)
                    } else {
                        let currentUser = data.user;
                        delete currentUser.password;
                        localStorage.setItem("user", currentUser._id);
                        setUser(currentUser);
                        history.push("/");
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        } else {
            setError("Fields cannot be left empty.")
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
                <p>{error}</p>
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
