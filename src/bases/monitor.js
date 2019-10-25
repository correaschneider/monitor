const fs = require('fs')
const Logger = require('./logger')

class MonitorBase {
    constructor() {
        this.query = ''
        this.envs = {}
        this.data = null;
        this.path = null;

        this.logger = new Logger()
    }

    setEnvs (envFile, envScope) {
        let envs = fs.readFileSync(`${__dirname}/../environments/${envFile}.json`).toString()
        this.envs = JSON.parse(envs)[envScope].database
    }

    loadQuery (filename) {
        filename = filename || 'query.sql'
        
        this.query = fs.readFileSync(`${this.path}/${filename}`).toString()
    }

    async process (not_use_count) {
        let query = not_use_count ? this.query : `SELECT COUNT(1) AS TOTAL FROM (${this.query}) AS TEMP`
        let client = require('../connections')(this.envs)

        this.logger.setPath(this.path)
        this.logger.start()

        try {
            this.data = await client.query(query)
            this.logger.end('Success')

            this.saveData()
        } catch (ex) {
            this.logger.end(`Error: ${ex.message}`)
        }
    }

    saveData () {
        fs.writeFileSync(`${this.path}/result.json`, JSON.stringify(this.data, null, 2))
    }
}

module.exports = MonitorBase