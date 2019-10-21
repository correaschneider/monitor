const fs = require('fs')

module.exports.runMonitors = procs => {
    procs.map(proc => {
        let pathModuleMonitors = `${__dirname}/${proc}/monitor.js`
        
        if (fs.existsSync(pathModuleMonitors)) {
            let ModuleMonitor = require(`${pathModuleMonitors}`)
            let moduleMonitor = new ModuleMonitor()
            
            moduleMonitor.process()
        }
    })
}

module.exports.runNotifiers = procs => {
    let moduleNotifiers = []
    
    procs.map(proc => {
        let pathModuleNotifiers = `${__dirname}/${proc}/notifier.js`
        
        if (fs.existsSync(pathModuleNotifiers)) {
            let ModuleNotifier = require(`${pathModuleNotifiers}`)
            moduleNotifiers.push(new ModuleNotifier())
        }
    })
    
    let notifiers = require('../notifiers')(moduleNotifiers)
}