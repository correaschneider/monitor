const schedule = require('node-schedule');
const Modules = require('./modules')

schedule.scheduleJob('0 10 * * *', function(){
    let modules = [
        "logger",
    ]

    Modules.runNotifiers(modules)
});

schedule.scheduleJob('0 12 * * *', function(){
    let modules = [
        "duplicate_anwsers",
        "duplicate_questions",
        "duplicate_uas",
        "notes_export_log",
        "progress1",
        "progress2",
        "progress3",
        "progress4",
        "progressnote1",
        "progressnote3",
        "progressnote4",
        "quantity_answers_diff_jigs",
        "ua_with_more_than_five_questions_not_duplicated"
    ]

    Modules.runNotifiers(modules)
});

schedule.scheduleJob('0 5 * * *', function(){
    let modules = [
        "duplicate_anwsers",
        "duplicate_questions",
        "duplicate_uas",
        "notes_export_log",
        "progress1",
        "progress2",
        "progress3",
        "progress4",
        "progressnote1",
        "progressnote3",
        "progressnote4",
        "quantity_answers_diff_jigs",
        "ua_with_more_than_five_questions_not_duplicated"
    ]

    Modules.runMonitors(modules)
});