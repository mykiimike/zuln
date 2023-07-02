#!/usr/bin/env node

const sc = require('subcommander')
const os = require('os')
const fs = require('fs')
const chalk = require('chalk')
const Zuln = require('../index')


sc.option('dataDir', {
    abbr: 'd',
    desc: 'Data directory',
    default: `${os.homedir()}/.zuln`
});

sc.option('server', {
    abbr: 's',
    desc: 'Zuln servers to use',
    default: `https://api.diventry.com`
});

sc.option('api', {
    abbr: 'a',
    desc: 'API Path',
    default: `/api/`
});

// Can you give me the list of potential vulnerabilities in this code ?
sc.command('snif', {
    desc: 'Snif a single file',
    callback: async function (options) {

        if (!options[0] || options[0].length === 0) {
            console.log(`Usage: zuln snif <file>`)
            process.exit(-1)
        }

        const zuln = new Zuln(options.server, options.api)

        var payload = ""
        try {
            console.nino.debug(`Reading file ${options[0]}`)
            payload = fs.readFileSync(options[0]).toString()
            console.nino.debug(`File ${options[0]} read`)
        } catch (e) {
            console.log(`Opening file: ${e.message}`)
            process.exit(-1)
        }

        const ret = await zuln.post('zuln/snif', {payload})
        if(ret.error) {
            console.log(ret.error)
            process.exit(-1)
        }
        
        const lines = payload.split("\n")
        const affected = {}

        for (var result of ret.results) {
            result.lines.map((item) => {
                var num = 1
                for (var line of lines) {
                    if(line.trim().length > 4) {
                        if (line.trim() === item.trim())
                        affected[num] = true
                    }

                    num++
                }

            })
        }

        console.pretty(ret.results)
        console.log("")
        var num = 1
        for (var line of lines) {
            const opt = {
                number: num.toString().padding(4, " ")
            }
            if (affected[num] !== true) {
                opt.prefix = " |  "
                opt.line = chalk.hex(`#51F924`)(line)

            }
            else {
                opt.prefix = " |> "
                opt.line = chalk.hex(`#F94141`)(line)
            }

            console.log(`[${opt.number}]${opt.prefix}${opt.line}`)

            num++
        }

        console.pretty({
            "Suggested remediations": ret.remediations
        })
    }
})


// require("./other")

sc.parse()


