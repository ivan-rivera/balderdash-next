/**
 * Modal that pops up when the user clicks on the "About" button
 */

import {Modal} from "@mantine/core";

export default function AboutModal(props) {
    return (
        <Modal
            opened={props.opened}
            onClose={() => props.setOpened(false)}
            title="About"
            fullScreen
        >
            <p>
                This app was built by a lone and not very talented developer :)
                <br/><br/>
                My one and only goal behind this project was to be able to play this game with my friends.
                <br/><br/>
                If you have any suggestions or feedback, please feel free to create an issue
                on the project GitHub page. PRs are also welcomed.
            </p>
        </Modal>
    )
}