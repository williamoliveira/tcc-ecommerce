/* eslint-disable react/prop-types */
import React from 'react'
import Route from 'react-router-dom/Route'
import IfUserCan from '../IfUserCan'

const IfUserCanRoute = ({ component: Component, render, ...rest }) => (
  <Route
    {...rest}
    render={routerProps => (
      <IfUserCan {...rest}>
        {render ? render(routerProps) : <Component {...routerProps} />}
      </IfUserCan>
    )}
  />
)

export default IfUserCanRoute
