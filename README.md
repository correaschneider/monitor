# Monitoramento
![](https://img.shields.io/badge/NodeJS-v12.11-important)

Reposnsável por carregar informações relacionadas a saúde do sistema e enviar notificações aos responsáveis

> O Monitoramento é separado em **módulos** e cada **módulo** possue duas etapas: **_monitor_** e **_notifier_**

## Environments

### _Monitors_ e _Notifiers_

Replique o arquivo `environments/sample.json` e faça as alterações necessárias

> Podemos ter mais de um _environments_ para os _Monitors_ e _Notifiers_

```shell
cp src/environments/sample.json src/environments/client.json
vim src/environments/client.json
```

> Nos `environments` podem conter mais de um acesso a banco e _keys_ de Notificadores, basta replicar o primeiro nó do `JSON`

```javascript
{
    "node1": {...},
    "node2": {...}
}
```

### Server

Replique o arquivo `environments/server-sample.json` e faça as alterações necessárias

```shell
cp src/environments/server-sample.json src/environments/server.json
vim src/environments/server.json
```

## Criando novo Módulo
Duplique o **módulo** _000-sample_, faça as alterações nos arquivos necessários, publique no servidor.

- monitor.js

```javascript
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
```

> Altere os parâmetros da função `setEnvs('NOME_DO_ARQUIVO_DE_ENVIRONMENTS', 'GRUPO_NO_ARQUIVO_ENVIRONMENTS')`

> Se necessário, altere o nome do arquivo onde contém a query

```javascript
this.loadQuery('arquivo.sql')
```

- notifier.js
```javascript
const NotifierBase = require('../../bases/notifier')

class Notifier extends NotifierBase {
    constructor() {
        super()
        
        this.path = __dirname
        this.setEnvs('sample', 'group_1')
        this.loadData()
        this.loadQuery()

        this.title = 'Monitoramento Sample'
        this.total.title = 'Sample'
    }
}

module.exports = Notifier
```

> Altere os parâmetros da função `setEnvs('NOME_DO_ARQUIVO_DE_ENVIRONMENTS', 'GRUPO_NO_ARQUIVO_ENVIRONMENTS')`

> Se necessário, altere o nome do arquivo onde contém a query

```javascript
this.loadQuery('arquivo.sql')
```

> Sobrescreva as variáveis `this.title` e `this.total.title`

> Por **default**, será utilizados todos os **_notifiers_**. Para desabilitar, sobrescreva a função por `undefined`
```javascript
this.toSlack = undefined
```

- query.sql

> Adicione a query que deverá ser executada

## Publicando
> Para publicar no servidor

1. Acesse via ssh

2. Acesse a pasta:
```shell
cd /monitoramento
```

3. Copie o arquivo `environments/sample.json` para `environments/myfile.json`, edite-o

4. Execute a sequência de commandos:
```shell
git checkout .
git fetch --all
git rebase origin/master
```

5. Adicione o novo módulo na CRON
```shell
crontab -e
```
## Execução

### _Monitors_ e _Notifiers_
> Acionamento por comando

Adicionar no arquivo `schedule.js` o módulo que deve ser rodado, utilizar os métodos `Modules.runMonitors` e `Modules.runNotifiers`

Exemplo a ser seguido
```javascript
schedule.scheduleJob('0 5 * * *', function(){
    let modules = [
        'progress1'
    ]

    Modules.runMonitors(modules)
});
```

```javascript
schedule.scheduleJob('0 12 * * *', function(){
    let modules = [
        'progress1'
    ]

    Modules.runNotifiers(modules)
});
```

> Após, encerrar o processo `node schedule` e iniciá-lo novamente

Para iniciar o schedule, rode o comando
```shell
node schedule &
```

Para encerrar o schedule, busque o PID do processo e _mate-o_
```shell
ps waux | grep "node schedule"
root     32190  0.0  0.9 568124 36008 ?        Sl   16:50   0:00 node schedule

kill -9 32190
```

### Server
> Acionamento por comando

O Server devolve a query executada nos _Monitors_

> > > Ao atualizar, encerrar o processo `node server` e iniciá-lo 

Para iniciar o server, rode o comando
```shell
node server &
```

Para encerrar o server, busque o PID do processo e _mate-o_
```shell
ps waux | grep "node server"
root     32190  0.0  0.9 568124 36008 ?        Sl   16:50   0:00 node server

kill -9 32190
```