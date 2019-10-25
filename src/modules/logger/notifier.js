const NotifierBase = require('../../bases/notifier')
const fs = require('fs')

class Notifier extends NotifierBase {
    constructor() {
        super()

        this.path = __dirname
        this.setEnvs('logger', 'dev')
        this.loadData()

        this.toEmail = undefined
    }

    loadData () {
        let folders = fs.readdirSync(`${__dirname}/..`)
        this.data = []

        folders.map(folder => {
            if (['000-sample', 'index.js', 'logger'].indexOf(folder) === -1) {
                let logFile = `${__dirname}/../${folder}/log.json`
                if (fs.existsSync(logFile)) {
                    let logs = JSON.parse(fs.readFileSync(logFile).toString())
                    
                    let log = logs[logs.length - 1]
                    log.module = folder

                    this.data.push(log)
                }
            }
        })
    }

    getCriticality (value) {
        return value != 'Success'
    }

    getAttachment (fields, criticality) {
        let attachment = {
            fallback: this.title,
            text: this.title,
            color: criticality,
            fields
        }

        if (this.contour_solution.url) {
            attachment.actions.push(this.contour_solution)
        }

        return attachment
    }

    toSlack () {
        let criticality = 'good'
        let attachments = []
        
        this.data.map(value => {
            let {module: title, ...data} = value
            let field = [{
                title: title,
                value: "```" + JSON.stringify(data, null, 2) + "```"
            }]

            if (criticality != 'danger') {
                criticality = this.getCriticality(value.message) ? 'danger' : 'good'
            }

            attachments.push(this.getAttachment(field, criticality))
        })

        return attachments
    }
}

module.exports = Notifier