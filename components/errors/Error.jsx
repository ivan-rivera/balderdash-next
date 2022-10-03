import {Image, Text, Title} from '@mantine/core';

export default function Error(props) {
    return (
        <>
            <Title style={{fontWeight: 900, fontSize: 34, marginBottom: '20px', marginTop: '20px'}}>
                Oops :/
            </Title>
            <Text color="dimmed" size="lg" mb="xl">{props.message}</Text>
            <Image width={400} ml="auto" mr="auto" src="./error.svg" />
        </>
    )
}