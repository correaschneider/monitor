const fs = require('fs')

module.exports = (moduleNotifiers) => {
    fs.readdir(__dirname, (err, files) => {
        files.map(file => {
            if (file != 'index.js') {
                let Notifier = require(`./${file}`)
                let notifier = new Notifier(moduleNotifiers)

                notifier.process()
            }
        })
    })
}