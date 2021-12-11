import React from "react";
import { NavLink } from "react-router-dom";

export const Header = () => {
    return (
        <div>
            <NavLink to="/">
                <p>Home</p>
            </NavLink>
            <NavLink to="/blackjack">
                <p>BlackJack</p>
            </NavLink>
            <NavLink to="/leaderboard">
                <p>Leaderboard</p>
            </NavLink>
        </div>
    );
};
