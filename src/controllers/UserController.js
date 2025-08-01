let users = require('../mocks/users')

module.exports = {
  listUsers(request, response) {
    const { order } = request.query

    const sortedUsers = users.sort((a, b) => {
      if (order === 'desc') {
        return a.id < b.id ? 1 : -1
      }

      return a.id > b.id ? 1 : -1
    })

    response.send(200, sortedUsers)
  },

  getUserById(request, response) {
    const { id } = request.params

    const user = users.find((users) => users.id === Number(id))

    if (!user) {
      return response.send(404, { error: 'User not found!' })
    }

    response.send(200, user)
  },

  createUser(request, response) {
    const { body } = request.body

    const lastUserId = users[users.length - 1].id
    const newUser = {
      id: lastUserId + 1,
      name: body.name,
    }

    users.push(newUser)

    response.send(200, newUser)
  },

  updateUser(request, response) {
    let { id } = request.params
    const { name } = request.body

    id = Number(id)

    const userExists = user.find((user) => user.id === id)

    if (!userExists) {
      return response.send(404, { error: 'User not found!' })
    }

    users = users.map((user) => {
      if (user.id === id) {
        return {
          ...user,
          name,
        }
      }

      return user
    })

    response.send({ id, name })
  },

  deleteUser(request, response) {
    let { id } = request.params
    id = Number(id)

    users = users.filter((user) => user.id === id)

    response.send(200, { deleted: true })
  }
}
