import React from 'react'
import { compose } from 'recompose'
import reformed from 'react-reformed'
import Redirect from 'react-router-dom/Redirect'
import { Form } from 'reactstrap'
import withValidation from '../../../../../withValidation'
import * as validators from '../../../../../../utils/validator/validators'

class LoginBox extends React.Component {
  constructor(props) {
    super(props)

    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentWillMount() {
    const { setModel, validation } = this.props

    setModel({
      username: '',
      password: '',
    })

    const required = () => [validators.required, 'Campo obrigatório.']

    validation.setRules({
      username: [required()],
      password: [required()],
    })
  }

  handleSubmit(e) {
    e.preventDefault()
    const { attemptLogin, validation, model } = this.props

    validation.validateAll().then((valid) => {
      if (!valid) return
      attemptLogin(model)
    })
  }

  render() {
    const {
      bindInput, validation, isLoginLoading, isAuthenticated,
    } = this.props

    if (isAuthenticated) {
      return <Redirect to={{ pathname: '/' }} />
    }

    return (
      <Form onSubmit={this.handleSubmit} className="login-box">
        <h3 className="margin-bottom-1x">Login</h3>
        <div className="form-group input-group">
          <input
            className="form-control"
            type="email"
            placeholder="Email"
            required
            style={{
              width: '100%',
              borderTopRightRadius: 22,
              borderBottomRightRadius: 22,
            }}
            {...bindInput('username')}
          />
          <span className="input-group-addon">
            <i className="icon-mail" />
          </span>
        </div>
        <div className="form-group input-group">
          <input
            className="form-control"
            type="password"
            placeholder="Senha"
            required
            style={{
              width: '100%',
              borderTopRightRadius: 22,
              borderBottomRightRadius: 22,
            }}
            {...bindInput('password')}
          />
          <span className="input-group-addon">
            <i className="icon-lock" />
          </span>
        </div>
        <div className="d-flex flex-wrap justify-content-between padding-bottom-1x">
          <a className="navi-link" href="account-password-recovery.html">
            Esqueceu sua senha?
          </a>
        </div>
        <div className="text-center text-sm-right">
          <button
            className="btn btn-primary margin-bottom-none"
            type="submit"
            disabled={isLoginLoading}
          >
            Login
          </button>
        </div>
      </Form>
    )
  }
}

export default compose(reformed(), withValidation())(LoginBox)
