import {Button} from "@mantine/core";

const SelectionButton = (props) => {
    return (
        <Button
            onClick={props.onClick}
            style={{
                marginLeft: 'auto',
                marginRight: 'auto',
                marginTop: '5px',
                marginBottom: '5px',
                width: '300px',
                height: '50px',
            }}
            variant="white"
            color="red.8"
            radius="md"
            uppercase
            {...props}
        >{props.content}</Button>
    )
}

export default SelectionButton
