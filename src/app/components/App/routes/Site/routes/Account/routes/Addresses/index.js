export default (process.env.DISABLE_CODE_SPLITTING === 'true'
  ? require('./AddressesContainer').default
  : require('./AddressesAsync').default)
