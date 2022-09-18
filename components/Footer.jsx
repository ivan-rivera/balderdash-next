/**
 * Footer
 */

import { useState } from 'react';
import {ActionIcon, Anchor} from "@mantine/core";
import {IconBrandGithub} from "@tabler/icons";
import { createStyles } from '@mantine/core';
import Link from 'next/link'
import AboutModal from "./AboutModal";
import RulesModal from "./RulesModal";

const useStyles = createStyles((theme, _params, getRef) => ({
    footer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        justifyItems: 'center',
        marginBottom: '5px',
        paddingTop: '10px',
        borderTop: `1px solid ${theme.colors.dark[5]}`,
    },
    refs: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        justifyItems: 'center',
    },
    item: {
        fontSize: '1.25rem',
        marginLeft: '10px',
        marginRight: '10px',
    },
    gh: {
        marginTop: '10px',
        marginLeft: 'auto',
        marginRight: 'auto',
    }
}));


export default function Footer() {
    const [aboutOpened, setAboutOpened] = useState(false);
    const [rulesOpened, setRulesOpened] = useState(false);
    const { classes } = useStyles();
    return (
        <>
            <AboutModal opened={aboutOpened} setOpened={setAboutOpened}/>
            <RulesModal opened={rulesOpened} setOpened={setRulesOpened}/>
            <footer className={classes.footer}>
                <div className={classes.refs}>
                    <Anchor
                        component="a"
                        color='dimmed'
                        key='about'
                        onClick={() => setAboutOpened(true)}
                        className={classes.item}
                    >
                        About
                    </Anchor>
                    <Anchor
                        component="a"
                        color='dimmed'
                        key='about'
                        onClick={() => setRulesOpened(true)}
                        className={classes.item}
                    >
                        Rules
                    </Anchor>
                </div>
                <ActionIcon className={classes.gh} size='lg' variant='default' radius='xl'>
                    {/* TODO: redirect to my GH page */}
                    <Link href="https://github.com">
                        <IconBrandGithub />
                    </Link>
                </ActionIcon>
            </footer>
        </>
    )
}