/**
 * General layout
 */

import React from "react";
import Link from "next/link";
import Image from "next/image";
import Footer from "./Footer";

export default function Layout({ children }) {
  return (
    <div
      style={{
        textAlign: "center",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Link href="/" passHref>
        <a style={{ color: "unset !important" }}>
          <Image
            src="/logo_and_sub.svg"
            width="350vw"
            height="100vh"
            alt="logo"
            style={{ cursor: "pointer" }}
          />
        </a>
      </Link>
      <div>{children}</div>
      <Footer />
    </div>
  );
}
