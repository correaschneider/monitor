const schedule = require('node-schedule');
const Modules = require('./modules')

schedule.scheduleJob('0 12 * * *', function(){
    let modules = [
        // '000-sample',
        'MODULE_NAME'
    ]

    Modules.runNotifiers(modules)
});

schedule.scheduleJob('0 5 * * *', function(){
    let modules = [
        // '000-sample',
        'MODULE_NAME'
    ]

    Modules.runMonitors(modules)
});