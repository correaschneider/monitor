const NotifierBase = require('../../bases/notifier')

class Notifier extends NotifierBase {
    constructor() {
        super()

        this.path = __dirname
        this.setEnvs('sample', 'sagahcm')
        this.loadData()
        this.loadQuery()

        this.title = 'Monitoramento Sample'
        this.total.title = 'Sample'
    }
}

module.exports = Notifier