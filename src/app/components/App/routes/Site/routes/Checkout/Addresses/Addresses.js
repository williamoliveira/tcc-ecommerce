/* eslint-disable react/jsx-indent */
import React from 'react'
import Link from 'react-router-dom/Link'
import Route from 'react-router-dom/Route'
import Switch from 'react-router-dom/Switch'
import 'react-select/dist/react-select.css'
import { Button, Col, Row, Table } from 'reactstrap'
import CardLoading from '../../../../../../CardLoading'
import FormRoute from '../../Account/routes/Addresses/routes/Form'
import { Redirect } from 'react-router-dom'

class List extends React.Component {
  constructor() {
    super()

    this.fetch = this.fetch.bind(this)
  }

  asyncBootstrap() {
    this.initialFetch()
  }

  componentDidMount() {
    this.initialFetch()
  }

  componentWillReceiveProps(newProps) {
    const currentLocationState = this.props.location.state || {}
    const newLocationState = newProps.location.state || {}

    if (!currentLocationState.refetch && newLocationState.refetch) {
      this.fetch()
      this.props.history.replace({ state: { refetch: false } })
    }
  }

  initialFetch() {
    const { isLoading } = this.props

    if (!isLoading) this.fetch()
  }

  fetch() {
    const { fetchManyAddresses } = this.props

    fetchManyAddresses()
  }

  render() {
    const {
      addresses, checkout, setAddress, isLoading, match,
    } = this.props

    if (checkout.count < 1) return <Redirect to="/cart" />

    return (
      <React.Fragment>
        <Row className="mb-2">
          <Col>
            <h2>Selecione o endereço de entrega</h2>
          </Col>
          <Col className="text-right">
            <Link
              to={`${match.url}/addresses/create`}
              className="btn btn-outline-primary mr-2"
            >
              <i className="fa fa-fw fa-plus" /> Novo endereço
            </Link>
          </Col>
        </Row>

        <div>
          <CardLoading isLoading={isLoading} />

          <Table className="mb-0" hover responsive>
            <thead className="thead-default">
              <tr>
                <th>#</th>
                <th>Endereço</th>
                <th>Bairro</th>
                <th>CEP</th>
                <th className="text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {addresses &&
                addresses.map(address => (
                  <tr key={address.id}>
                    <td onClick={() => setAddress(address)} className="hover-pointer">
                      <input
                        type="radio"
                        name="address"
                        checked={!!checkout.address && address.id === checkout.address.id}
                        onChange={() => setAddress(address)}
                      />
                    </td>
                    <td onClick={() => setAddress(address)} className="hover-pointer">
                      {address.address}, {address.number}
                    </td>
                    <td onClick={() => setAddress(address)} className="hover-pointer">
                      {address.district}
                    </td>
                    <td onClick={() => setAddress(address)} className="hover-pointer">
                      {address.zipcode}
                    </td>
                    <td className="text-right">
                      <Link to={`${match.url}/addresses/${address.id}/edit`}>Editar</Link>
                    </td>
                  </tr>
                ))}
              {addresses.length < 1 && (
                <tr>
                  <td colSpan={6} className="text-center">
                    Nenhum resultado encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>

        <div className="checkout-footer mt-5 mb-5">
          <div className="column">
            <Link className="btn btn-link" to="/cart">
              <i className="icon-arrow-left" />
              <span className="hidden-xs-down">&nbsp;Voltar ao carrinho</span>
            </Link>
          </div>
          <div className="column">
            {checkout.address ? (
              <Link className="btn btn-primary" to="/checkout/review">
                <span className="hidden-xs-down">Continuar&nbsp;</span>
                <i className="icon-arrow-right" />
              </Link>
            ) : (
              <Button color="primary" disabled>
                <span className="hidden-xs-down">Continuar&nbsp;</span>
                <i className="icon-arrow-right" />
              </Button>
            )}
          </div>
        </div>

        <Switch>
          <Route
            exact
            path={`${match.url}/addresses/create`}
            render={props => <FormRoute {...props} previousMatch={match} />}
          />
          <Route
            exact
            path={`${match.url}/addresses/:id/edit`}
            render={props => <FormRoute {...props} previousMatch={match} />}
          />
        </Switch>
      </React.Fragment>
    )
  }
}

export default List
