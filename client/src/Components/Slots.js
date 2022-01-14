import React from 'react'
import styled from 'styled-components'

const fruits = ["🍒", "🍉", "🍊", "🍓", "🍇", "🥝"]

const Slots = () => {
    //MAKE THIS AN OBJECT WITH 3 SLOTS
    const [slots,setSlots] = setState()
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
        console.log(slot1,slot2,slot3)
        // setState({slot1: slot1, slot2:slot2, slot3:slot3, rolling: true});
        setTimeout(() => {
            //SHOW SLOTS TO PLAYER
            // this.setState({ rolling: false });
        }, 700)
    }

    return (
        <Container>
            <h1>Slots</h1>
            <p>-</p>
            <SlotContainer>
                <Slot>1</Slot>
                <Slot>2</Slot>
                <Slot>3</Slot>
            </SlotContainer>
            <BetContainer>
                <span>
                    <p>Bet:</p><input value={10}></input>
                </span>
                <button onClick={() => roll()}>Spin</button>
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
    padding:50px;
`
const BetContainer = styled.div`
    display: flex;
    flex-direction: column;
`
export default Slots