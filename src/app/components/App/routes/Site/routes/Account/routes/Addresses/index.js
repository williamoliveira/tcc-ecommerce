export default (process.env.DISABLE_CODE_SPLITTING === 'true'
  ? require('./ListContainer').default
  : require('./ListAsync').default)
