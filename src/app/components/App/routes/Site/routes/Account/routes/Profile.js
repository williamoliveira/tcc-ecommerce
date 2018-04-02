import React, { Component } from 'react'
import { Button, Card, CardBody, CardFooter, Col, Form, Row } from 'reactstrap'
import reformed from 'react-reformed'
import { compose } from 'recompose'
import withValidation from '../../../../../../withValidation'
import * as validators from '../../../../../../../utils/validator/validators'
import InputGroup from '../../../../../../InputGroup'

class Profile extends Component {
  constructor(props) {
    super(props)

    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentWillMount() {
    const { setModel, validation, user = {} } = this.props

    setModel({
      email: '',
      name: '',
      password: '',
      passwordConfirmation: '',
      ...user,
    })

    const required = () => [validators.required, 'Campo obrigatório.']
    const hasLengthGreaterThanOrEqual = num => [
      validators.acceptBlank(validators.hasLengthGreaterThanOrEqual(num)),
      `Deve conter no mínimo ${num} caracteres.`,
    ]
    const passwordMatches = (field = 'password') => [
      validators.sameAs(field),
      'Senhas não conferem.',
    ]

    validation.setRules({
      name: [required()],
      email: [required()],
      password: [hasLengthGreaterThanOrEqual(4)],
      passwordConfirmation: [passwordMatches('password')],
    })
  }

  componentWillReceiveProps(newProps) {
    // did not had a user but now has
    if (!this.props.user && newProps.user) {
      this.props.setModel(newProps.user)
    }

    // was loading, ended loading and didn't error'ed
    if (this.props.isLoading && !newProps.isLoading && !newProps.apiError) {
      // show success
    }
  }

  handleSubmit(e) {
    e.preventDefault()
    const { save, validation, model } = this.props

    validation.validateAll().then((valid) => {
      if (!valid) return
      save(model)
    })
  }

  render() {
    const {
      bindInput, validation, isLoading, model,
    } = this.props

    return (
      <React.Fragment>
        <div className="padding-top-2x mt-2 hidden-lg-up" />
        <Form onSubmit={this.handleSubmit} className="row">
          <div className="col-md-6">
            <InputGroup id="name" label="Nome" {...{ bindInput, validation }} />
          </div>
          <div className="col-md-6">
            <InputGroup
              id="email"
              label="Email"
              value={model.email || ''}
              disabled
              {...{ validation }}
            />
          </div>
          <div className="col-md-6">
            <InputGroup
              id="password"
              label="Senha"
              type="password"
              {...{ bindInput, validation }}
            />
          </div>
          <div className="col-md-6">
            <InputGroup
              id="passwordConfirmation"
              label="Repita a senha"
              type="password"
              {...{ bindInput, validation }}
            />
          </div>
          <div className="col-12">
            <hr className="mt-2 mb-3" />
            <div className="d-flex flex-wrap justify-content-between align-items-center">
              <Button
                color="primary"
                type="submit"
                onClick={this.handleSubmit}
                disabled={isLoading}
              >
                Salvar
              </Button>
            </div>
          </div>
        </Form>
      </React.Fragment>
    )
  }
}

export default compose(reformed(), withValidation())(Profile)
