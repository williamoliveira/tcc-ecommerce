import React from 'react'
import { Link, Redirect } from 'react-router-dom'
import { Button, Col, Row } from 'reactstrap'
import { formatCurrency, getProductThumbUrl } from '../../../helpers'

class Review extends React.Component {
  render() {
    const { checkout, completeOrder, isLoading } = this.props

    if (!checkout.address) return <Redirect to="/checkout" />

    return (
      <React.Fragment>
        <Row>
          <Col>
            <h4>Pedido</h4>
            <hr className="padding-bottom-1x" />

            <div className="table-responsive shopping-cart">
              <table className="table">
                <thead>
                  <tr>
                    <th>Produto</th>
                    <th className="text-center">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {checkout.items.map(item => (
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
                              <Link to={`/${item.product.id}`}>
                                {item.product.name}
                                <small>x {item.quantity}</small>
                              </Link>
                            </h4>
                          </div>
                        </div>
                      </td>
                      <td className="text-center text-lg text-medium">
                        {formatCurrency(item.subtotal)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="shopping-cart-footer">
              <div className="column" />
              <div className="column text-lg">
                Total:{' '}
                <span className="text-medium">{formatCurrency(checkout.subtotal)}</span>
              </div>
            </div>

            <h4>Enviar para</h4>
            <hr className="padding-bottom-1x" />

            <div>
              {checkout.address.address}, {checkout.address.number} <br />
              {checkout.address.district} <br />
              {checkout.address.city.city} ({checkout.address.city.state.initials})
            </div>
          </Col>
        </Row>

        <div className="checkout-footer mt-5 mb-5">
          <div className="column">
            <Link className="btn btn-link" to="/checkout">
              <i className="icon-arrow-left" />
              <span className="hidden-xs-down">&nbsp;Endereço</span>
            </Link>
          </div>
          <div className="column">
            <Button color="success" onClick={completeOrder} disabled={isLoading}>
              <i className="icon-check" />
              <span className="hidden-xs-down">&nbsp;Completar pedido</span>
            </Button>
          </div>
        </div>
      </React.Fragment>
    )
  }
}

export default Review
