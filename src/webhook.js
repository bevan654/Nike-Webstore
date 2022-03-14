const axios = require('axios')

let zz = ['https://discord.com/api/webhooks/928638864787124304/VGwB9leqyodHNioJmfDaiHlbr-IpQIINxWoFma-mk9mOlIQVQSfYy8G4iF1x49wWKVyz','https://discord.com/api/webhooks/919075804493799495/zG5dpezKEHgIOTJeDZjqjvB3T_CoCJk7AKC0G2j7ETzk91Dn5D5bMtWQUFswO4RP24cx']
class Webhook {
    constructor(data){
        this.data = data
        this.status_color = this.data.status === "ACTIVE" ? '🟢' : '🔴' + 

        console.log(this.data)
        this.stock = Object.keys(this.data.stock)
        this.stock_desc = ''
        for(var i = 0; i < this.stock.length;i++){
            this.stock_desc = this.stock_desc + `${this.stock[i]} - ${this.data.stock[this.stock[i]]}\n`
        }

    }

    send_webhook = async () => {
        let k = {
            "username": "GenesisAIO",
            "avatar_url": "https://media.discordapp.net/attachments/904022469512396861/904022677109497907/Genesis_AIO_logo_black.png?width=676&height=676",
            "embeds": [
              {
                "author": {
                  "name": "https://www.nike.com/au/",
                  "icon_url": "https://media.discordapp.net/attachments/904022469512396861/904022677109497907/Genesis_AIO_logo_black.png?width=676&height=676"
                },
                "title": this.data.name,
                "url": `https://www.nike.com/au/t/-/${this.data.sku}`,
                "description": this.data.colorway,
                "color": 10038562,
                "fields": [
                    {
                        "name":"Status",
                        "value":this.status_color+'`'+this.data.status+'`',
                        "inline":true
                    },
                    {
                        "name": "Price",
                        "value": '💰`'+this.data.price+'`',
                        "inline":true
                    }, 
                    {
                        "name":"Cart Limit",
                        "value":'`'+this.data.quantityLimit+'`',
                        "inline":true
                    },
                    {
                        "name":"SKU",
                        "value": '`'+this.data.sku+'`',
                        "inline":true
                    },
                    {
                        "name": "Stock",
                        "value": this.stock_desc,
                        "inline": false
                    },
                    {
                        "name":"Links",
                        "value": `**[StockX](https://stockx.com/search?s=${this.data.sku})**`,
                        "inline":false
                    }
                ],
                "thumbnail": {
                  "url": this.data.image
                },
                "footer": {
                  "text": "Powered By Genesis",
                  "icon_url": "https://media.discordapp.net/attachments/904022469512396861/904022677109497907/Genesis_AIO_logo_black.png?width=676&height=676"
                }
              }
            ]
          }

        for(var i = 0; i < zz.length; i++){
            try{
                await axios.post(zz[i],k)
            }catch(err){
                console.log(err)
            }
        }
    }
}


module.exports = Webhook