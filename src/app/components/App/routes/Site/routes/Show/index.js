export default (process.env.DISABLE_CODE_SPLITTING === 'true'
  ? require('./ShowContainer').default
  : require('./ShowAsync').default)
