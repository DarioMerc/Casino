import React, { useState } from "react";

//player makes bet
//round starts
//cards are dealt
//hit or stand
//did player win or lose?
//reset

export const Blackjack = () => {
    const [balance, setbalance] = useState(1000);
    const [bet, setBet] = useState(100);
    return (
        <div>
            <p>Your Balance: {balance}</p>
            <h1>BlackJack</h1>
            <hr />
            <h2>Dealers Hand</h2>
            <hr />
            <h2>Your Hand</h2>
            <hr />
            <p>Your Balance: </p>
            <input
                value={bet}
                onChange={(e) => {
                    setBet(e.target.value);
                }}
            />
            <button disabled={!bet}>Bet</button>
            <hr />
            <button>Hit</button>
            <button>Stand</button>
        </div>
    );
};
