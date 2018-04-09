/* eslint-disable no-script-url */
import identity from 'lodash/identity'
import pickBy from 'lodash/pickBy'
import chunk from 'lodash/chunk'
import React from 'react'
import Helmet from 'react-helmet-async'
import Link from 'react-router-dom/Link'
import 'react-select/dist/react-select.css'
import Slider from 'react-slick'
import {
  Button,
  ButtonDropdown,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  Container,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Input,
  Row,
  Table,
} from 'reactstrap'
import cns from 'classnames'
import ReactPaginate from 'react-paginate'
import Toggler from '../../../../../Toggler'
import {
  formatCurrency,
  getProductFullImgUrl,
  getProductThumbUrl,
  outOfStock,
} from '../../helpers'
import sliderBgImgUrl from '../../../../../../imgs/sider_bg.jpg'
import { UNITS_PER_PRODUCT } from '../../constants'

class ProductsIndex extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      filters: {
        subGroup: null,
      },
      pagination: {
        page: 1,
        perPage: 15,
      },
      dropdowns: {},
      isFiltersShowing: false,
    }

    this.fetch = this.fetch.bind(this)
    this.handleFilterChange = this.handleFilterChange.bind(this)
    this.handlePaginationChange = this.handlePaginationChange.bind(this)
    this.addItemToCart = this.addItemToCart.bind(this)
    this.productInCart = this.productInCart.bind(this)
  }

  bootstrap() {
    if (process.env.BUILD_FLAG_IS_CLIENT === 'true') return
    this.initialFetch(true)
  }

  componentDidMount() {
    this.initialFetch(true)
  }

  componentWillReceiveProps(newProps) {
    const currentLocationState = this.props.location.state || {}
    const newLocationState = newProps.location.state || {}

    if (!currentLocationState.refetch && newLocationState.refetch) {
      this.fetch()
      this.props.history.replace({ state: { refetch: false } })
    }
  }

  initialFetch(isInitialFetch) {
    this.fetch(isInitialFetch)
    this.props.fetchManyProductGroups({ isInitialFetch })
  }

  fetch(isInitialFetch) {
    const { pagination } = this.state

    const query = {
      page: pagination.page,
      per_page: pagination.perPage,
    }

    this.props.fetchManyProducts({ query, isInitialFetch })
  }

  handleFilterChange(key, value) {
    this.props.changeFilters({
      [key]: value,
    })
  }

  handlePaginationChange(key, value) {
    this.setState(
      prevState => ({
        pagination: {
          ...prevState.pagination,
          [key]: value,
        },
      }),
      this.fetch,
    )
  }

  productInCart(product) {
    const { cart } = this.props

    return cart.items.filter(item => item.product.id === product.id).length > 0
  }

  addItemToCart(product) {
    const { addItemToCart } = this.props

    addItemToCart({
      product,
      quantity: 1,
    })
  }

  render() {
    const {
      products,
      pagination,
      productGroups,
      isLoading,
      filters,
      sliders,
    } = this.props
    const { pagination: localPagination } = this.state

    const productsChucks = chunk(products || [], 3)

    const totalPages = pagination.lastPage || 1
    const currentPage =
      (localPagination.page || 1) <= pagination.lastPage
        ? localPagination.page || 1
        : pagination.lastPage

    const sliderOptions = {
      dots: true,
      infinite: true,
      autoplay: true,
      autoplaySpeed: 7000,
    }

    return (
      <React.Fragment>
        <Helmet>
          <title>Usuários</title>
        </Helmet>

        {!!sliders.length && (
          <section
            className="hero-slider"
            style={{ backgroundImage: `url(${sliderBgImgUrl})` }}
          >
            <Slider {...sliderOptions}>
              {sliders.map(product => (
                <div key={product.id}>
                  <div className="container padding-top-3x">
                    <div className="row justify-content-center align-items-center">
                      <div className="col-lg-5 col-md-6 padding-bottom-2x text-md-left text-center">
                        <div className="from-bottom">
                          <div className="h2 text-body text-normal mb-2 pt-1">
                            {product.name}
                          </div>
                          <div className="h2 text-body text-normal mb-4 pb-1">
                            <span className="text-bold">
                              {formatCurrency(product.price)}
                            </span>
                          </div>
                        </div>
                        <Link
                          className="btn btn-primary scale-up delay-1"
                          to={`/${product.id}`}
                        >
                          Ver produto
                        </Link>
                      </div>
                      <div className="col-md-6 padding-bottom-2x mb-3">
                        <Link to={`/${product.id}`}>
                          <img
                            className="d-block mx-auto img-thumbnail"
                            src={getProductFullImgUrl(product)}
                            alt={product.name}
                            style={{ height: 440, width: 'auto', maxWidth: 600 }}
                          />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          </section>
        )}

        <Container className="mt-5 mb-5">
          <Row>
            <div className="col-md-3">
              <aside className="sidebar sidebar-offcanvas">
                <section className="widget">
                  <h3 className="widget-title">Pesquisa</h3>
                  <div className="form-group">
                    <Input
                      placeholder="Pesquisa..."
                      onChange={e => this.handleFilterChange('search', e.target.value)}
                      value={filters.search || ''}
                    />
                    {filters.search && (
                      <small
                        role="button"
                        onClick={() => this.handleFilterChange('search', '')}
                        className="hover-pointer"
                      >
                        <i className="fa fa-fw fa-remove" />
                        Limpar
                      </small>
                    )}
                  </div>
                </section>
                <section className="widget widget-categories">
                  <h3 className="widget-title">Categorias</h3>
                  <ul>
                    {productGroups &&
                      productGroups.map(productGroup => (
                        <Toggler
                          initActivated
                          key={productGroup.id}
                          render={({ toggle, active }) => (
                            <li className={cns('has-children', active && 'expanded')}>
                              <a onClick={toggle} className="hover-pointer">
                                {productGroup.name}
                              </a>
                              <ul>
                                {productGroup.sub_groups &&
                                  productGroup.sub_groups.data.map(productSubGroup => (
                                    <li key={productSubGroup.id}>
                                      <a
                                        role="button"
                                        onClick={() =>
                                          this.handleFilterChange(
                                            'subGroupId',
                                            productSubGroup.id,
                                          )
                                        }
                                        className={cns(
                                          'hover-pointer',
                                          filters.subGroupId === productSubGroup.id &&
                                            'active',
                                        )}
                                      >
                                        {productSubGroup.name}
                                      </a>
                                      {filters.subGroupId === productSubGroup.id && (
                                        <i
                                          role="button"
                                          onClick={() =>
                                            this.handleFilterChange('subGroupId', null)
                                          }
                                          className="fa fa-fw fa-remove hover-pointer"
                                        />
                                      )}
                                    </li>
                                  ))}
                              </ul>
                            </li>
                          )}
                        />
                      ))}
                  </ul>
                </section>
              </aside>
            </div>
            <div className="col-md-9">
              {productsChucks &&
                productsChucks.map((productsChunk, i) => (
                  <Row key={i} className="mb-4">
                    {productsChunk.map(product => (
                      <Col md={4} key={product.id}>
                        <div className="product-card">
                          <Link to={`/${product.id}`} className="product-thumb">
                            <img src={getProductThumbUrl(product)} alt={product.name} />
                          </Link>
                          <h3 className="product-title">
                            <Link to={`/${product.id}`} className="product-thumb">
                              {product.name}
                            </Link>
                          </h3>
                          <h4 className="product-price">
                            {formatCurrency(product.price)}{' '}
                            <small className="d-inline text-muted">
                              ({formatCurrency(product.price / UNITS_PER_PRODUCT)} p/ par)
                            </small>
                          </h4>
                          <div className="product-buttons">
                            {!outOfStock(product) ? (
                              !this.productInCart(product) ? (
                                <Button
                                  color="primary"
                                  outline
                                  onClick={() => this.addItemToCart(product)}
                                >
                                  <i className="icon-plus" /> Carrinho
                                </Button>
                              ) : (
                                <Button color="success" disabled outline>
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
                      </Col>
                    ))}
                  </Row>
                ))}

              {products.length < 1 && (
                <div className="text-center">Nenhum resultado encontrado.</div>
              )}

              <nav className="pagination">
                <div className="column">
                  <ReactPaginate
                    pageCount={totalPages}
                    forcePage={currentPage - 1}
                    pageRangeDisplayed={5}
                    marginPagesDisplayed={2}
                    containerClassName="pages"
                    activeClassName="active"
                    previousClassName="d-none"
                    pageLinkClassName="hover-pointer"
                    nextClassName="d-none"
                    disableInitialCallback
                    onPageChange={({ selected }) =>
                      this.handlePaginationChange('page', selected + 1)
                    }
                  />
                </div>
                <div className="column text-right hidden-xs-down">
                  <Button
                    outline
                    color="secondary"
                    size="sm"
                    disabled={currentPage >= totalPages}
                    onClick={() => this.handlePaginationChange('page', currentPage + 1)}
                  >
                    Próximo&nbsp;
                    <i className="icon-arrow-right" />
                  </Button>
                </div>
              </nav>
            </div>
          </Row>
        </Container>
      </React.Fragment>
    )
  }
}

export default ProductsIndex
