import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";
import { UserContext } from "./UserContext";

export const Header = () => {
    const {user,balance} = useContext(UserContext)

    const handleLogout = () => {
        if (window.confirm("Confirm Logout?")) {
            localStorage.removeItem("user");
            window.location.replace("/");
        }
    };

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
            <span style={{width:"100%"}}></span>
            <Item onClick={handleLogout}>{user.username}</Item>
            <Item>Balance: {balance}</Item>
        </Wrapper>
    );
};

const Wrapper = styled.div`
    display: flex;
    flex-direction: horizontal;
    border: 1px solid black;
    width: 80%;
    margin: auto;
    align-items: center;
`;

const NavItem = styled(NavLink)`
margin: 5px;
`

const Item = styled.p`
    margin: 5px;
`
