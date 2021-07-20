import * as styled from "app/users/components/styles"
import { Skeleton } from "antd"
import { useAggregates } from "app/users/components/dashboardCtx"

const TotalAmount = (props) => {
  const { rates, fiatCurrency } = props
  const { holdingsSum } = useAggregates()
  const rate = props.rates[fiatCurrency] || 0
  const ratedSum = rate * holdingsSum

  const renderSum = (sum = 0) => {
    if (sum > 0) {
      return (
        <styled.TotalAmountCard bordered={false}>
          {props.title && (
            <p>
              <strong>{props.title}</strong>
            </p>
          )}
          <p>
            <strong>
              $&nbsp;{holdingsSum.toLocaleString("en-US", { maximumFractionDigits: 2 })}
            </strong>
            <span> +4% </span>
          </p>

          {!props.title && (
            <p>
              <strong style={{ textDecoration: "strike" }}>
                &pound; &nbsp;
                {ratedSum.toLocaleString("en-US", { maximumFractionDigits: 2 })}
              </strong>
              <span> 30 days </span>
            </p>
          )}
        </styled.TotalAmountCard>
      )
    }

    return (
      <styled.TotalAmountCard>
        <strong>This Account has no funds</strong>
      </styled.TotalAmountCard>
    )
  }

  return renderSum(holdingsSum)
}

export default TotalAmount
