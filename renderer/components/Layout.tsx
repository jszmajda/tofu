import Head from "next/head";
import Sidebar from "./Sidebar";
import { FC, PropsWithChildren, useEffect } from "react";
import React from "react";
import { useAtom } from "jotai";
import * as atoms from "../lib/atoms";

const Layout: FC<PropsWithChildren> = ({ children }) => {
  const [, setHydrated] = useAtom(atoms.isHydrated);

  useEffect(() => {
    setHydrated(true);
  }, []);

  return (
    <React.Fragment>
      <Head>
        <title>Tofu - Home</title>
      </Head>
      <div className="flex overflow-y-hidden fixed h-screen w-screen">
        <aside>
          <Sidebar />
        </aside>

        <main className="overflow-y-scroll w-full">
          {children}
        </main>
      </div>
    </React.Fragment>
  )
}

export default Layout;