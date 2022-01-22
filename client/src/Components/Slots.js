import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import { UserContext } from './UserContext'

const fruits = ["🍒", "🍉", "🍊", "🍓", "🍇", "🥝"]

const Slots = () => {
    const {user, balance, setBalance} = useContext(UserContext)
    const [bet,setBet] = useState(10);
    const [slots,setSlots] = useState({slot1:"",slot2:"",slot3:""})
    const [rolling,setRolling] = useState(null)

    const [result,setResult] = useState("-")

    function roll(){
        setResult("-")
        const slot1 = fruits[
            Math.floor(Math.random() * fruits.length)
        ];
        const slot2 = fruits[    
            Math.floor(Math.random() * fruits.length)
        ];

        const slot3 = fruits[    
            Math.floor(Math.random() * fruits.length)
        ];

        updateBalance("lose",bet)

        //SET SLOTS
        setRolling(true)
        setTimeout(() => {
            //SHOW SLOTS TO PLAYER
            setSlots({slot1: slot1, slot2:slot2, slot3:slot3});
            setRolling(false)
        }, 700)
    }

    //CHECK OUTCOME
    //TURN THIS INTO A FUNCTION INSTEAD THAT CALLS WHEN THE ROLL IS FINISHED
    useEffect(() => {
        if(!rolling && slots.slot1 !== ''){
            console.log("CHECKING OUTCOME")
            let slotsArray = Object.keys(slots).map((key) => [slots[key]]);
            let counts = {};
                for (const fruit of slotsArray) {
                    counts[fruit] = counts[fruit] ? counts[fruit] + 1 : 1;
                }

            slotsArray.forEach(fruit => {
                console.log(counts[fruit]);
                if(result === "-"){
                    if(counts[fruit] == 2){
                        updateBalance("win",bet*2)
                        setResult("WIN DOUBLE!")
                    }else if(counts[fruit] == 3){
                        updateBalance("win",bet*3)
                        setResult("WIN TRIPLE")
                    }
                }
            });
        }
    })

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
                <Slot>{slots.slot1}</Slot>
                <Slot>{slots.slot2}</Slot>
                <Slot>{slots.slot3}</Slot>
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
`
const SlotContainer = styled.div`
    display: flex;
    flex-direction: row;
`
const Slot = styled.div`
    border: 1px solid black;
    margin: 10px;
    font-size: 75px;
    min-height: 100px;
    min-width: 100px;
`
const BetContainer = styled.div`
    display: flex;
    flex-direction: column;
`
export default Slots