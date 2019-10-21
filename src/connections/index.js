module.exports = (envs) => {
    const {client, ...connection} = envs

    switch (client) {
        case 'postgresql':
                const Client = require(`./${client}`)
                
                return new Client(connection)
            break;
    }
}