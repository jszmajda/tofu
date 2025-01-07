import Head from "next/head";
import Sidebar from "./Sidebar";
import { FC, PropsWithChildren, useEffect } from "react";
import React from "react";
import { useAtom } from "jotai";
import * as atoms from "../lib/atoms";
import electron from "electron";

declare global {
  interface Window {
      themeData?: any
  }
}

const Layout: FC<PropsWithChildren> = ({ children }) => {
  const [, setHydrated] = useAtom(atoms.isHydrated);
  const [isDarkMode, setIsDarkMode] = useAtom(atoms.isDarkMode);
  const [theme, ] = useAtom(atoms.theme);
  const [darkModeTheme, ] = useAtom(atoms.darkModeTheme);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    // listen for a 'dark-mode-updated' message from the main process
    window.themeData.onUpdateDarkMode((shouldUseDarkMode) => {
      console.log('dark mode updated', shouldUseDarkMode);
      setIsDarkMode(shouldUseDarkMode);
    });
    window.themeData.getIsDarkMode().then((isDarkMode) => {
      console.log('isDarkMode', isDarkMode);
      setIsDarkMode(isDarkMode);
    });
  }, []);

  useEffect(() => {
    if(isDarkMode) {
      document.querySelector('html').setAttribute('data-theme', darkModeTheme);
    } else {
      document.querySelector('html').setAttribute('data-theme', theme);
    }
  }, [theme, darkModeTheme, isDarkMode])

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