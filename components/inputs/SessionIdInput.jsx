import {TextInput} from "@mantine/core";

export default function SessionIdInput(props) {
    return (
        <TextInput
            mt="xl"
            id="join-session"
            label="Enter session ID"
            placeholder="ABCDE123"
            {...props.form.getInputProps('sessionId')}
        />
    )
}