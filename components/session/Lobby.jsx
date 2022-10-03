import {Card, List, ThemeIcon, Title, Text} from "@mantine/core";
import {IconCircleCheck} from "@tabler/icons";
import SelectionButton from "../buttons/SelectionButton";
import {MIN_PLAYERS} from "../../lib/constants";
import cookieCutter from 'cookie-cutter'
import {startSession} from "../../lib/firebase";

const cardStyle = {
    maxWidth: '350px',
    marginLeft: 'auto',
    marginRight: 'auto',
    textAlign: 'left',
}

const cardTitleStyle = {
    textAlign: 'center',
    paddingBottom: '20px',
    marginBottom: '20px',
    borderBottom: "1px solid grey",
}

const listStyle = {
    marginLeft: 'auto',
    marginRight: 'auto',
}

async function handleSessionStart(sessionId) {
    await startSession(sessionId)
}

function JoinedIcon() {
    return (
        <ThemeIcon color="teal" size={24} radius="xl">
            <IconCircleCheck size={16} />
        </ThemeIcon>
    )
}

function UserList(props) {
    return (
        props.players.length === 0 ?
            <Title size="h2">No players yet</Title> :
            <List spacing="xs" style={listStyle} icon={<JoinedIcon/>}>
                {props.players.map(p => <List.Item key={p}>{p}</List.Item>)}
            </List>
    )
}

function PlayButton(sessionId, playable) {
    return (
        <>
            <SelectionButton content="Launch" disabled={!playable} onClick={() => handleSessionStart(sessionId)}/>
            {
                !playable &&
                <p style={{textAlign: 'center', color: 'red'}}>You need at least {MIN_PLAYERS} players to start</p>
            }
        </>
    )
}

function WaitForStart() {
    return (
        <Text style={{textAlign: 'center', fontStyle: 'italic', borderTop: '1px solid grey', paddingTop: '15px'}}>
            Waiting for the host to start the game
        </Text>
    )
}

export default function Lobby(props) {
    return (
        <>
            <Title size="h1" style={{paddingTop: '20px', paddingBottom: '20px'}}>New Game</Title>
            <p>Invite your friends to join the game via session ID: <strong>{props.sessionId}</strong></p>
            <p>New joiners will appear in the below list</p>
            <br/>
            <Card shadow="lg" radius="md" withBorder style={cardStyle}>
                <Title size="h2" style={cardTitleStyle}>Players</Title>
                <UserList players={props.players}/>
                <br/>
                {
                    cookieCutter.get('username') === props.creator ?
                        PlayButton(props.sessionId, props.players.length >= MIN_PLAYERS) :
                        WaitForStart()
                }
            </Card>
        </>
    )
}