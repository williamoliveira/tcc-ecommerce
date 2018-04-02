import React from 'react'
import { Col, FormGroup, Input, Label, Row } from 'reactstrap'

function Filters({ filters, handleFilterChange }) {
  return (
    <Row>
      <Col md="3">
        <FormGroup>
          <Label for="user">Nome</Label>
          <Input
            type="text"
            value={filters.name}
            onChange={e => handleFilterChange('name', e.target.value)}
            placeholder="Nome do usuário..."
          />
        </FormGroup>
      </Col>
    </Row>
  )
}

export default Filters
