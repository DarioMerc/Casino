import React from 'react'
import styled from 'styled-components'

const Slots = () => {
    return (
        <Container>
            <h1>Slots</h1>
            <SlotContainer>
                <Slot>1</Slot>
                <Slot>2</Slot>
                <Slot>3</Slot>
            </SlotContainer>
            <BetContainer>
            <p>Bet:</p>
            <input value={10}></input>
            <button>Spin</button>
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
    flex-direction: row;
`
export default Slots