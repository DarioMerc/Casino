import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { Blackjack } from "./Components/Blackjack";
import { Header } from "./Components/Header";
import { Login } from "./Components/Login";
import Register from "./Components/Register";
import GlobalStyle from "./GlobalStyle";
const App = () => {
    return (
        <BrowserRouter>
            <GlobalStyle />
            <Header />
            <Switch>
                <Route exact path="/">
                    <p>Home</p>
                </Route>
                <Route path="/blackjack">
                    <Blackjack />
                </Route>
                <Route path="/leaderboard">
                    <p>leaderboard</p>
                </Route>
                <Route path="/login">
                    <Login/>
                </Route>
                <Route path="/register">
                    <Register/>
                </Route>
            </Switch>
        </BrowserRouter>
    );
};

export default App;
