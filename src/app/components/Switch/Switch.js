import React from 'react'
import cns from 'classnames'

export default props => (
  <span className={cns('switch', props.className)}>
    <input
      type="checkbox"
      className="switch"
      id={props.id}
      checked={props.checked}
      onChange={props.onChange}
    />
    <label htmlFor={props.id}>{props.label}</label>
  </span>
)
