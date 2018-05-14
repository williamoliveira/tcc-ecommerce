export default (process.env.DISABLE_CODE_SPLITTING === 'true'
  ? require('./CheckoutContainer').default
  : require('./CheckoutAsync').default)
