import { ReactNode } from "react"
import { Head } from "blitz"
import { NavBar, DashboardNavBar } from "./components/NavBar"
import Footer from "./components/Footer"

type LayoutProps = {
  title?: string
  children: ReactNode
}

const NormalLayout = ({ title, children }: LayoutProps) => {
  return (
    <>
      <Head>
        <title>{title || "Nexus Finance"}</title>
      </Head>
      <NavBar />
      {children}
      <Footer />
    </>
  )
}

export const DashboardLayout = ({ title, children }: LayoutProps) => {
  return (
    <>
      <Head>
        <title>{title || "Nexus Finance"}</title>
      </Head>
      <NavBar />
      {children}
      <Footer />
    </>
  )
}

export default NormalLayout
