const app = Vue.createApp({
    data(){
        return {
            title: 'Welcome traveler',
            charm: 10,
            coins: 20,
            item: 0,
            myPrice: 10,
            items: [
                {name: 'stick', id: 0, price: 1},
                {name: 'apple', id: 1, price: 3},
                {name: 'magic(?) pebbles', id: 2, price: 10},
                {name: 'bandages', id: 3, price: 30},
                {name: 'lucky dice', id: 4, price: 50},
                {name: 'mana potion', id: 5, price: 80},
                {name: 'healing potion', id: 6, price: 100},
                {name: 'crystal ball', id: 7, price: 150}
            ],
            myitems: [],
            selling: {is: false, item: null},
            sellingPrice: 0,
            result: null,
            error: {is: false, message: ''}
        }
    },
    methods:{
        haggle() {
            let itemPrice = this.items[this.item].price
            if(this.charm > 1){
                let diff = itemPrice - this.myPrice
                if(diff > 0){
                    let difficulty = diff / itemPrice * 10
                    let rnd = Math.random() * 10 + 1
                    let charmModified = rnd + rnd * this.charm / 100
                    console.log(difficulty + ' = difficulty, ' + rnd + ' rnd, ' + charmModified + ' charmmodified')
                    if(charmModified > difficulty){
                        let transaction = this.subtractCoins(this.myPrice)
                        if(transaction){
                            this.myitems.push(this.items[this.item])
                            this.charm += Math.ceil(diff / 100)
                            this.result = `SOLD for ${this.myPrice}, \n
                            you saved ${diff} coins`
                        }
                    }else{
                        this.result = `attempt FAILED, try again`
                        this.charm -= Math.ceil(diff / 100)
                    }
                }else{
                    let transaction = this.subtractCoins(this.myPrice)
                    if(transaction){
                        this.myitems.push(this.items[this.item])
                        this.result = `SOLD for ${this.myPrice}, \n
                        you lost ${diff} coins`
                    }
                }                
            }else{
                console.log('ERROR, charm cannot be lower than 1!')
            }
        },
        again(){
            this.result = null
        },
        highlight(event){
            if(!event.target.className.includes("clicked")){
                let list = event.target.parentNode.childNodes
                for(li of list)li.className = 'item'
                event.target.className = "item clicked"
                this.selling.is = true
                let index = parseInt(event.target.id)
                this.selling.item = this.myitems[index]
            }else{
                event.target.className = "item"
                this.selling.is = false
            }
        },
        sell(){
            let ogPrice = this.selling.item.price
            ogPrice -= ogPrice * 0.1
            let diff = this.sellingPrice - ogPrice
            if(diff > 0){
                let difficulty = diff / ogPrice * 10
                let rnd = Math.random() * 10 + 1
                let charmModified = rnd + rnd * this.charm / 100
                console.log(`diff ${diff}, ogprice ${ogPrice}, difficulty ${difficulty}, charmmodified ${charmModified}`)
                if(charmModified > difficulty){
                    this.result = `SOLD for ${this.sellingPrice}, \n
                    you saved ${diff} coins`
                    let index = this.myitems.indexOf(this.selling.item)
                    this.myitems.splice(index, 1)
                    this.coins += parseInt(this.sellingPrice)
                    this.sellingPrice = 0
                    this.charm += Math.ceil(diff / 100)
                    this.selling.is = false
                }else{
                    this.result = `attempt FAILED, try again`
                    this.charm -= Math.ceil(diff / 100)
                }
            }else if(diff === 0){
                this.result = `SOLD for ${this.myPrice}`
                this.coins += this.myPrice
                this.selling.is = false
            }
        },
        subtractCoins(amount){
            if(this.coins < amount){
                this.error.message = 'You have too little coins!'
                this.error.is = true
                return false
            }else{
                this.coins -= amount
                return true
            }
        }
    }
})

app.mount('#app')
