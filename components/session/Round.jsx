// TODO: add scoreboard
// TODO: display round number + how many are left to go

import {ROUND_STATES} from "../../lib/constants";
import {Menu, Button, Title} from "@mantine/core";
import DasherState from "./DahserState";

const scenarioHandler = (state, dasher) => {
    switch(state) {
        case ROUND_STATES.DASHER: return <DasherState dasher={dasher}/>
        case ROUND_STATES.GUESSING: return <div>Guessing</div>
        case ROUND_STATES.JUDGING: return <div>Judging</div>
        case ROUND_STATES.VOTING: return <div>Voting</div>
        case ROUND_STATES.RESULTS: return <div>Results</div>
        default: return <Title style={{marginTop: '200px', marginBottom: '200px'}}>Loading...</Title>
    }
}

function Scoreboard() {
    return (
        <Menu shadow="md" width={300}>
            <Menu.Target><Button>Scoreboard</Button></Menu.Target>
            <Menu.Dropdown>
                <Menu.Label>Scoreboard</Menu.Label>
                <Menu.Item>User1: 10</Menu.Item>
                <Menu.Item>User2: 20</Menu.Item>
                <Menu.Item>User3: 30</Menu.Item>
            </Menu.Dropdown>
        </Menu>
    )
}


export default function Round({state, dasher, roundNumber, totalRounds}) {
    return (
        <>
            {state != null && <Title size="h1">Round {roundNumber} of {totalRounds}</Title>}
            {scenarioHandler(state, dasher)}
            {state != null && <Scoreboard/>}
        </>
    )
}