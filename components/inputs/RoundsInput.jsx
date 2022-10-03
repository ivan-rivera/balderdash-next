import {NumberInput} from "@mantine/core";

export default function SelectRoundsInput(props) {
    return (
        <>
            <NumberInput
                mt="xl"
                id="session-rounds"
                label="Enter the desired number of rounds"
                placeholder="10"
                {...props.form.getInputProps('rounds')}
            />
            <p style={{fontStyle: 'italic', fontSize: 12, textAlign: 'left'}}>
                We recommend setting round count to a multiple of players
            </p>
        </>
    )
}