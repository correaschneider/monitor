const getParams = async () => {
    const args = process.argv.filter(arg => arg.includes('runMonitors') || arg.includes('runNotifiers'))
    
    const runners = []
    await args.map(runner => {
        let [action, procs] = runner.split('=')
        procs = procs.split(',')
        runners.push({action, process: procs});
    })

    return runners
}

const start = async () => {
    const runners = await getParams()
    
    const monitors = require('./modules')

    if (runners.length > 0)
        runners.map(runner => {
            if (runner.action == 'runMonitors') {
                monitors.runMonitors(runner.process)
            } else if (runner.action == 'runNotifiers') {
                monitors.runNotifiers(runner.process)
            }
        })
    else
        console.log('Parâmetro não encontrado')
        
}

start()