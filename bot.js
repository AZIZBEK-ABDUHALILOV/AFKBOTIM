const mineflayer = require('mineflayer')
const http = require('http')

const HOST = process.env.MC_HOST || 'seni_oldiraman.aternos.me'
const PORT = parseInt(process.env.MC_PORT || '35104')
const USERNAME = process.env.MC_USER || 'AFK_Bot'

let status = 'starting'
let lastEvent = '-'
const log = (m) => { lastEvent = new Date().toISOString() + ' ' + m; console.log(m) }

// Brauzerda Render URL'ini oching: bot holati va oxirgi xato shu yerda ko'rinadi
http.createServer((_, res) =>
  res.end(`status: ${status}\nlast: ${lastEvent}\nmineflayer: ${require('mineflayer/package.json').version}`)
).listen(process.env.PORT || 3000)

function start() {
  status = 'connecting'
  log(`Ulanmoqda ${HOST}:${PORT}`)
  const bot = mineflayer.createBot({
    host: HOST, port: PORT, username: USERNAME,
    auth: 'offline', hideErrors: false
  })

  bot.once('login', () => log('Login muvaffaqiyatli, versiya: ' + bot.version))
  bot.once('spawn', () => {
    status = 'online'
    log('Serverga kirdi')
    setInterval(() => {
      bot.setControlState('jump', true)
      setTimeout(() => bot.setControlState('jump', false), 300)
      bot.look(Math.random() * Math.PI * 2, 0)
    }, 30000)
  })

  bot.on('kicked', r => log('KICK: ' + JSON.stringify(r)))
  bot.on('error', e => log('XATO: ' + e.message))
  bot.on('end', r => {
    status = 'offline, retrying'
    log('Uzildi (' + r + '), 30s dan keyin qayta uriniladi')
    setTimeout(start, 30000)
  })
}
start()
                              
