export default (process.env.DISABLE_CODE_SPLITTING === 'true'
  ? require('./DeadWeight').default
  : require('./DeadWeightAsync').default)
