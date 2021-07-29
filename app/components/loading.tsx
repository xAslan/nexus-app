export default function LoadingPage(props) {
  const height = props.height || "h-96"
  const loadingContent = props.loadingContent || "Loading ..."

  return (
    <div className={`w-full ${height}`}>
      <p> {loadingContent} </p>
    </div>
  )
}
