const MonitorBase = require('../../bases/monitor')

class Monitor extends MonitorBase {
    constructor () {
        super()
        
        this.path = __dirname
        this.setEnvs('sample', 'sagahcm')
        this.loadQuery()
    }
}

module.exports = Monitor