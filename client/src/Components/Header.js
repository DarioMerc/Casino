import React from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";

export const Header = () => {
    return (
        <Wrapper>
            <NavItem to="/">
                <p>Home</p>
            </NavItem>
            <NavItem to="/blackjack">
                <p>BlackJack</p>
            </NavItem>
            <NavItem to="/leaderboard">
                <p>Leaderboard</p>
            </NavItem>
            <p>Balance: </p>
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

const NavItem = styled(NavLink)`
margin: 5px;
`
