import { ReactNode } from "react"
import { Head } from "blitz"
import NavBar from "./components/NavBar"
import Footer from "./components/Footer"

type LayoutProps = {
  title?: string
  children: ReactNode
}

const Layout = ({ title, children }: LayoutProps) => {
  return (
    <>
      <Head>
        <title>{title || "Nexus Finance"}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NavBar />
      {children}
      <Footer />
    </>
  )
}

export default Layout
