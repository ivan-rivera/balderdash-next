/**
 * Session creation screen
 * TODO:
 *  - Distinguish between creation and joining submissions
 *  - If the user is joining an existing session, we must check that the session exists
 *  - If the user is joining an existing session we must check that their username is not already taken
 */

import {Modal, TextInput, Button} from "@mantine/core";
import { useForm } from '@mantine/form';


export default function SessionModal(props) {

    const form = useForm({
        initialValues: {username: '', sessionId: ''},
        validate: {
            username: (value) => (/^[a-zA-Z0-9_.-]*$/).test(value) ? null : 'Use only letters numbers and dashes',
            sessionId: (value) => (/^[A-Z0-9]*$/).test(value) ? null : 'Only numbers and uppercase letters are allowed',
        }
    })

    return (
        <Modal
            opened={props.opened}
            onClose={() => props.setOpened(false)}
            title={props.title}
        >
            <form onSubmit={form.onSubmit(() => console.log)}>
                <TextInput
                    id="create-session-username"
                    label="Choose your username"
                    placeholder="Username"
                    {...form.getInputProps('username')}
                />
                {
                    props.join &&
                    <TextInput
                        id="join-session"
                        label="Enter session ID"
                        placeholder="ABCDE12"
                        {...form.getInputProps('sessionId')}
                    />
                }
                <Button
                    type="submit"
                    color="red"
                    style={{
                        margin: '20px auto 10px auto',
                        width: '100%',
                    }}>
                    Go!
                </Button>
            </form>
        </Modal>
    )

}