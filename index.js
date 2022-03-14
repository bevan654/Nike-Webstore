const Monitor = require('./src/monitor.js')
const Webhook = require('./src/webhook.js')
const fs = require('fs')

let products = []
fs.readFileSync('./products.txt','utf-8').replaceAll('\r','').split('\n').forEach((product) => {
    products.push(product)
})


for(var i = 0; i < products.length;i++){
    var k = new Monitor(products[i])
    k.on('SIZES CHANGES',(data) => {
        new Webhook(data).send_webhook()
    }) 
}
