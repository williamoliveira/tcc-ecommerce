/* eslint-disable jsx-a11y/href-no-hash */
import React from 'react'
import Link from 'react-router-dom/Link'
import NavLink from 'react-router-dom/NavLink'
import { NavItem } from 'reactstrap'
import config from '../../../../../../../../config'
import logoUrl from '../../../../../../imgs/logo.png'
import { formatCurrency, getProductThumbUrl, makeImageUrl } from '../../helpers'

class Menu extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isOpen: false,
      isUserMenuOpen: false,
    }

    this.toggle = this.toggle.bind(this)
    this.toggleUserMenu = this.toggleUserMenu.bind(this)
    this.handleLogout = this.handleLogout.bind(this)
    this.removeItemFromCart = this.removeItemFromCart.bind(this)
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen,
    })
  }

  toggleUserMenu() {
    this.setState({
      isUserMenuOpen: !this.state.isUserMenuOpen,
    })
  }

  handleLogout(e) {
    e.preventDefault()
    this.props.logout()
  }

  removeItemFromCart(item) {
    const { removeItemByProductId } = this.props

    removeItemByProductId(item.product.id)
  }

  render() {
    const { user, cart, logout } = this.props

    return (
      <header className="navbar navbar-sticky">
        <div className="site-branding">
          <div className="inner">
            <Link to="/" className="site-logo">
              <img
                src={logoUrl}
                alt={config('htmlPage.defaultTitle')}
                style={{ height: 60, width: 'auto' }}
              />
            </Link>
          </div>
        </div>
        <nav className="site-menu">
          <ul>
            <li>
              <Link to="/">
                <span>Início</span>
              </Link>
            </li>
          </ul>
        </nav>
        <div className="toolbar">
          <div className="inner">
            <div className="tools">
              {!user && (
                <React.Fragment>
                  <Link to="/login" className="btn btn-link">
                    Entrar
                  </Link>
                </React.Fragment>
              )}

              {!!user && (
                <div className="account">
                  <Link to="/account" />
                  <i className="icon-head" />
                  <ul className="toolbar-dropdown">
                    <li className="sub-menu-user">
                      <div className="user-ava">
                        <img src={makeImageUrl(user.avatar_url)} alt={user.name} />
                      </div>
                      <div className="user-info">
                        <h6 className="user-name">{user.name}</h6>
                      </div>
                    </li>
                    <li>
                      <Link to="/account">Meu perfil</Link>
                    </li>
                    <li>
                      <Link to="/account/orders">Pedidos</Link>
                    </li>
                    <li className="sub-menu-separator" />
                    <li>
                      <a className="hover-pointer" onClick={logout}>
                        <i className="icon-unlock" /> Logout
                      </a>
                    </li>
                  </ul>
                </div>
              )}

              <div className="cart">
                <Link to="/cart" />
                <i className="icon-bag" />
                <span className="count">{cart.count}</span>
                <span className="subtotal">{formatCurrency(cart.subtotal)}</span>
                <div className="toolbar-dropdown">
                  {cart.count === 0 && (
                    <div className="text-center p-2">Carrinho vazio</div>
                  )}
                  {cart.items.map(item => (
                    <div className="dropdown-product-item" key={item.product.id}>
                      <span
                        className="dropdown-product-remove"
                        onClick={() => this.removeItemFromCart(item)}
                      >
                        <i className="icon-cross" />
                      </span>
                      <Link to={`/${item.product.id}`} className="dropdown-product-thumb">
                        <img src={getProductThumbUrl(item.product)} alt="Product" />
                      </Link>
                      <div className="dropdown-product-info">
                        <Link
                          to={`/${item.product.id}`}
                          className="dropdown-product-title"
                        >
                          {item.product.name}
                        </Link>
                        <span className="dropdown-product-details">
                          {item.quantity} x {formatCurrency(item.product.price)}
                        </span>
                      </div>
                    </div>
                  ))}
                  <div className="toolbar-dropdown-group">
                    <div className="column">
                      <span className="text-lg">Total:</span>
                    </div>
                    <div className="column text-right">
                      <span className="text-lg text-medium">
                        {formatCurrency(cart.subtotal)}&nbsp;
                      </span>
                    </div>
                  </div>
                  <div className="toolbar-dropdown-group">
                    <div className="column">
                      <Link to="/cart" className="btn btn-sm btn-block btn-secondary">
                        Carrinho
                      </Link>
                    </div>
                    <div className="column">
                      <Link to="/checkout" className="btn btn-sm btn-block btn-success">
                        Checkout
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    )
  }
}

export default Menu
