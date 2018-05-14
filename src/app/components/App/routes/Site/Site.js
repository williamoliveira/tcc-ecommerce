import React from 'react'
import Route from 'react-router-dom/Route'
import Switch from 'react-router-dom/Switch'
import withRouter from 'react-router-dom/withRouter'
import pure from 'recompose/pure'
import PrivateRoute from '../../../PrivateRoute'
import Error404 from '../Error404'
import Footer from './Footer'
import Header from './Header'
import AccountRoute from './routes/Account'
import CartRoute from './routes/Cart'
import CheckoutRoute from './routes/Checkout'
import ListRoute from './routes/List'
import LoginRoute from './routes/Login'
import ShowRoute from './routes/Show'

const Dashboard = () => (
  <React.Fragment>
    <Header />

    <Switch>
      <Route exact path="/login" component={LoginRoute} />
      <Route exact path="/cart" component={CartRoute} />
      <Route path="/checkout" component={CheckoutRoute} />
      <PrivateRoute path="/account" component={AccountRoute} />
      <Route exact path="/" component={ListRoute} />
      <Route path="/p/:id" component={ShowRoute} />

      <Route component={Error404} />
    </Switch>

    <Footer />
  </React.Fragment>
)

export default pure(withRouter(Dashboard))
