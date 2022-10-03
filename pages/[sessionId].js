/**
 * TODO:
 *  - Refactor syncing logic to use a single call
 *  - Add scoreboard modal to the game in progress
 *  - Split into sub components that will change based on state; support states:
 *      - waiting for players to join
 *      - dasher waiting for input
 *      - guessers guessing
 *      - guessers waiting for others
 *      - dasher judging
 *      - guessers voting
 *      - round results
 *      - final results
 */

import {Title} from "@mantine/core";
import {useRouter} from 'next/router'
import Lobby from "../components/session/Lobby";
import Round from "../components/session/Round";
import {useEffect, useState} from "react";
import Error from "../components/errors/Error";
import {
    getSessionCreator,
    getSessionRoundCount,
    syncDasher, syncRoundNumber,
    syncRoundState,
    syncSessionPlayers,
    syncSessionState
} from "../lib/firebase";
import {GAME_STATES} from "../lib/constants";


const scenarioHandler = (sessionState, roundState, roundNumber, totalRounds, sessionId, players, creator, dasher) => {
    switch (sessionState) {
        case GAME_STATES.LOADING: return <Title style={{marginTop: '200px', marginBottom: '200px'}}>Loading...</Title>
        case GAME_STATES.INITIATED: return <Lobby sessionId={sessionId} players={players} creator={creator}/>
        case GAME_STATES.STARTED: return <Round state={roundState} dasher={dasher} roundNumber={roundNumber} totalRounds={totalRounds}/>
        case GAME_STATES.FINISHED: return <div>Game finished</div> // TODO: add logic
        case GAME_STATES.INVALID: return <Error message="The session code is invalid!"/>
        case GAME_STATES.ERROR: return <Error message="An unknown error has occurred"/>
        default: return <Error message="The state of the game could not be determined..."/>
    }
}


export default function SessionId() {
    const router = useRouter()
    const { sessionId } = router.query
    const [ players, setPlayers ] = useState([])
    const [ creator, setCreator ] = useState(null)
    const [ totalRounds, setTotalRounds ] = useState(0)
    const [ roundNumber, setRoundNumber ] = useState(0)
    const [ dasher, setDasher ] = useState(null)
    const [ roundState, setRoundState ] = useState(null)
    const [ sessionState, setSessionState ] = useState(GAME_STATES.LOADING)
    useEffect(() => {
        if(!sessionId) return
        syncSessionPlayers(sessionId, setPlayers)
        syncSessionState(sessionId, setSessionState)
        syncRoundState(sessionId, setRoundState)
        syncRoundNumber(sessionId, setRoundNumber)
        syncDasher(sessionId, setDasher)
        getSessionCreator(sessionId).then(setCreator)
        getSessionRoundCount(sessionId).then(setTotalRounds)
    }, [sessionId])
    return scenarioHandler(sessionState, roundState, roundNumber, totalRounds, sessionId, players, creator, dasher)
}
