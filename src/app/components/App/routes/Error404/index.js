export default (process.env.DISABLE_CODE_SPLITTING === 'true'
  ? require('./Error404').default
  : require('./Error404Async').default)
