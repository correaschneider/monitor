const express = require("express")
const app = express()
const fs = require("fs")

const server = JSON.parse(fs.readFileSync(`./environments/server.json`).toString())

app.get('/:file/:module', (req, res, next) => {
    if (fs.existsSync(`./modules/${req.params.module}/${req.params.file}.sql`)) {
        let query = fs.readFileSync(`./modules/${req.params.module}/${req.params.file}.sql`).toString()
        
        res.send(`<pre style="tab-size: 4">${query}</pre>`)
    } else
        res.send('Arquivo não encontrado')
})

app.listen(server.port, '0.0.0.0')