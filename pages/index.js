import Head from 'next/head'
import { Text, Paper } from '@mantine/core';
import SessionModal from "../components/modals/SessionModal";
import SelectionButton from "../components/buttons/SelectionButton";
import {useState} from "react";

export default function Home() {
    const [createOpened, setCreateOpened] = useState(false);
    const [joinOpened, setJoinOpened] = useState(false);
    return (
        <div>
            <Head>
                <title>Balderdash</title>
                <meta name="description" content="Balderdash the game" />
                <meta name="keywords" content="balderdash"/>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main>
                <div>
                    <h2 style={{fontWeight: 'bold'}}>Balderdash • /ˈbɔːldədaʃ/</h2>
                    <h4 style={{fontStyle: 'italic'}}>senseless talk or writing; nonsense</h4>
                </div>
                <div style={{display: 'flex', flexDirection: 'column'}}>
                    <h1>Menu</h1>
                    <SelectionButton content="New Round" onClick={() => setCreateOpened(true)}/>
                    <SelectionButton content="Join Round" onClick={() => setJoinOpened(true)}/>
                </div>
                <br/>
                <br/>
                <Paper
                    style={{padding: '10px 10px', maxWidth: '500px', margin: 'auto auto'}}
                    shadow="xxl"
                    radius="lg"
                    p="s"
                    withBorder
                >
                    <Text size="md">
                        Balderdash is a bluffing game where you need to either guess the definition of an obscure word
                        or come up with a convincing definition of one. This game is ideal for a group of 4-8 people!
                    </Text>
                </Paper>
                <SessionModal title="Create New Round" opened={createOpened} setOpened={setCreateOpened}/>
                <SessionModal title="Join Round" join={true} opened={joinOpened} setOpened={setJoinOpened}/>
            </main>
        </div>
    )
}
