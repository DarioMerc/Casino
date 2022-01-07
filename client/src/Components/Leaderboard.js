import React, { useState,useEffect } from 'react'
import styled from 'styled-components';

export const Leaderboard = () => {
    const [leaderboard,setLeaderboard] = useState();
    const [LState,setLState] = useState("loading")
    useEffect(() => {
        async function fetchData() {
            const leaderboardRes = await fetch(
                `/api/leaderboard`
            );
            let leaderboard = await leaderboardRes.json();
            setLeaderboard(leaderboard.data);
            setLState("idle");
        }
        fetchData();
    }, [])
    return (
        <Wrapper>
            {LState === "idle" && (
            <>
            {leaderboard.map((user,k)=>{
                return <p>{user.username}: {user.balance}</p>
            })}
            </>
            )}
        </Wrapper>
    )
}

const Wrapper = styled.div`
    margin: auto;
    display: flex;
    flex-direction: column;
`