import React, { useContext } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import styled from "styled-components";
import { Blackjack } from "./Components/Blackjack";
import { Header } from "./Components/Header";
import { Leaderboard } from "./Components/Leaderboard";
import { Login } from "./Components/Login";
import Register from "./Components/Register";
import { UserContext } from "./Components/UserContext";
import GlobalStyle from "./GlobalStyle";
const App = () => {
    const {user} = useContext(UserContext);
    return (
        <BrowserRouter>
            <GlobalStyle />
            {user && <Header />}
            <Wrapper>
            <Switch>
                <Route exact path="/">
                    {user ? <p>Home</p> : <Login/>}
                </Route>
                <Route path="/blackjack">
                    {user ? <Blackjack /> : <Login/>}
                </Route>
                <Route path="/leaderboard">
                    {user ? <Leaderboard/> : <Login/>}
                </Route>
                <Route path="/login">
                    <Login/>
                </Route>
                <Route path="/register">
                    <Register/>
                </Route>
            </Switch>
            </Wrapper>
        </BrowserRouter>
    );
};
const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: 100%;
    margin: auto;
`;
export default App;
