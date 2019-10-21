class Email {
    constructor(moduleNotifiers) {
        this.moduleNotifiers = moduleNotifiers
    }

    async process () {
        let emails = {}
        
        let nodemailer = require('nodemailer')

        this.moduleNotifiers.map(moduleNotifier => {
            let group = moduleNotifier.env

            if (moduleNotifier.toEmail) {
                if (emails[group]) {
                    emails[group].body.push(moduleNotifier.toEmail())
                } else {
                    let {destinatary, ...connection} = moduleNotifier.envs.notifiers.email
                    
                    emails[group] = {
                        transporter: nodemailer.createTransport(connection),
                        destinatary,
                        body: [moduleNotifier.toEmail()],
                        title: moduleNotifier.envs.title
                    }
                }
            }
        })

        for (let emailID in emails) {
            emails[emailID].body.sort((a,b) => (a.value < b.value ? 1 : b.value < a.value ? -1 : 0));
        }
        
        let date = new Date()
        date = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear()
        
        for (let emailID in emails) {
            let email = emails[emailID]
            
            let {to, cc, cco, from} = email.destinatary
            
            let html = ''
            
            html += '<table style="border: 1px solid black; border-collapse: collapse;">'
            html += '   <thead>'
            html += `       <th style="border: 1px solid black;">Módulo</th>`
            html += `       <th style="border: 1px solid black;">Total</th>`
            html += `       <th style="border: 1px solid black;">Query para consulta</th>`
            html += `       <th style="border: 1px solid black;">Query de contorno</th>`
            html += '   </thead>'
            
            html += '   <tbody>'
            
            email.body.map(_body => html += _body.body)
                    
            html += '   </tbody>'
            html += '</table>'

            try {
                let status = await email.transporter.sendMail({
                    from,
                    to,
                    cc,
                    cco,
                    subject: `Monitoramento - ${email.title} - ${date}`,
                    html
                })
            } catch (e) {
                console.log(e)
            }
        }
    }
}

module.exports = Email