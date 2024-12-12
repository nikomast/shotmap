import { useRouteError, Link } from "react-router-dom";

const ErrorPage = () => {
  const error = useRouteError();

  const DisplayError404 = () => {

    return (
      <div className="errorPage">
        <h1>Error 404 - Not Found</h1>
        <p>The requested page does not exist.</p>
        <Link to={"/main"}>Main Page</Link>
      </div>
    )
  }

  const DisplayDefaultError = () => {

    return (
      <div className="errorPage">
        <h1>Unexpected Error</h1>
        <p>We are terribly sorry about the inconvenience!</p>
        <p>{error.status} {error.statusText}</p>
        <Link to={"/main"}>Main Page</Link>
      </div>
    )
  }

  switch (error.status) {
    case 404:
      return (<DisplayError404 />)
    default:
      return <DisplayDefaultError />
  }

}

export default ErrorPage;