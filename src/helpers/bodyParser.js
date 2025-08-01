const bodyParser = (request, response, callback) => {
  let body = ''

  request.on('data', (chunk) => {
    body += chunk
  })

  request.on('end', () => {
    try {
      body = JSON.parse(body)
      request.body = body
      callback()
    } catch (error) {
      response.writeHead(400, { 'Content-Type': 'application/json' })
      response.end(JSON.stringify({ error: 'Invalid JSON in request body' }))
    }
  })
}

module.exports = bodyParser
