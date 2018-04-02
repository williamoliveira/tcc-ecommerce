import React from 'react'
import withRouter from 'react-router-dom/withRouter'
import Switch from 'react-router-dom/Switch'
import Route from 'react-router-dom/Route'
import pure from 'recompose/pure'
import Header from './Header'
import Error404 from '../Error404'
import AccountRoute from './routes/Account'
import ListRoute from './routes/List'
import ShowRoute from './routes/Show'
import CartRoute from './routes/Cart'
import CheckoutRoute from './routes/Checkout'
import LoginRoute from './routes/Login'
import Footer from './Footer'
import PrivateRoute from '../../../PrivateRoute'

const Dashboard = () => (
  <React.Fragment>
    <Header />

    <Switch>
      <Route exact path="/login" component={LoginRoute} />
      <Route exact path="/cart" component={CartRoute} />
      <Route path="/checkout" component={CheckoutRoute} />
      <PrivateRoute path="/account" component={AccountRoute} />
      <Route exact path="/" component={ListRoute} />
      <Route path="/:id" component={ShowRoute} />

      <Route component={Error404} />
    </Switch>

    <Footer />
  </React.Fragment>
)

export default pure(withRouter(Dashboard))
