export default (process.env.DISABLE_CODE_SPLITTING === 'true'
  ? require('./LoginContainer').default
  : require('./LoginAsync').default)
