const fs = require('fs')

class MonitorBase {
    constructor() {
        this.query = ''
        this.envs = {}
        this.data = null;
        this.path = null;
    }

    setEnvs (envFile, envScope) {
        let envs = fs.readFileSync(`${__dirname}/../environments/${envFile}.json`).toString()
        this.envs = JSON.parse(envs)[envScope].database
    }

    loadQuery (filename) {
        filename = filename || 'query.sql'
        
        this.query = fs.readFileSync(`${this.path}/${filename}`).toString()
    }

    async process () {
        let client = require('../connections')(this.envs)

        this.data = await client.query(`SELECT COUNT(1) AS TOTAL FROM (${this.query}) AS TEMP`)
        await this.saveData()
    }

    saveData () {
        fs.writeFileSync(`${this.path}/result.json`, JSON.stringify(this.data, true))
    }
}

module.exports = MonitorBase