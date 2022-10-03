import {Modal, SimpleGrid, Title} from "@mantine/core";

const questionsAndAnswers = [
    [
        "I cannot return to the home screen! What do I do?",
        "Clicking on the logo, on the top of the page will take you to the home screen",
    ],
    [
        "I was taken to the home screen and I cannot rejoin the session under the same username! What do I do?",
        "You should be able to get back into the game by visiting the URL with /SomeSessionId " +
        "your username should be saved as a cookie. If for whatever reason it is not, then you can " +
        "manually set it on a a desktop by right-clicking on the page, then 'Inspect' --> 'Application' " +
        "and if you do not see a username defined there, you can double-click and manually enter it. " +
        "And yes, technically you can enter the session as someone else, but that's just not a nice thing to do.",
    ],
    [
        "I think I've spotted a bug! What do I do?",
        "Please report a bug by visiting the project GitHub page (link in the footer) and creating an issue. "
    ]
]

export default function HelpModal(props) {
    return (
        <Modal
            opened={props.opened}
            onClose={() => props.setOpened(false)}
            title="Help"
            fullScreen
        >
            <SimpleGrid>
                {questionsAndAnswers.map((value, index) => {
                    let question = value[0]
                    let answer = value[1]
                    return (
                        <div key={index}>
                            <Title size="h3">{question}</Title>
                            <p>{answer}</p>
                            <br/>
                        </div>
                    )
                })}
            </SimpleGrid>
        </Modal>
        )
    }