class Postgress {
    constructor (env) {
        const { Client } = require('pg')
        
        env.statement_timeout = 300000

        this.client = new Client(env)
    }
    
    async query (query) {
        await this.client.connect()
        
        await this.client.query('set random_page_cost = 1.1')
        await this.client.query("set work_mem = '240MB'")

        let { rows } = await this.client.query(query)
        
        await this.client.end()
        
        return rows
    }
}

module.exports = Postgress