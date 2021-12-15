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

    const [dealersTurn, setDealersTurn] = useState(false);
    const [roundStarted, setRoundStarted] = useState(false);
    const [result, setResult] = useState();
    const [gameover, setGameover] = useState(false);
    //Create Deck
    useEffect(() => {
        async function fetchData() {
            const deckIdRes = await fetch(
                `https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1`
            );
            let deckIdData = await deckIdRes.json();
            const deckRes = await fetch(
                `https://deckofcardsapi.com/api/deck/${deckIdData.deck_id}/draw/?count=52`
            );
            let deckData = await deckRes.json();
            setDeck(deckData.cards);
        }
        fetchData();
    }, []);

    //Deal Cards
    function dealCards() {
        setRoundStarted(true);
        setDealersTurn(false);
        setBalance(balance - bet);
        setPlayerHand(deck.splice(0, 2));
        setDealerHand(deck.splice(0, 2));
    }

    //CALCULATE HANDS
    useEffect(() => {
        calculateHand("PLAYER", playerHand);
        calculateHand("DEALER", dealerHand);
    }, [playerHand, dealerHand, dealersTurn]);
    function calculateHand(handName, hand) {
        let sum = 0;
        hand.map((card, k) => {
            if (handName === "DEALER" && !dealersTurn && k == 1) {
            } else {
                if (card.value === "ACE") {
                    sum += 11;
                } else if (
                    card.value === "JACK" ||
                    card.value === "QUEEN" ||
                    card.value === "KING"
                ) {
                    sum += 10;
                } else {
                    sum += parseInt(card.value);
                }
            }
        });

        //CHECK FOR ACE AND BUST
        if (hand.some((card) => card.value === "ACE") && sum > 21) {
            sum -= 10;
        }

        //AUTO-STAND IF BLACKJACK OR BUST
        if (handName === "PLAYER" && sum >= 21) {
            stand();
        }

        handName === "PLAYER" ? setPlayerTotal(sum) : setDealerTotal(sum);
    }

    //Hit
    function hit(handName) {
        if (handName === "PLAYER") {
            console.log("PLAYER HIT");
            setPlayerHand(playerHand.concat(deck.shift()));
        } else {
            console.log("DEALER HIT");
            setDealerHand(dealerHand.concat(deck.shift()));
        }
    }
    //Stand
    function stand() {
        setDealersTurn(true);
    }
    //Endgame
    useEffect(() => {
        //FIX ALL OF THIS AAAAAAAAAAAAAAAAAAA
        console.log("ENDGAME CHECK");
        if (dealerTotal < 17 && dealersTurn && playerTotal < 21) {
            hit("DEALER");
        }

        if (playerTotal == dealerTotal) {
            setResult("PUSH");
            setRoundStarted(false);
        } else if (playerTotal > 21) {
            setResult("PLAYER BUSTED");
            setRoundStarted(false);
        } else if (dealerTotal > playerTotal) {
            setResult("DEALER WINS");
            setRoundStarted(false);
        } else if (dealerTotal > 21 || playerTotal > dealerTotal) {
            setResult("PLAYER WINS");
            setRoundStarted(false);
            setBalance(balance + bet * 2);
        }
    }, [dealersTurn]);

    return (
        <>
            {!deck ? (
                <p>loading</p>
            ) : (
                <Container>
                    <h1>BlackJack</h1>
                    <p>Result: {result}</p>
                    <hr />
                    <h2>Dealers Hand ({dealerTotal})</h2>
                    {dealerHand.map((card, k) => {
                        if (!dealersTurn && k == 1) {
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
                    <button
                        disabled={dealersTurn || !roundStarted}
                        onClick={() => hit("PLAYER")}
                    >
                        Hit
                    </button>
                    <button
                        disabled={dealersTurn || !roundStarted}
                        onClick={() => stand()}
                    >
                        Stand
                    </button>
                </Container>
            )}
        </>
    );
};
const Container = styled.div`
    width: 80%;
    height: auto;
    margin: 5px auto;
    border: 1px solid black;
`;
const Card = styled.img`
    width: 8%;
    height: auto;
    margin: 5px;
`;
