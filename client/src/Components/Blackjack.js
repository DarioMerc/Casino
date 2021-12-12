import React, { useEffect, useState } from "react";
import styled from "styled-components";

//player makes bet
//round starts
//cards are dealt
//disable betting
//hit or stand
//did player win or lose?
//reset

export const Blackjack = () => {
    const [balance, setbalance] = useState(1000);
    const [bet, setBet] = useState(100);
    const [playerHand, setPlayerHand] = useState([]);
    const [dealerHand, setDealerHand] = useState([]);
    const [deck, setDeck] = useState();

    //Create Deck
    useEffect(() => {
        fetch(`https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=6`)
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                setDeck(data);
            });
    }, []);

    //Deal Cards
    function dealCards() {
        console.log("DEAL");
        fetch(
            `https://deckofcardsapi.com/api/deck/${deck.deck_id}/draw/?count=4`
        )
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                setPlayerHand(data.cards.slice(0, 2));
                setDealerHand(data.cards.slice(2, 4));
            });
    }

    return (
        <>
            {!deck ? (
                <p>loading</p>
            ) : (
                <div>
                    <h1>BlackJack</h1>
                    <hr />
                    <h2>Dealers Hand</h2>
                    {dealerHand.map((card, k) => {
                        return <Card src={card.image} />;
                    })}
                    <hr />
                    <h2>Your Hand</h2>
                    {playerHand.map((card, k) => {
                        return <Card src={card.image} />;
                    })}
                    <hr />
                    <p>Your Balance: {balance}</p>
                    <input
                        value={bet}
                        onChange={(e) => {
                            setBet(e.target.value);
                        }}
                    />
                    <button disabled={!bet} onClick={() => dealCards()}>
                        Bet
                    </button>
                    <hr />
                    <button>Hit</button>
                    <button>Stand</button>
                </div>
            )}
        </>
    );
};

const Card = styled.img`
    width: 10%;
    height: auto;
    margin: 5px;
`;
