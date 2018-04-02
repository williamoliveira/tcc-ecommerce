import React from 'react'
import Select from 'react-select/dist/react-select'

export default ({ async = false, ...rest }) => {
  const props = {
    valueKey: 'id',
    labelKey: 'name',
    autosize: false,
    searchPromptText: 'Digite para pesquisar',
    loadingPlaceholder: 'Carregando...',
    placeholder: 'Selecione...',
    noResultsText: 'Nenhum resultado encontrado',
    clearValueText: 'Limpar',
    clearAllText: 'Limpar tudo',
    ...rest,
  }

  return async ? <Select.Async {...props} /> : <Select {...props} />
}
