/**
 * Session creation screen
 */

import { Button, Modal } from "@mantine/core";
import { useForm } from "@mantine/form";
import { initSession, joinSession } from "../../lib/firebase";
import {
  baseSessionValidators,
  joinSessionValidators,
  newSessionValidators,
} from "../../lib/validators";
import UsernameInput from "../inputs/UserInput";
import RoundsInput from "../inputs/RoundsInput";
import SessionIdInput from "../inputs/SessionIdInput";
import ErrorMessage, { displayError } from "../errors/ErrorMessage";
import { useState } from "react";
import Router from "next/router";
import cookieCutter from "cookie-cutter";

/**
 * Session creation modal
 * If the request succeeds, we redirect the player to the session page and set a cookie with their username
 * If the request fails, then we display a temporary error message and wait for further input
 * @param request a promise that resolves to a session ID
 * @param username username provided by the user
 * @param setErrorVisible setter for the error state
 */
function handleSubmission(request, username, setErrorVisible, setErrorMessage) {
  request
    .then((result) => {
      const { sessionId, error } = result;
      if (!error) {
        cookieCutter.set("username", username);
        Router.push("/[sessionId]", `/${sessionId}`);
      } else {
        displayError(error, setErrorVisible, setErrorMessage);
      }
    })
    .catch((error) => displayError(error, setErrorVisible, setErrorMessage));
}

export default function SessionModal(props) {
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const scenarioValidators = props.join
    ? joinSessionValidators
    : newSessionValidators;
  const form = useForm({
    initialValues: { username: "", sessionId: "" },
    validate: { ...baseSessionValidators, ...scenarioValidators },
  });
  return (
    <Modal
      opened={props.opened}
      onClose={() => props.setOpened(false)}
      title={props.title}
    >
      <form
        onSubmit={form.onSubmit((v) =>
          handleSubmission(
            props.join
              ? joinSession(v.sessionId, v.username)
              : initSession(v.username, v.rounds),
            v.username,
            setErrorVisible,
            setErrorMessage
          )
        )}
      >
        <UsernameInput form={form} />
        {props.join && <SessionIdInput form={form} />}
        {!props.join && <RoundsInput form={form} />}
        <Button
          type="submit"
          color="red"
          mt="xl"
          mb="xl"
          style={{ width: "100%" }}
        >
          Go!
        </Button>
      </form>
      {errorVisible && <ErrorMessage message={errorMessage} />}
    </Modal>
  );
}
