import React, { useState,useEffect } from 'react'

export const Leaderboard = () => {
    const [leaderboard,setLeaderboard] = useState();
    useEffect(() => {
        async function fetchData() {
            const leaderboardRes = await fetch(
                `/api/leaderboard`
            );
            let leaderboard = await leaderboardRes.json();
            setLeaderboard(leaderboard.data);
        }
        fetchData();
    }, [])
    return (
        <div>
            {leaderboard && leaderboard.map((user)=>{
                <h3>{user.username}</h3>
            })}
        </div>
    )
}
