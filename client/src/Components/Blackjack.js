import React, { useEffect, useState } from "react";
import styled from "styled-components";
import flippedCard from "./flipped-card.png";
import GlobalStyle, { themeVars } from "../GlobalStyle";

export const Blackjack = () => {
    const [balance, setBalance] = useState(1000);
    const [bet, setBet] = useState(100);

    const [playerHand, setPlayerHand] = useState([]);
    const [playerTotal, setPlayerTotal] = useState(0);
    const [dealerHand, setDealerHand] = useState([]);
    const [dealerTotal, setDealerTotal] = useState(0);

    const [deck, setDeck] = useState();

    const [dealersTurn, setDealersTurn] = useState(false);
    const [ongoingGame, setOngoingGame] = useState(false);
    const [result, setResult] = useState("-");
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

    function shuffleDeck(array) {
        setDeck();
        let currentIndex = array.length,
            randomIndex;
        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex],
                array[currentIndex],
            ];
        }
        return array
    }
    //Deal Cards
    function dealCards() {
        setResult("-");
        let shuffDeck = []
        if (deck.length < 52) {
            setDeck(shuffleDeck(deck.concat(playerHand, dealerHand)));
        }
        setOngoingGame(true);
        setDealersTurn(false);
        setBalance(balance - bet);
        setPlayerHand(deck.splice(0, 2));
        setDealerHand(deck.splice(0, 2));
    }

    //CALCULATE HANDS
    useEffect(() => {
        calculateHand("PLAYER", playerHand);
        calculateHand("DEALER", dealerHand);
    });

    function calculateHand(handName, hand) {
        let sum = 0;
        hand.map((card, k) => {
            //This condition makes sure that the dealers 2nd card doesnt get calculated into the total before their turn
            if (!(handName === "DEALER" && !dealersTurn && k === 1)) {
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

        if (dealersTurn && sum < 17 && playerTotal <= 21) {
            hit("DEALER");
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
        //Dont check for any endgame outcome before dealer has done their turn
        if (dealersTurn) {
            //CHECK IF PLAYER BUSTED (The only ending that can occur before Dealer flips their cards)
            if (playerTotal > 21) {
                setResult("PLAYER BUSTED");
                setOngoingGame(false);
            }
            //COMPARE HAND WITH DEALERS
            if (dealerTotal >= 17) {
                if (playerTotal === dealerTotal) {
                    setResult("PUSH");
                    ongoingGame && setBalance(parseInt(balance + bet));
                    setOngoingGame(false);
                } else if (dealerTotal > 21) {
                    setResult("DEALER BUSTED");
                    ongoingGame && setBalance(balance + bet * 2);
                    setOngoingGame(false);
                } else if (dealerTotal > playerTotal) {
                    setResult("DEALER WINS");
                    setOngoingGame(false);
                } else if (playerTotal > dealerTotal) {
                    setResult("PLAYER WINS");
                    ongoingGame && setBalance(balance + bet * 2);
                    setOngoingGame(false);
                }
            }
        }
    });

    return (
        <>
            <Container>
                <h1 class="automargin">BlackJack</h1>
                <p class="automargin">{result}</p>
                <hr />
                {!deck ? (
                    <p class="automargin">loading</p>
                ) : (
                    <>
                        <h2 class="automargin">Dealers Hand ({dealerTotal})</h2>
                        <CardWrapper>

                        {dealerHand.map((card, k) => {
                            if (!dealersTurn && k === 1) {
                                return <Card src={flippedCard} />;
                            } else {
                                return <Card src={card.image} />;
                            }
                        })}
                        </CardWrapper>
                        <hr />
                        <h2 class="automargin">Your Hand ({playerTotal})</h2>
                        <CardWrapper>
                        {playerHand.map((card, k) => {
                            return <Card src={card.image} />;
                        })}
                        </CardWrapper>
                    </>
                )}
                <hr />
                <OptionsContainer>
                <Option
                    disabled={dealersTurn || !ongoingGame}
                    onClick={() => hit("PLAYER")}
                >
                    Hit
                </Option>
                <Option
                    disabled={dealersTurn || !ongoingGame}
                    onClick={() => stand()}
                >
                    Stand
                </Option>
                </OptionsContainer>
                <BettingContainer>
                <input
                    value={bet}
                    onChange={(e) => {
                        setBet(e.target.value);
                    }}
                    disabled={ongoingGame}
                    />
                <button
                    disabled={!bet || bet > balance || ongoingGame}
                    onClick={() => dealCards()}
                    >
                    Bet
                </button>
                </BettingContainer>
                    <p>Your Balance: {balance}</p>
            </Container>
        </>
    );
};
const Container = styled.div`
    width: 80%;
    height: 100%;
    margin: auto;
    margin-top: 5px;
    border: 1px solid black;
    display: flex;
    flex-direction: column;
`;
const Card = styled.img`
    width: 10%;
    height: auto;
    margin: 5px;
`;
const CardWrapper = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
`
const OptionsContainer = styled.div`
    display: flex;
    justify-content: space-evenly;
`
const Option = styled.button`
    width: 15%;
    height: 30px;
    margin: 5px;
`

const BettingContainer = styled.div`
display: flex;
flex-direction: column;
    margin: 5px auto;
`