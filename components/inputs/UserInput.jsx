import {TextInput} from "@mantine/core";

export default function CreateUsernameInput(props) {
    return (
        <TextInput
            mt="xl"
            id="create-session-username"
            label="Choose your username"
            placeholder="Username"
            {...props.form.getInputProps('username')}
        />
    )
}