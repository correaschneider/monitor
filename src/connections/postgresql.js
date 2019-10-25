class Postgresql {
    constructor (config) {
        const { Client } = require('pg')
        
        config.statement_timeout = 1800000

        this.client = new Client(config)
    }
    
    async query (query) {
        await this.client.connect()
        
        await this.client.query('set random_page_cost = 1.1')
        await this.client.query("set work_mem = '16MB'")

        return await this.client.query(query)
            .then(res => res.rows)
            .catch(err => { throw new Error(err.stack) })
            .finally(() => this.client.end())
    }
}

module.exports = Postgresql