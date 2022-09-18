/**
 * General layout
 */

import Image from "next/image";
import Footer from "./Footer";

export default function Layout({ children }) {
    return (
      <div style={{textAlign: 'center', height: '100%'}}>
          <Image src="/logo_and_sub.svg" width="350vw" height="100vh" alt="logo"/>
          <div style={{marginBottom: '50px'}}>
              {children}
          </div>
          <Footer />
    </div>
    );
}