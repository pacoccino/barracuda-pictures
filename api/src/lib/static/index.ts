import { Server } from 'node-static'

export function staticServer(path: string) {
  const file = new Server(path)
  const port = 8080

  require('http')
    .createServer(function (request, response) {
      request
        .addListener('end', function () {
          file.serve(request, response)
        })
        .resume()
    })
    .listen(port)

  console.log(`Static server started, path ${path}, port ${port}`)
}
