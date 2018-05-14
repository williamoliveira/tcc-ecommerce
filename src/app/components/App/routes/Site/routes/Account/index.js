export default (process.env.DISABLE_CODE_SPLITTING === 'true'
  ? require('./AccountContainer').default
  : require('./AccountAsync').default)
