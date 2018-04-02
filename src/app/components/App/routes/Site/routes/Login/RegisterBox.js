/* eslint-disable jsx-a11y/label-has-for */
import React from 'react'
import { compose } from 'recompose'
import reformed from 'react-reformed'
import Redirect from 'react-router-dom/Redirect'
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Row,
  Col,
  Form,
  CardFooter,
} from 'reactstrap'
import withValidation from '../../../../../withValidation'
import * as validators from '../../../../../../utils/validator/validators'
import InputGroup from '../../../../../InputGroup'

class RegisterBox extends React.PureComponent {
  constructor(props) {
    super(props)

    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentWillMount() {
    const { setModel, validation } = this.props

    setModel({
      name: '',
      email: '',
      password: '',
      passwordConfirmation: '',
    })

    const required = () => [validators.required, 'Campo obrigatório.']
    const hasLengthGreaterThanOrEqual = num => [
      validators.hasLengthGreaterThanOrEqual(num),
      `Deve conter no mínimo ${num} caracteres.`,
    ]
    const passwordMatches = (field = 'password') => [
      validators.sameAs(field),
      'Senhas não conferem.',
    ]

    validation.setRules({
      name: [required()],
      email: [required()],
      password: [required(), hasLengthGreaterThanOrEqual(6)],
      passwordConfirmation: [required(), passwordMatches('password')],
    })
  }

  async handleSubmit(e) {
    e.preventDefault()
    const { register, validation, model } = this.props

    const valid = await validation.validateAll()
    if (!valid) return

    register(model)
  }

  render() {
    const {
      bindInput,
      model,
      validation,
      isRegisterLoading,
      isAuthenticated,
    } = this.props

    if (isAuthenticated) {
      return <Redirect to={{ pathname: '/' }} />
    }

    return (
      <React.Fragment>
        <div className="padding-top-3x hidden-md-up" />
        <h3 className="margin-bottom-1x">Ainda não tem uma conta? Registre-se</h3>
        <Form onSubmit={this.handleSubmit} className="row">
          <div className="col-sm-6">
            <InputGroup label="Nome" id="name" {...{ bindInput, validation }} />
          </div>
          <div className="col-sm-6">
            <InputGroup label="Email" id="email" {...{ bindInput, validation }} />
          </div>
          <div className="col-sm-6">
            <InputGroup
              label="Senha"
              id="password"
              type="password"
              {...{ bindInput, validation }}
            />
          </div>
          <div className="col-sm-6">
            <InputGroup
              label="Repita a senha"
              id="passwordConfirmation"
              type="password"
              {...{ bindInput, validation }}
            />
          </div>
          <div className="col-12 text-center text-sm-right">
            <Button
              color="primary"
              className="margin-bottom-none"
              type="submit"
              disabled={isRegisterLoading}
            >
              Registrar
            </Button>
          </div>
        </Form>
      </React.Fragment>
    )
  }
}

export default compose(reformed(), withValidation())(RegisterBox)
