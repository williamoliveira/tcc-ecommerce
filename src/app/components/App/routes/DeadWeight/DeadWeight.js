if (process.env.DEAD_WEIGHT === '250') {
  require('./250')
} else if (process.env.DEAD_WEIGHT === '500') {
  require('./500')
} else if (process.env.DEAD_WEIGHT === '1000') {
  require('./1000')
} else if (process.env.DEAD_WEIGHT === '2000') {
  require('./2000')
} else if (process.env.DEAD_WEIGHT === '3000') {
  require('./3000')
}

export default () => null
