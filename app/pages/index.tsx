import { Suspense, useEffect } from "react"
import { Link, useRouter, BlitzPage, useMutation } from "blitz"
import Layout from "app/layouts/Layout"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import logout from "app/auth/mutations/logout"

/*
 * This file is just for a pleasant getting started page for your new app.
 * You can delete everything in here and start from scratch if you like.
 */

const UserInfo = () => {
  const currentUser = useCurrentUser()
  const router = useRouter()

  useEffect(() => {
    if (currentUser?.id) {
      router.push(`/users/${currentUser.id}`)
    } else {
      router.push("/login")
    }
  }, [])

  return <p> User Info </p>
}

const Home: BlitzPage = () => {
  return (
    <Suspense fallback="Loading...">
      <UserInfo />
    </Suspense>
  )
}

Home.suppressFirstRenderFlicker = true
Home.getLayout = (page) => <Layout title="Nexus Finance">{page}</Layout>

export default Home
