import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import flippedCard from "./flipped-card.png";
import GlobalStyle, { themeVars } from "../GlobalStyle";
import { UserContext } from "./UserContext";

export const Blackjack = () => {
    const {user, balance, setBalance} = useContext(UserContext)
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
            // const deckRes = await fetch(
            //     `/api/deck/new`
            // );
            // let deckData = await deckRes.json();
            // setDeck(deckData.deck)
        }
        fetchData();
    }, []);

    function getRandomCard(deck) {
        const updatedDeck = deck;
        const randomIndex = Math.floor(Math.random() * updatedDeck.length);
        const randomCard = updatedDeck[randomIndex];
        updatedDeck.splice(randomIndex, 1);
        return { randomCard, updatedDeck };
      }

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
        if (deck.length < 52) {
            setDeck(shuffleDeck(deck.concat(playerHand, dealerHand)));
        }
        setOngoingGame(true);
        setDealersTurn(false);
        setBalance(balance - bet);
        updateBalance("bet")
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

        if (handName === "DEALER" && dealersTurn && sum < 17 && playerTotal <= 21) {
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
                console.log("PLAYER BUSTED")
                setResult("PLAYER BUSTED");
                ongoingGame && updateBalance("loss")
                setOngoingGame(false);
            }
            //COMPARE HAND WITH DEALERS
            if (dealerTotal >= 17) {
                if (playerTotal === dealerTotal) {
                    setResult("PUSH");
                    setOngoingGame(false);
                } else if (dealerTotal > 21) {
                    console.log("PLAYER WINS")
                    setResult("DEALER BUSTED");
                    ongoingGame && updateBalance("win")
                    setOngoingGame(false);
                } else if (dealerTotal > playerTotal) {
                    console.log("DEALER WINS")
                    setResult("DEALER WINS");
                    ongoingGame && updateBalance("loss")
                    setOngoingGame(false);
                } else if (playerTotal > dealerTotal && playerTotal <= 21) {
                    console.log("PLAYER WINS")
                    setResult("PLAYER WINS");
                    ongoingGame && updateBalance("win");
                    setOngoingGame(false);
                }
            }
        }
    });
    //Update Balance
    function updateBalance(outcome){
        fetch(`/api/${user._id}/balance`, {
            method: "PUT",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({
                bet:bet,
                outcome,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data)
            });
    }
    
    return (
        <>
            <Container>
                <h1 className="automargin">BlackJack</h1>
                <p className="automargin">{result}</p>
                <hr />
                {!deck ? (
                    <p className="automargin">loading</p>
                ) : (
                    <>
                        <h2 className="automargin">Dealers Hand ({dealerTotal})</h2>
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
                        <h2 className="automargin">Your Hand ({playerTotal})</h2>
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
                <Option
                    disabled={dealersTurn || !ongoingGame}
                    onClick={() => stand()}
                >
                    Stand
                </Option>
                </OptionsContainer>
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
    align-items: center;
    position: relative;
`
const Option = styled.button`
    width: 15%;
    height: 100%;
    position: relative;
`

const BettingContainer = styled.div`
display: flex;
flex-direction: column;
    margin: 5px 0px;
`