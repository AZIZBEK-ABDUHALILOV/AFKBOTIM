const mineflayer = require('mineflayer')
const http = require('http')

const HOST = process.env.MC_HOST || 'seni_oldiraman.aternos.me'
const PORT = parseInt(process.env.MC_PORT || '35104')
const USERNAME = process.env.MC_USER || 'AFK_Bot'

// Render uchun health-check server (UptimeRobot shu URL'ni ping qiladi)
let status = 'starting'
http.createServer((_, res) => res.end('AFK bot: ' + status))
  .listen(process.env.PORT || 3000)

function start() {
  status = 'connecting'
  const bot = mineflayer.createBot({ host: HOST, port: PORT, username: USERNAME })

  bot.once('spawn', () => {
    status = 'online'
    console.log('Serverga kirdi')
    setInterval(() => {
      bot.setControlState('jump', true)
      setTimeout(() => bot.setControlState('jump', false), 300)
      bot.look(Math.random() * Math.PI * 2, 0)
    }, 30000)
  })

  bot.on('kicked', r => console.log('Kick:', JSON.stringify(r)))
  bot.on('error', e => console.log('Xato:', e.message))
  bot.on('end', () => {
    status = 'offline, retrying'
    console.log('Uzildi, 30s dan keyin qayta uriniladi')
    setTimeout(start, 30000)
  })
}
start()
