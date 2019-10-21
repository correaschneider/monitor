const fs = require('fs')

class NotifierBase {
    constructor() {
        this.envs = null
        this.env = null

        this.data = null
        this.path = null
        this.total = {title: null}
        this.query = {type: 'button', text: 'Query executada', url: null}
        this.contour_solution = {type: 'button', text: 'Query para contorno', url: null}

        this.server = JSON.parse(fs.readFileSync(`${__dirname}/../environments/server.json`).toString())
    }

    setEnvs (envFile, envScope) {
        this.env = envFile
        let envs = fs.readFileSync(`${__dirname}/../environments/${envFile}.json`).toString()
        this.envs = JSON.parse(envs)[envScope]
    }

    loadData () {
        this.data = JSON.parse(fs.readFileSync(`${this.path}/result.json`).toString())
    }

    getModule () {
        let module = this.path.split('/')

        return module[module.length - 1]
    }

    loadQuery () {
        let module = this.getModule()

        this.query.url = `http://${this.server.host}:${this.server.port}/query/${module}`
    }

    loadContourSolution () {
        let module = this.getModule()

        if (fs.existsSync(`${this.path}/contour_solution.sql`)) {
            this.contour_solution.url = `http://${this.server.host}:${this.server.port}/contour_solution/${module}`
        }
    }

    getCriticality (value) {
        return value > 0
    }

    getAttachment (fields, criticality) {
        let attachment = {
            fallback: this.title,
            text: this.title,
            color: criticality,
            fields,
            actions: [
                this.query
            ]
        }

        if (this.contour_solution.url) {
            attachment.actions.push(this.contour_solution)
        }

        return attachment
    }

    toSlack () {
        let fields = []

        let criticality = 'good'

        this.data.map(value => {
            fields.push({
                title: this.total.title,
                value: value.total
            })

            if (criticality != 'danger') {
                criticality = this.getCriticality(value.total) ? 'danger' : 'good'
            }
        })

        return this.getAttachment(fields, criticality)
    }

    toEmail () {
        let body = ''
        let value = 0

        this.data.map(row => {
            if (parseInt(row.total) > value) {
                value = parseInt(row.total)
            }

            let bgcolor = '#ffffff'
            let color = '#000000'
            
            if (this.getCriticality(row.total)) {
                bgcolor = '#d43e27'
                color = '#ffffff'
            }

            body += `       <tr>`
            body += `           <td style="border: 1px solid black;" align="center">${this.total.title}</td>`
            body += `           <td style="border: 1px solid black;" align="center" bgcolor="${bgcolor}" style="color:${color}">${row.total}</td>`
            body += `           <td style="border: 1px solid black;" align="center"><a href="${this.query.url}" target="_blank">${this.query.text}</a></td>`
            body += `           <td style="border: 1px solid black;" align="center">`
            if (this.contour_solution.url) {
                body += `           <a href="${this.contour_solution.url}" target="_blank">${this.contour_solution.text}</a>`
            } else {
                body += 'Sem arquivo'
            }
            body += `           </td>`
            body += '       </tr>'
        })
        
        return {value, body}
    }
}

module.exports = NotifierBase