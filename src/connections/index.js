const fs = require('fs')

module.exports = (envs) => {
    let {client, ...connection} = envs
    let file = `./${client}`

    if (fs.existsSync(file)) {
        const Client = require(file)

        return new Client(connection)
    }
}
