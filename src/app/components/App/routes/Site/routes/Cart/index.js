export default (process.env.DISABLE_CODE_SPLITTING === 'true'
  ? require('./CartContainer').default
  : require('./CartAsync').default)
