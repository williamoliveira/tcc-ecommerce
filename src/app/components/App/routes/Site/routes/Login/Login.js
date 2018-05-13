import React from 'react'
import Helmet from 'react-helmet-async'
import Redirect from 'react-router-dom/Redirect'
import LoginBox from './LoginBox'
import RegisterBox from './RegisterBox'

class Login extends React.Component {
  render() {
    const { isAuthenticated } = this.props

    if (isAuthenticated) {
      return <Redirect to={{ pathname: '/' }} />
    }

    return (
      <React.Fragment>
        <Helmet>
          <title>Login</title>
        </Helmet>

        <div className="container padding-bottom-3x padding-top-3x mb-2">
          <div className="row">
            <div className="col-md-6">
              <LoginBox {...this.props} />
            </div>
            <div className="col-md-6">
              <RegisterBox {...this.props} />
            </div>
          </div>
        </div>
      </React.Fragment>
    )
  }
}

export default Login
