/* eslint-disable react/jsx-indent */
import React from 'react'
import Helmet from 'react-helmet-async'
import Link from 'react-router-dom/Link'
import Route from 'react-router-dom/Route'
import Switch from 'react-router-dom/Switch'
import 'react-select/dist/react-select.css'
import { Col, Row, Table } from 'reactstrap'
import CardLoading from '../../../../../../../CardLoading'
import DeleteRoute from './routes/Delete'
import FormRoute from './routes/Form'

class Addresses extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      dropdowns: {},
    }

    this.fetch = this.fetch.bind(this)
    this.toggleDropdown = this.toggleDropdown.bind(this)
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

  toggleDropdown(id) {
    this.setState(prevState => ({
      dropdowns: {
        ...prevState,
        [id]: !prevState.dropdowns[id],
      },
    }))
  }

  render() {
    const { addresses, isLoading, match } = this.props

    return (
      <React.Fragment>
        <Helmet>
          <title>Endereços</title>
        </Helmet>

        <div className="mt-4 mb-4">
          <Row className="mb-2">
            <Col>
              <h2>Endereços</h2>
            </Col>
            <Col className="text-right">
              <Link to={`${match.url}/create`} className="btn btn-primary mr-2">
                <i className="fa fa-fw fa-plus" /> Novo endereço
              </Link>
            </Col>
          </Row>

          <div>
            <CardLoading isLoading={isLoading} />

            <Table className="mb-0" hover responsive>
              <thead className="thead-default">
                <tr>
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
                      <td>
                        {address.address}, {address.number}
                      </td>
                      <td>{address.district}</td>
                      <td>{address.zipcode}</td>
                      <td className="text-right">
                        <Link to={`${match.url}/${address.id}/edit`}>Editar</Link>
                        <Link
                          to={`${match.url}/${address.id}/delete`}
                          className="ml-3 text-danger"
                        >
                          Excluir
                        </Link>
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
        </div>

        <Switch>
          <Route
            exact
            path={`${match.url}/create`}
            render={props => <FormRoute {...props} previousMatch={match} />}
          />
          <Route
            exact
            path={`${match.url}/:id/edit`}
            render={props => <FormRoute {...props} previousMatch={match} />}
          />
          <Route
            exact
            path={`${match.url}/:id/delete`}
            render={props => <DeleteRoute {...props} previousMatch={match} />}
          />
        </Switch>
      </React.Fragment>
    )
  }
}

export default Addresses
