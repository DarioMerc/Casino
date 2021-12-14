import React, { useEffect, useState } from "react";
import styled from "styled-components";
import flippedCard from "./flipped-card.png";
//player makes bet
//round starts
//cards are dealt
//disable betting
//hit or stand
//did player win or lose?
//reset

export const Blackjack = () => {
    const [balance, setBalance] = useState(1000);
    const [bet, setBet] = useState(100);

    const [playerHand, setPlayerHand] = useState([]);
    const [playerTotal, setPlayerTotal] = useState(0);
    const [dealerHand, setDealerHand] = useState([]);
    const [dealerTotal, setDealerTotal] = useState(0);

    const [deck, setDeck] = useState();

    const [initialDeal, setInitialDeal] = useState(true);
    const [roundStarted, setRoundStarted] = useState(false);

    //Create Deck
    useEffect(() => {
        async function fetchData() {
            const deckRes = await fetch(
                `https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=6`
            );
            let deckData = await deckRes.json();
            setDeck(deckData);
        }
        fetchData();
    }, []);

    //Deal Cards
    function dealCards() {
        setRoundStarted(true);
        setBalance(balance - bet);

        fetch(
            `https://deckofcardsapi.com/api/deck/${deck.deck_id}/draw/?count=4`
        )
            .then((res) => res.json())
            .then((data) => {
                setPlayerHand(data.cards.slice(0, 2));
                setDealerHand(data.cards.slice(2, 4));
            });
    }

    //CALCULATE HANDS
    useEffect(() => {
        calculateHand("PLAYER", playerHand);
        calculateHand("DEALER", dealerHand);
    }, [playerHand, dealerHand]);
    function calculateHand(handName, hand) {
        let sum = 0;
        hand.forEach((card) => {
            if (card.value === "ACE") {
                sum > 21 ? (sum += 1) : (sum += 11);
            } else if (
                card.value === "JACK" ||
                card.value === "QUEEN" ||
                card.value === "KING"
            ) {
                sum += 10;
            } else {
                sum += parseInt(card.value);
            }
        });

        handName === "PLAYER" ? setPlayerTotal(sum) : setDealerTotal(sum);
    }

    //Hit
    function hit() {
        fetch(
            `https://deckofcardsapi.com/api/deck/${deck.deck_id}/draw/?count=1`
        )
            .then((res) => res.json())
            .then((data) => {
                console.log(data.cards[0]);
                let newHand = playerHand.concat(data.cards[0]);
                setPlayerHand(newHand);
            });
    }
    //Stand
    function stand() {
        setInitialDeal(false);
        //dealer tries to beat players hand
        //if higher, win
        //if 21, win
        //if over 21, loss
        //push?
    }
    return (
        <>
            {!deck ? (
                <p>loading</p>
            ) : (
                <div>
                    <h1>BlackJack</h1>
                    <hr />
                    <h2>Dealers Hand ({dealerTotal})</h2>
                    {dealerHand.map((card, k) => {
                        if (initialDeal && k == 1) {
                            return <Card src={flippedCard} />;
                        } else {
                            return <Card src={card.image} />;
                        }
                    })}
                    <hr />
                    <h2>Your Hand ({playerTotal})</h2>
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
                        disabled={roundStarted}
                    />
                    <button
                        disabled={!bet || roundStarted}
                        onClick={() => dealCards()}
                    >
                        Bet
                    </button>
                    <hr />
                    <button onClick={() => hit()}>Hit</button>
                    <button onClick={() => stand()}>Stand</button>
                </div>
            )}
        </>
    );
};

const Card = styled.img`
    width: 8%;
    height: auto;
    margin: 5px;
`;
