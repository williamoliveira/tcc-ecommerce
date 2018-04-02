import React from 'react'

class Toggler extends React.Component {
  constructor(props) {
    super()

    this.state = {
      active: props.initActivated || false,
    }

    this.toggle = this.toggle.bind(this)
  }

  toggle() {
    this.setState(prevState => ({
      active: !prevState.active,
    }))
  }

  render() {
    const { render } = this.props
    const { active } = this.state

    return render({ ...this.props, active, toggle: this.toggle })
  }
}

export default Toggler
