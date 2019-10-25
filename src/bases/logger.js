const fs = require('fs')

class Logger {
    constructor () {
        this.moment = require('moment')
        this.started_in = null
        this.ended_in = null
        this.path = null
        this.format = 'Y-M-D HH:mm:ss.SSS'
    }

    setPath (path) {
        this.path = path
    }

    start () {
        this.started_in = this.moment()
    }

    end (message) {
        this.ended_in = this.moment()

        this.save(message)
    }

    save (message) {
        let {milliseconds, seconds, minutes} = this.moment.duration(this.ended_in.diff(this.started_in))._data
        
        let logs = []
        let file = `${this.path}/log.json`
        if (fs.existsSync(file)) {
            logs = JSON.parse(fs.readFileSync(file))
        }

        logs.push({
            start: this.started_in.format(this.format),
            end: this.ended_in.format(this.format),
            diff: {milliseconds, seconds, minutes}, 
            message
        })

        fs.writeFileSync(file, JSON.stringify(logs, null, 2))
    }
}

module.exports = Logger