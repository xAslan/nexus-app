import { Suspense } from "react"
import Layout from "app/layouts/Layout"
import { Link, useRouter, useQuery, useParam, BlitzPage, useMutation } from "blitz"
import getUser from "app/users/queries/getUser"
import deleteUser from "app/users/mutations/deleteUser"
import getAccount from "app/accounts/queries/getAccount"
import PieChart from "app/users/components/Piechart"

export const User = () => {
  const router = useRouter()
  const userId = useParam("userId", "number")
  const [user] = useQuery(getUser, { where: { id: userId } })
  const [deleteUserMutation] = useMutation(deleteUser)
  const [account] = useQuery(getAccount, {
    where: { userId: user.id },
    include: { holdings: true },
  })
  const { holdings } = account
  const chartData = holdings.map(({ amount, symbol }) => ({
    value: amount,
    name: symbol,
  }))

  return (
    <div>
      <h1>User {user.id}</h1>
      <pre>{JSON.stringify(user, null, 2)}</pre>
      <pre>{JSON.stringify(account, null, 2)}</pre>

      <PieChart data={chartData} />

      <Link href={`/users/${user.id}/edit`}>
        <a>Edit</a>
      </Link>

      <button
        type="button"
        onClick={async () => {
          if (window.confirm("This will be deleted")) {
            await deleteUserMutation({ where: { id: user.id } })
            router.push("/users")
          }
        }}
      >
        Delete
      </button>
    </div>
  )
}

const ShowUserPage: BlitzPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <User />
    </Suspense>
  )
}

ShowUserPage.getLayout = (page) => <Layout title={"User"}>{page}</Layout>

export default ShowUserPage
