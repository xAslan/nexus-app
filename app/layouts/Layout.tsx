import { ReactNode, Suspense } from "react"
import { Head } from "blitz"
import { NavBar, DashboardNavBar } from "./components/NavBar"
import Header from "app/layouts/components/tailwind"
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
      <Header />

      <div className="mt-20">{children}</div>
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
      <Header />
      <div className="mt-20">{children}</div>
      <Footer />
    </>
  )
}

export default NormalLayout
