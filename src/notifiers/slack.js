class Slack {
    constructor(moduleNotifiers) {
        this.moduleNotifiers = moduleNotifiers
    }

    process () {
        let slacks = {}

        this.moduleNotifiers.map(moduleNotifier => {
            let group = moduleNotifier.env
            if (moduleNotifier.toSlack) {
                if (slacks[group]) {
                    slacks[group].attachments.push(moduleNotifier.toSlack())
                } else {
                    slacks[group] = {
                        slack: require('slack-notify')(moduleNotifier.envs.notifiers.slack.web_hook),
                        text: 'Monitoramento',
                        attachments: [moduleNotifier.toSlack()]
                    }
                }
            }
        })
        
        for (let slackMessageID in slacks) {
            slacks[slackMessageID].attachments.sort((a,b) => (a.color > b.color ? 1 : b.color > a.color ? -1 : 0));
            slacks[slackMessageID].attachments = slacks[slackMessageID].attachments.filter((attachment) => !!attachment);
        }
        
        for (let slackMessageID in slacks) {
            let {slack, ...message} = slacks[slackMessageID]

            if (slacks[slackMessageID].attachments.length > 0)
                slack.success(message)
        }
    }
}

module.exports = Slack