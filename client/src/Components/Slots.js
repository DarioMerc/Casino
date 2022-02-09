import React, { useContext, useRef, useState } from 'react'
import styled from 'styled-components'
import { UserContext } from './UserContext'
import './slots.css'

const fruits = ["🍒", "🍉", "🍊", "🍓", "🍇", "🥝"]
let ongoingGame = false;

const Slots = () => {
    const {user, balance, setBalance} = useContext(UserContext)
    const [bet,setBet] = useState(10);
    const [fruit1,setFruit1] = useState();
    const [fruit2,setFruit2] = useState();
    const [fruit3,setFruit3] = useState();
    let slotRef = [useRef(null), useRef(null), useRef(null)];
    const [rolling,setRolling] = useState(false)
    const [result,setResult] = useState("-")

    function roll(){
        setResult("-")
        ongoingGame = true;
        setRolling(true)
        updateBalance("lose",bet)

        let slot1,slot2,slot3 = null;
        slotRef.forEach((slot, i) => {
            const selected = triggerSlotRotation(slot.current);
            if(i+1 == 1){
                slot1 = selected;
            }
            else if(i+1 == 2){
                slot2 = selected;
            }
            else{
                slot3 = selected;
            } 
        });

        setTimeout(() => {
            setRolling(false)
            checkOutcome([slot1,slot2,slot3])
        }, 700)
        
    }

    const triggerSlotRotation = ref => {
        function setTop(top) {
            ref.style.top = `${top}px`;
        }
        let options = ref.children;
        let randomOption = Math.floor(
          Math.random() * fruits.length
        );
        let choosenOption = options[randomOption];
        setTop(-choosenOption.offsetTop + 2);
        return fruits[randomOption];
    };

    //CHECK OUTCOME
    //TURN THIS INTO A FUNCTION INSTEAD THAT CALLS WHEN THE ROLL IS FINISHED
    function checkOutcome(slotsArray){
        console.log("CHECKING OUTCOME")
            // let slotsArray = Object.keys(slots).map((key) => [slots[key]]);
            let counts = {};
            for (const fruit of slotsArray) {
                counts[fruit] = counts[fruit] ? counts[fruit] + 1 : 1;
            }
            slotsArray.forEach(fruit => {
                if(ongoingGame){
                    console.log(counts[fruit]);
                    if(counts[fruit] === 2){
                        updateBalance("win",bet*2)
                        setResult("WIN DOUBLE!")
                        ongoingGame = false;
                    }else if(counts[fruit] === 3){
                        updateBalance("win",bet*3)
                        setResult("WIN TRIPLE")
                        ongoingGame = false;
                    }
                }
            });
    }

    function updateBalance(outcome,amount){
        fetch(`/api/${user._id}/balance`, {
            method: "PUT",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({
                bet: amount,
                outcome,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data)
            });
    }

    return (
        <Container>
            <h1>Slots</h1>
            <p>{result}</p>
            <SlotContainer>
                <Slot2>
                    <SlotSection>
                        <CContainer ref={slotRef[0]}>
                            {fruits.map((fruit,i)=>(
                                <div key={i}>
                                    <span>{fruit}</span>
                                </div>
                            ))}
                        </CContainer>    
                    </SlotSection>
                </Slot2>
                <Slot2>
                    <SlotSection>    
                        <CContainer ref={slotRef[1]}>
                            {fruits.map((fruit,i)=>(
                                <div key={i}>
                                    <span>{fruit}</span>
                                </div>
                            ))}
                        </CContainer>
                    </SlotSection>
                </Slot2>
                <Slot2>
                    <SlotSection>    
                        <CContainer ref={slotRef[2]}>
                            {fruits.map((fruit,i)=>(
                                <div key={i}>
                                    <span>{fruit}</span>
                                </div>
                            ))}
                        </CContainer>
                    </SlotSection>
                </Slot2>
            </SlotContainer>
            <BetContainer>
                <span>
                    <p>Bet:</p>
                    <input value={bet}
                    onChange={(e) => {
                        setBet(e.target.value);
                    }}
                    disabled={rolling}></input>
                </span>
                <button disabled={rolling} onClick={() => roll()}>Spin</button>
            </BetContainer>
        </Container>
    )
}

const Container = styled.div`
    display: flex;
    flex-direction: column;
    margin: auto;
    align-items: center;
    border: 3px solid black;
    margin: 20px;
    padding: 20px;
    border-radius:15px;
`
const SlotContainer = styled.div`
    display: flex;
    flex-direction: row;
`
const SlotSection = styled.section`
    position: absolute;
    border-radius: 15px !important;
    border: 3px solid black !important;
    width: 70px;
    height: 70px;
    overflow: hidden;
    background-color: grey;
    border-radius: 2px;
    border: 1px solid lightgrey;
    color: white;
    font-family: sans-serif;
    text-align: center;
    font-size: 25px;
    line-height: 60px;
    cursor: default;
`
const Slot2 = styled.div`
    position: relative;
    display: inline-block;
    min-height: 100px;
    min-width: 80px;
`
const CContainer = styled.div`
    position: absolute;
    top: 2px;
    height: 100px;
    width: 100%;
    transition: top ease-in-out 0.7s;
    text-align: center;
`
const BetContainer = styled.div`
    display: flex;
    flex-direction: column;
`
export default Slots