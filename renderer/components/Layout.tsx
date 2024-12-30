import Head from "next/head";
import Sidebar from "./Sidebar";
import { FC, PropsWithChildren } from "react";

const Layout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <Head>
        <title>Tofu - Home</title>
      </Head>
      <div className="h-screen flex overflow-y-hidden">
        <aside>
          <Sidebar />
        </aside>

        <main className="flex flex-col flex-1 p-4">
          {children}
        </main>
      </div>
    </>
  )
}

export default Layout;