import React from 'react'
import { Link } from 'react-router-dom'

class Review extends React.Component {
  render() {
    return (
      <React.Fragment>
        <div className="container padding-bottom-3x mb-2">
          <div className="card text-center">
            <div className="card-body padding-top-2x">
              <h3 className="card-title">Obrigado!</h3>
              <p className="card-text">
                Seu pedido será processado o mais rápido possível.
              </p>
              <div className="padding-top-1x padding-bottom-1x">
                <Link className="btn btn-outline-primary" to="/">
                  Voltar a loja
                </Link>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    )
  }
}

export default Review
