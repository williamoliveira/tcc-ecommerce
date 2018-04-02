import React, { Component } from 'react'
import Helmet from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { Button } from 'reactstrap'
import { formatCurrency, getProductThumbUrl } from '../../helpers'
import { UNITS_PER_PRODUCT } from '../../constants'

export class Cart extends Component {
  constructor() {
    super()
    this.removeItemFromCart = this.removeItemFromCart.bind(this)
    this.setItemQuantity = this.setItemQuantity.bind(this)
  }

  removeItemFromCart(item) {
    const { removeItemByProductId } = this.props

    removeItemByProductId(item.product.id)
  }

  setItemQuantity(item, quantity) {
    const { setItemQuantityByProductId } = this.props

    setItemQuantityByProductId({
      productId: item.product.id,
      quantity,
    })
  }

  render() {
    const { cart, completeOrder } = this.props

    return (
      <div>
        <Helmet>
          <title>Carrinho</title>
        </Helmet>

        <div className="page-title">
          <div className="container">
            <div className="column">
              <h1>Carrinho</h1>
            </div>
            <div className="column">
              <ul className="breadcrumbs">
                <li>
                  <Link to="/">Início</Link>
                </li>
                <li className="separator">&nbsp;</li>
                <li>Carrinho</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="container padding-bottom-3x mb-1">
          <div className="table-responsive shopping-cart">
            <table className="table">
              <thead>
                <tr>
                  <th>Produto</th>
                  <th className="text-center">Quantidade</th>
                  <th className="text-center">Subtotal</th>
                  <th className="text-right">
                    <a className="btn btn-sm btn-outline-danger" href="#">
                      Limpar
                    </a>
                  </th>
                </tr>
              </thead>
              <tbody>
                {cart.count === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center pt-4">
                      Nenhum produto adicionado.
                    </td>
                  </tr>
                )}
                {cart.items.map(item => (
                  <tr key={item.product.id}>
                    <td>
                      <div className="product-item">
                        <Link to={`/${item.product.id}`} className="product-thumb">
                          <img
                            src={getProductThumbUrl(item.product)}
                            alt={item.product.name}
                          />
                        </Link>
                        <div className="product-info">
                          <h4 className="product-title">
                            <Link to={`/${item.product.id}`}>{item.product.name}</Link>
                          </h4>
                          <b>Pares na grade:</b> {UNITS_PER_PRODUCT} <br />
                          <b>Estoque:</b> {item.product.balance}
                        </div>
                      </div>
                    </td>
                    <td className="text-center">
                      <div className="count-input">
                        <input
                          id="quantity"
                          type="number"
                          className="form-control"
                          value={item.quantity || 1}
                          onChange={e =>
                            this.setItemQuantity(
                              item,
                              e.target.value >= 1 ? e.target.value : 1,
                            )
                          }
                        />
                      </div>
                    </td>
                    <td className="text-center text-lg text-medium">
                      {formatCurrency(item.subtotal)}
                    </td>
                    <td className="text-right">
                      <a
                        className="remove-from-cart text-danger hover-pointer"
                        onClick={() => this.removeItemFromCart(item)}
                      >
                        <i className="icon-cross" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="shopping-cart-footer">
            <div className="column" />
            <div className="column text-lg">
              Subtotal:{' '}
              <span className="text-medium">{formatCurrency(cart.subtotal)}</span>
            </div>
          </div>
          <div className="shopping-cart-footer">
            <div className="column">
              <Link to="/" className="btn btn-outline-secondary">
                <i className="icon-arrow-left" />&nbsp;Voltar
              </Link>
            </div>
            <div className="column">
              <Link to="/checkout" className="btn btn-success">
                Checkout
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Cart
