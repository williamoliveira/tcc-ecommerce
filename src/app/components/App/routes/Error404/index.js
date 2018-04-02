import React, { Component } from 'react'
import PropTypes from 'prop-types'

class Error404 extends Component {
  componentWillMount() {
    const { staticContext } = this.props
    if (staticContext) {
      staticContext.missed = true
    }
  }

  render() {
    return <div className="mt-5 text-center">Página não encontrada.</div>
  }
}

Error404.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  staticContext: PropTypes.object,
}

Error404.defaultProps = {
  staticContext: {},
}

export default Error404
