import { Dialog, Text } from "@mantine/core";

export default function ErrorDialog(props) {
  return (
    <Dialog
      opened={props.opened}
      onClose={() => props.setOpened(false)}
      title={props.title}
      withCloseButton
      size="lg"
      radius="md"
      style={{ maxWidth: "250px" }}
    >
      <Text color="red.5">Error</Text>
      <Text color="dimmed">{props.error}</Text>
    </Dialog>
  );
}
