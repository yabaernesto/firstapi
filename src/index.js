const http = require('node:http')
const { URL } = require('node:url')

const bodyParser = require('./helpers/bodyParser')
const routes = require('./routes')

const server = http.createServer((request, response) => {
  const parsedUrl = new URL(`http://localhost:3000${request.url}`)

  console.log(parsedUrl)

  console.log(`Request method: ${request.method} | Endpoint: ${parsedUrl.pathname}`)

  let { pathname } = parsedUrl
  let id = null

  // const splitEndpoint = pathname.split('/').filter((routeItem) => Boolean(routeItem))
  const splitEndpoint = pathname.split('/').filter(Boolean)
  console.log(splitEndpoint)

  if (splitEndpoint.length > 1) {
    pathname = `/${splitEndpoint[0]}/:id`
    id = splitEndpoint[1]
  }

  console.log(pathname)

  const route = routes.find((routeObj) =>
    routeObj.endpoint === pathname && routeObj.method === request.method
  )

  if (route) {
    request.query = Object.fromEntries(parsedUrl.searchParams)
    request.params = { id }

    response.send = (statusCode, body) => {
      response.writeHead(statusCode, { 'Content-Type': 'application/json' })
      response.end(JSON.stringify(body))
    }

    if (['POST', 'PUT', 'PATCH'].includes(request.method)) {
      bodyParser(request, response, () => route.handler(request, response))
    } else {
      route.handler(request, response)
    }
  } else {
    response.writeHead(404, { 'Content-Type': 'text/html' })
    response.end(`Cannot ${request.method} ${request.url}`)
  }
})

server.listen(3000, () => console.log('Server started at http://localhost:3000'))
