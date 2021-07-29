import { useRouter, useSession } from "blitz"
import { Button } from "antd"
import TotalAmount from "app/users/components/totalAmount"
import BanksList from "app/users/components/banksList"
import * as styled from "app/users/components/styles"

const RightPaneComponent = (props) => {
  const router = useRouter()
  const session = useSession()
  const { account } = props

  return (
    <>
      <TotalAmount {...props} title={account.institution.name} />
      <BanksList account={account} title="Assets" hasButton={false} renderAssets={true} />
      <div className="flex justify-center mt-2">
        <button
          className="px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          block
          type="button"
          size="large"
          onClick={() => router.push(`/users/${session.userId}`)}
        >
          <strong>View all Accounts</strong>
        </button>
      </div>
    </>
  )
}

export default RightPaneComponent
