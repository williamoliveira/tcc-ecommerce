import React from 'react'
import { CardImgOverlay } from 'reactstrap'

class CardLoading extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isShowing: false,
      timeout: null,
    }
  }

  componentWillReceiveProps(newProps) {
    const { timeout } = this.state
    const { latencyThreshold = 300 } = newProps

    // Not loading
    if (!newProps.isLoading) {
      if (timeout) clearTimeout(timeout)
      this.setState({ isShowing: false, timeout: null })
      return
    }

    // Is loading but was already loading
    if (timeout) return

    // Is loading and wasn't
    this.setState({
      timeout: setTimeout(() => this.setState({ isShowing: true }), latencyThreshold),
    })
  }

  render() {
    const { isShowing } = this.state

    if (!isShowing) return null

    return (
      <CardImgOverlay
        style={{
          height: '100%',
          width: '100%',
          background: '#FFF',
          opacity: 0.8,
          zIndex: 900,
        }}
        className="text-center"
      >
        <div
          style={{
            position: 'absolute',
            margin: 'auto',
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            height: '2em',
            opacity: 1,
          }}
        >
          <i
            className="fa fa-fw fa-circle-o-notch fa-spin mb-1 text-primary"
            style={{ fontSize: '30px' }}
          />{' '}
          <br />
          <h5>Carregando...</h5>
        </div>
      </CardImgOverlay>
    )
  }
}

export default CardLoading
