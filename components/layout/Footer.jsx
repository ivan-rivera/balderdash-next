/**
 * Footer
 */

import React, { useState } from "react";
import { Text, ActionIcon, Anchor, createStyles } from "@mantine/core";
import { IconBrandGithub } from "@tabler/icons";
import Link from "next/link";
import AboutModal from "../modals/AboutModal";
import RulesModal from "../modals/RulesModal";
import HelpModal from "../modals/HelpModal";

const useStyles = createStyles((theme, _params, getRef) => ({
  footer: {
    position: "relative",
    bottom: "5px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    justifyItems: "center",
    marginBottom: "5px",
    marginTop: "auto",
    paddingTop: "10px",
    paddingLeft: "auto",
    paddingRight: "auto",
    textAlign: "center",
    width: "100%",
    borderTop: `1px solid ${theme.colors.dark[5]}`,
  },
  refs: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    justifyItems: "center",
  },
  item: {
    fontSize: "1.25rem",
    marginLeft: "10px",
    marginRight: "10px",
  },
  gh: {
    marginTop: "10px",
    marginLeft: "auto",
    marginRight: "auto",
  },
}));

export default function Footer() {
  const [aboutOpened, setAboutOpened] = useState(false);
  const [rulesOpened, setRulesOpened] = useState(false);
  const [helpOpened, setHelpOpened] = useState(false);
  const { classes } = useStyles();
  const anchors = [
    ["About", setAboutOpened],
    ["Rules", setRulesOpened],
    ["Help", setHelpOpened],
  ];
  return (
    <>
      <AboutModal opened={aboutOpened} setOpened={setAboutOpened} />
      <RulesModal opened={rulesOpened} setOpened={setRulesOpened} />
      <HelpModal opened={helpOpened} setOpened={setHelpOpened} />
      <footer className={classes.footer}>
        <div className={classes.refs}>
          {anchors.map((value, index) => {
            let [name, setter] = value;
            return (
              <Anchor
                component="a"
                color="dimmed"
                key={index}
                className={classes.item}
                onClick={() => setter(true)}
              >
                {name}
              </Anchor>
            );
          })}
        </div>
        <ActionIcon
          className={classes.gh}
          size="lg"
          variant="default"
          radius="xl"
        >
          <Link href="https://github.com/ivan-rivera/balderdash-next" passHref>
            <a style={{ color: "unset !important" }}>
              <IconBrandGithub />
            </a>
          </Link>
        </ActionIcon>
        <Text pt="sm" size="xs" color="dimmed">
          Version 1.03
        </Text>
      </footer>
    </>
  );
}
