import React, { Component } from 'react'
import Helmet from 'react-helmet-async'
import { Link, Route, Switch } from 'react-router-dom'
import { Container } from 'reactstrap'
import Addresses from './Addresses'
import Review from './Review'
import Completed from './Completed'

class Checkout extends Component {
  render() {
    const { match } = this.props

    return (
      <React.Fragment>
        <Helmet>
          <title>Checkout</title>
        </Helmet>

        <div className="page-title">
          <div className="container">
            <div className="column">
              <h1>Checkout</h1>
            </div>
            <div className="column">
              <ul className="breadcrumbs">
                <li>
                  <Link to="/">Início</Link>
                </li>
                <li className="separator">&nbsp;</li>
                <li>Checkout</li>
              </ul>
            </div>
          </div>
        </div>

        <Container>
          <Switch>
            <Route
              exact
              path={`${match.url}/review`}
              render={routeProps => <Review {...this.props} {...routeProps} />}
            />
            <Route
              exact
              path={`${match.url}/completed`}
              render={routeProps => <Completed {...this.props} {...routeProps} />}
            />
            <Route
              path={`${match.url}/`}
              render={routeProps => <Addresses {...this.props} {...routeProps} />}
            />
          </Switch>
        </Container>
      </React.Fragment>
    )
  }
}

export default Checkout
