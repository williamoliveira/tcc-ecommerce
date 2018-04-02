import React, { Component } from 'react'
import reformed from 'react-reformed'
import {
  Button,
  Col,
  Form,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
} from 'reactstrap'
import { compose } from 'recompose'
import InputGroup from '../../../../../../../../../InputGroup'
import withValidation from '../../../../../../../../../withValidation'
import cepApi from './cepApi'

class AddressesForm extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isCepLoading: false,
      isModalShowing: true,
    }

    this.handleSubmit = this.handleSubmit.bind(this)
    this.close = this.close.bind(this)
  }

  componentWillMount() {
    const { setModel, validation, address = {} } = this.props

    setModel({
      address: '',
      number: '',
      district: '',
      zipcode: '',
      city: null,
      ...address,
    })

    validation.setRules({})

    this.fetch()
  }

  componentWillReceiveProps(newProps) {
    // did not had a address but now has
    if (!this.props.address && newProps.address) {
      this.props.setModel(newProps.address)
    }

    // was loading, ended loading and didn't error'ed
    if (this.props.isLoading && !newProps.isLoading && !newProps.apiError) {
      this.close()
    }

    if (
      newProps.model.zipcode &&
      this.props.model.zipcode !== newProps.model.zipcode &&
      newProps.model.zipcode.replace(/\D/g, '').length === 8
    ) {
      this.fetchDataWithCep(newProps.model.zipcode)
    }
  }

  async fetchDataWithCep(zipcode) {
    const { setProperty } = this.props

    this.setState({ isCepLoading: true })

    const cepData = await cepApi.fetch(zipcode)

    this.setState({ isCepLoading: false })

    setProperty('city', cepData.city)
  }

  fetch() {
    const { fetchOneAddress, match: { params: { id } } } = this.props

    if (id) fetchOneAddress({ id })
  }

  close() {
    const { history, previousMatch } = this.props

    this.setState({ isModalShowing: false })

    setTimeout(
      () =>
        history.push({
          pathname: previousMatch.url,
          state: { refetch: true },
        }),
      300,
    )
  }

  handleSubmit(e) {
    e.preventDefault()
    const { saveForm, validation, model } = this.props

    validation.validateAll().then((valid) => {
      if (!valid) return
      saveForm({ address: model })
    })
  }

  isEditing() {
    const { address } = this.props

    return address && address.id
  }

  getTitle() {
    return `${this.isEditing() ? 'Editando' : 'Novo'} endereço`
  }

  render() {
    const { isModalShowing, isCepLoading } = this.state
    const {
      bindInput, validation, isLoading, model,
    } = this.props

    const cityName = model.city
      ? `${model.city.city} (${model.city.state.initials})`
      : isCepLoading ? 'Carregando...' : ''

    return (
      <Form onSubmit={this.handleSubmit}>
        <Modal isOpen={isModalShowing} toggle={this.close} autoFocus={false} size="md">
          <ModalHeader toggle={this.close}>{this.getTitle()}</ModalHeader>
          <ModalBody>
            <Row>
              <Col md={8}>
                <InputGroup
                  id="address"
                  label="Endereço"
                  {...{ bindInput, validation }}
                />
              </Col>
              <Col md={4}>
                <InputGroup id="number" label="Número" {...{ bindInput, validation }} />
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <InputGroup id="district" label="Bairro" {...{ bindInput, validation }} />
              </Col>
              <Col md={6}>
                <InputGroup id="zipcode" label="CEP" {...{ bindInput, validation }} />
              </Col>
            </Row>
            <InputGroup id="cityName" label="Cidade" disabled value={cityName} />
          </ModalBody>
          <ModalFooter>
            <Button color="link" type="button" onClick={this.close}>
              Cancelar
            </Button>
            <Button
              color="primary"
              type="submit"
              onClick={this.handleSubmit}
              disabled={isLoading}
            >
              Salvar
            </Button>
          </ModalFooter>
        </Modal>
      </Form>
    )
  }
}

export default compose(reformed(), withValidation())(AddressesForm)
