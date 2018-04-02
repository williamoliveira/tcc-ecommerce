import React from 'react'

const YEAR = new Date().getFullYear()

export default () => (
  <small className="text-muted">
    © {YEAR}{' '}
    <a href="https://h2sa.com.br" target="_blank">
      H2SA
    </a>. Desenvolvimento <a href="//williamoliveiradev.com">William Oliveira</a> e FCODE.
  </small>
)
