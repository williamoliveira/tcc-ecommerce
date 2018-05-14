import React, { Component } from 'react'
import Helmet from 'react-helmet-async'
import { NavLink, Route, Switch } from 'react-router-dom'
import defaultUserCoverUrl from '../../../../../../imgs/default_user_cover.jpg'
import { makeImageUrl } from '../../helpers'
import AddressesRoute from './routes/Addresses'
import ProfileRoute from './routes/Profile'

class Profile extends Component {
  render() {
    const { user, match } = this.props

    return (
      <div>
        <Helmet>
          <title>Conta</title>
        </Helmet>

        <div className="page-title">
          <div className="container">
            <div className="column">
              <h1>Meu perfil</h1>
            </div>
            <div className="column">
              <ul className="breadcrumbs">
                <li>
                  <a href="/">Início</a>
                </li>
                <li className="separator">&nbsp;</li>
                <li>Meu perfil</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="container padding-bottom-3x mb-2">
          <div className="row">
            <div className="col-lg-4">
              <aside className="user-info-wrapper">
                <div
                  className="user-cover"
                  style={{ backgroundImage: `url(${defaultUserCoverUrl})` }}
                />
                <div className="user-info">
                  <div className="user-avatar">
                    <a className="edit-avatar" href="#" />
                    <img src={makeImageUrl(user.avatar_url)} alt={user.name} />
                  </div>
                  <div className="user-data">
                    <h4>{user.name}</h4>
                    <span>{user.email}</span>
                  </div>
                </div>
              </aside>
              <nav className="list-group">
                <NavLink
                  to="/account"
                  className="list-group-item"
                  activeClassName="active"
                  exact
                >
                  <i className="icon-head" /> Perfil
                </NavLink>
                <NavLink
                  to={`${match.url}/addresses`}
                  className="list-group-item"
                  activeClassName="active"
                >
                  <i className="icon-map" /> Endereços
                </NavLink>
              </nav>
            </div>
            <div className="col-lg-8">
              <Switch>
                <Route
                  exact
                  path="/account"
                  render={routeProps => <ProfileRoute {...this.props} {...routeProps} />}
                />
                <Route
                  path="/account/addresses"
                  render={routeProps => (
                    <AddressesRoute {...this.props} {...routeProps} />
                  )}
                />
              </Switch>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Profile
