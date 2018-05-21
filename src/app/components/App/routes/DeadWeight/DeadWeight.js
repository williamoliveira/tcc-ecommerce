if (process.env.DEAD_WEIGHT === '250') {
  require('./250')
} else if (process.env.DEAD_WEIGHT === '500') {
  require('./500')
} else if (process.env.DEAD_WEIGHT === '1000') {
  require('./1000')
} else if (process.env.DEAD_WEIGHT === '2000') {
  require('./2000')
}

export default () => null
