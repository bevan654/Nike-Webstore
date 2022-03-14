const EventEmitter = require('events')
const axios = require('axios');
const delay = ms => new Promise(res => setTimeout(res, ms));


class Monitor extends EventEmitter {
    constructor(sku){
        super();
        this.sku = sku
        this.first_run = true;

        this.status = ''
        this.stock = {}
        
        this.logger("STARTING MONITOR!")
        this.start_monitor()
    }

    logger = text => {
        console.log(`[${this.sku}] ${text}`)
    }

    start_monitor = async () => {
        let notify = false
        try{
            
            var response = await axios.get(`https://api.nike.com/product_feed/threads/v2?filter=exclusiveAccess(true,false)&filter=channelId(d9a5bc42-4b9c-4976-858a-f159cf99c647)&filter=marketplace(AU)&filter=language(en-GB)&filter=publishedContent.properties.products.styleColor(${this.sku})`,{proxy:{
                host:"p.webshare.io",
                port:80,
                auth:{
                    username: "ypzhxhci-rotate",
                    password: "37kozkt6pptg"
                }
            }})

        }catch(err){

            return this.start_monitor()
        }

        if(response.status == 200){
            try{
                response = response.data.objects[0]
            }catch(err){
                this.logger('[MON ERR] '+err)
                return this.start_monitor()
            }
            for(var i =0; i < response.productInfo[0].skus.length;i++){
                if(!this.stock.hasOwnProperty(response.productInfo[0].skus[i].nikeSize)){
                    this.first_run === false ? this.logger(`[SIZES UPDATE] ${response.productInfo[0].skus[i].nikeSize} :: ${this.stock[response.productInfo[0].skus[i].nikeSize]} --> ${response.productInfo[0].availableSkus[i].level}`) : null
                    this.stock[response.productInfo[0].skus[i].nikeSize] = response.productInfo[0].availableSkus[i].level
                    notify = this.first_run === false ? true : false


                }else{
                    if(this.stock[response.productInfo[0].skus[i].nikeSize] !== response.productInfo[0].availableSkus[i].level){
                        
                        this.first_run === false ? this.logger(`[SIZES UPDATE] ${response.productInfo[0].skus[i].nikeSize} :: ${this.stock[response.productInfo[0].skus[i].nikeSize]} --> ${response.productInfo[0].availableSkus[i].level}`) : null
                        this.stock[response.productInfo[0].skus[i].nikeSize] = response.productInfo[0].availableSkus[i].level

                        if(response.productInfo[0].availableSkus[i].level != 'OOS'){ 
                            notify = this.first_run === false ? true : false
                        }
                    }
                }
            }

            if(response.productInfo[0].merchProduct.status != this.status){
                if(!this.first_run){
                    this.logger(`[STATUS CHANGE] ${this.status} --> ${response.productInfo[0].merchProduct.status}`)
                    notify = this.first_run === false ? true : false
                }

                this.status = response.productInfo[0].merchProduct.status
            }

            let productInfo = response.productInfo[0]
            if(notify){
                this.emit("SIZES CHANGES",{
                    "id":productInfo.merchProduct.id,
                    "status":productInfo.merchProduct.status,
                    "sku":this.sku,
                    "name":productInfo.productContent.fullTitle,
                    "quantityLimit":productInfo.merchProduct.quantityLimit,
                    "price":productInfo.merchPrice.currentPrice,
                    "slug":productInfo.productContent.slug,
                    "colorway":productInfo.productContent.colorDescription,
                    'image':productInfo.imageUrls.productImageUrl,
                    'stock':this.stock})
            }

         

            await delay(5000);
            this.first_run = false;
            return this.start_monitor()
            
            
        }
    }
}


module.exports = Monitor;

