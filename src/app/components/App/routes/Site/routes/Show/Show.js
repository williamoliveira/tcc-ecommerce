/* eslint-disable no-nested-ternary */
import React, { Component } from 'react'
import Helmet from 'react-helmet-async'
import reformed from 'react-reformed'
import { Button, UncontrolledCarousel } from 'reactstrap'
import { compose } from 'redux'
import withValidation from '../../../../../withValidation'
import { UNITS_PER_PRODUCT } from '../../constants'
import { formatCurrency, fullUrl, makeImageUrl, outOfStock } from '../../helpers'

class ProductsShowBody extends Component {
  constructor() {
    super()

    this.addItemToCart = this.addItemToCart.bind(this)
  }

  bootstrap() {
    if (process.env.BUILD_FLAG_IS_CLIENT === 'true') return
    this.fetch(true)
  }

  componentDidMount() {
    this.fetch(true)
  }

  componentWillMount() {
    const { setModel, validation } = this.props
    setModel({ quantity: 1 })
    validation.setRules({})
  }

  fetch(isInitialFetch) {
    const { fetchOneProduct, match: { params: { id } } } = this.props
    fetchOneProduct({ id, isInitialFetch })
  }

  static renderGroupAndSubGroup(product) {
    return [
      product.group && product.group.name,
      product.sub_group && product.sub_group.name,
    ]
      .filter(x => x)
      .join(' > ')
  }

  productInCart(product) {
    const { cart } = this.props

    return cart.items.filter(item => item.product.id === product.id).length > 0
  }

  addItemToCart() {
    const { addItemToCart, product, model } = this.props

    addItemToCart({
      product,
      quantity: model.quantity,
    })
  }

  render() {
    const {
      product, model, setProperty, validation,
    } = this.props

    if (!product) return null

    const slides = (product.images || []).map(image => ({
      src: makeImageUrl(`${image.url}?w=800`),
      altText: product.name,
      caption: '',
    }))

    return (
      <div className="container padding-bottom-3x mb-1 mt-5">
        {product && (
          <Helmet>
            <title>{product.name}</title>
            <meta property="og:url" content={fullUrl(`/p/${product.id}`)} />
            <meta property="og:type" content="product" />
            <meta property="og:title" content={product.name} />
            <meta property="og:description" content="Uma descrição do produto." />
            <meta
              property="og:image"
              content={makeImageUrl(`${product.images[0].url}?w=800`)}
            />
          </Helmet>
        )}

        <div className="row">
          <div className="col-md-6">
            <div className="product-gallery pt-3">
              <UncontrolledCarousel items={slides} />
            </div>
          </div>
          <div className="col-md-6">
            <div className="padding-top-2x mt-2 hidden-md-up" />
            <h2 className="text-normal">{product.name}</h2>
            <h2>
              {formatCurrency(product.price)}{' '}
              <small className="d-inline text-muted">
                ({formatCurrency(product.price / UNITS_PER_PRODUCT)} p/ par)
              </small>
            </h2>
            <b>Pares na grade:</b> {UNITS_PER_PRODUCT} <br />
            <b>Estoque:</b> {product.balance} <br />
            {!outOfStock(product) && (
              <div className="row margin-top-1x">
                <div className="col-sm-3">
                  <div className="form-group">
                    <label htmlFor="quantity">
                      Quantidade
                      <input
                        id="quantity"
                        type="number"
                        min={1}
                        max={product.balance}
                        className="form-control"
                        value={model.quantity || 1}
                        onChange={e =>
                          setProperty(
                            'quantity',
                            e.target.value >= 1 ? e.target.value : 1,
                          )
                        }
                        onBlur={() => validation.setTouched('quantity')}
                      />
                    </label>
                  </div>
                </div>
              </div>
            )}
            {product.ref && (
              <div className="pt-1 mb-2">
                <span className="text-medium">REF:</span> {product.ref}
              </div>
            )}
            {product.group && (
              <div className="mb-2">
                <span className="text-medium">Categoria:&nbsp;</span>
                {ProductsShowBody.renderGroupAndSubGroup(product)}
              </div>
            )}
            <hr className="mb-3" />
            <div className="d-flex flex-wrap justify-content-between">
              <div className="sp-buttons mt-2 mb-2">
                {!outOfStock(product) ? (
                  !this.productInCart(product) ? (
                    <Button color="primary" onClick={this.addItemToCart}>
                      <i className="icon-bag" /> Adicionar ao carrinho
                    </Button>
                  ) : (
                    <Button color="success" disabled>
                      <i className="icon-check" /> No carrinho
                    </Button>
                  )
                ) : (
                  <Button color="default" disabled>
                    <i className="fa fa-fw fa-remove" /> Fora de estoque
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default compose(reformed(), withValidation())(ProductsShowBody)
