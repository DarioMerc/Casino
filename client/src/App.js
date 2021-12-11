import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { Blackjack } from "./Components/Blackjack";
import { Header } from "./Components/Header";
const App = () => {
    return (
        <BrowserRouter>
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
            </Switch>
        </BrowserRouter>
    );
};

export default App;
