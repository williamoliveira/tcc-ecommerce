import React, { Component } from 'react'
import Helmet from 'react-helmet-async'
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap'

class AddressesDelete extends Component {
  constructor(props) {
    super(props)

    this.state = {
      submitted: false,
      isModalShowing: true,
    }

    this.fetch = this.fetch.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.close = this.close.bind(this)
  }

  componentWillReceiveProps(newProps) {
    const { submitted } = this.state
    const { isLoading, apiError } = newProps

    if (submitted && !isLoading && !apiError) {
      this.close()
    }
  }

  asyncBootstrap() {
    const { address } = this.props

    if (!address) this.fetch()
  }

  fetch() {
    const { fetchOneAddress, match: { params: { id } } } = this.props

    fetchOneAddress({ id })
  }

  handleSubmit() {
    const { deleteOneAddress, address } = this.props

    this.setState({ submitted: true })

    deleteOneAddress({ address })
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

  render() {
    const { isModalShowing } = this.state
    const { isLoading } = this.props

    return (
      <div>
        <Helmet>
          <title>Usuários - Excluir?</title>
        </Helmet>

        <Modal isOpen={isModalShowing} toggle={this.close} autoFocus={false}>
          <ModalHeader toggle={this.close}>Excluir endereço?</ModalHeader>
          <ModalBody>
            Você tem certeza que deseja excluir isto? Esta ação não pode ser desfeita.
          </ModalBody>
          <ModalFooter>
            <Button color="link" type="button" onClick={this.close}>
              Cancelar
            </Button>
            <Button color="danger" onClick={this.handleSubmit} disabled={isLoading}>
              Confirmar
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    )
  }
}

export default AddressesDelete
