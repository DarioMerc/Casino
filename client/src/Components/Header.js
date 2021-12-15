import React from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";

export const Header = () => {
    return (
        <Wrapper>
            <NavLink to="/">
                <p>Home</p>
            </NavLink>
            <NavLink to="/blackjack">
                <p>BlackJack</p>
            </NavLink>
            <NavLink to="/leaderboard">
                <p>Leaderboard</p>
            </NavLink>
        </Wrapper>
    );
};

const Wrapper = styled.div`
    display: flex;
    flex-direction: horizontal;
    border: 1px solid black;
    width: 80%;
    margin: auto;
`;
