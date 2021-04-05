import * as styled from "app/users/components/styles"
import { Skeleton } from "antd"
import { useAggregates } from "app/users/components/dashboardCtx"

const TotalAmount = (props) => {
  const { holdingsSum } = useAggregates()

  const renderSum = (sum = 0) => {
    if (sum > 0) {
      return (
        <styled.TotalAmountCard bordered={false}>
          <p>
            <strong>
              $&nbsp;{holdingsSum.toLocaleString("en-US", { maximumFractionDigits: 2 })}
            </strong>
            <span> +4% </span>
          </p>

          <p>
            <strong style={{ textDecoration: "strike" }}>&pound; 8,000</strong>
            <span> 30 days </span>
          </p>
        </styled.TotalAmountCard>
      )
    }

    return <Skeleton active={true} loading={true} />
  }

  return renderSum(holdingsSum)
}

export default TotalAmount
