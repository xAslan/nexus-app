import React from "react"
import { useRouter, BlitzPage } from "blitz"
import Layout from "app/layouts/Layout"

const MyPage: BlitzPage = () => {
  const router = useRouter()

  return (
    <div>
      <p>MyPage!</p>
    </div>
  )
}

MyPage.getLayout = (page) => <Layout title="Log In">{page}</Layout>

export default MyPage
