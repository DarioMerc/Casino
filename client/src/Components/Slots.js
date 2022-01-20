import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

const fruits = ["🍒", "🍉", "🍊", "🍓", "🍇", "🥝"]

const Slots = () => {
    const [slots,setSlots] = useState({slot1:"",slot2:"",slot3:""})
    const [rolling,setRolling] = useState(null)

    function roll(){
        console.log("ROLLING")
        const slot1 = fruits[
            Math.floor(Math.random() * fruits.length)
        ];
        const slot2 = fruits[    
            Math.floor(Math.random() * fruits.length)
        ];

        const slot3 = fruits[    
            Math.floor(Math.random() * fruits.length)
        ];
        //SET SLOTS
        setRolling(true)
        setTimeout(() => {
            //SHOW SLOTS TO PLAYER
            setSlots({slot1: slot1, slot2:slot2, slot3:slot3});
            setRolling(false)
        }, 700)
    }

    useEffect(() => {
        if(!rolling && slots.slot1 !== ''){
            console.log("CHECKING OUTCOME")
            let slotsArray = Object.keys(slots).map((key) => [slots[key]]);
            let counts = {};
                for (const fruit of slotsArray) {
                    counts[fruit] = counts[fruit] ? counts[fruit] + 1 : 1;
                }

            fruits.forEach(fruit => {
                if(counts[fruit] == 2){
                    console.log("WIN DOUBLE!")
                }else if(counts[fruit] == 3){
                    console.log("WIN TRIPLE")
                }
            });
        }
    })
    return (
        <Container>
            <h1>Slots</h1>
            <p>-</p>
            <SlotContainer>
                <Slot>{slots.slot1}</Slot>
                <Slot>{slots.slot2}</Slot>
                <Slot>{slots.slot3}</Slot>
            </SlotContainer>
            <BetContainer>
                <span>
                    <p>Bet:</p><input disabled={rolling} value={10}></input>
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