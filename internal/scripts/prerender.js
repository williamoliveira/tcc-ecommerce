const prerender = require('prerender')
const server = prerender()
server.use(prerender.absolute())
server.start()
