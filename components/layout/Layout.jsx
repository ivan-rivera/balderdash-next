/**
 * General layout
 */

import Link from 'next/link'
import Image from "next/image";
import Footer from "./Footer";

export default function Layout({ children }) {
    return (
      <div style={{textAlign: 'center', height: '100%'}}>
          <Link href="/">
              <Image
                  src="/logo_and_sub.svg"
                  width="350vw"
                  height="100vh"
                  alt="logo"
                  style={{cursor: 'pointer'}}
              />
          </Link>
          <div style={{marginBottom: '50px'}}>
              {children}
          </div>
          <Footer />
    </div>
    );
}