<<<<<<< HEAD
<<<<<<< HEAD
=======
//let "BTC": BTC

function changeAPICall(){
  let coins = ["BTC", "ETH", "DOGE", "XRP"]
  let currencies = [USD,JPY,EUR,GBP]
  let API = "https://min-api.cryptocompare.com/data/pricemultifull?fsyms=BTC,ETH,DOGE,XRP&tsyms=USD,JPY,EUR,GBP"
}

>>>>>>> added object data in grabData and updated apiCall to send that object to updateGraph
function grabData(data){
  let coinData = {
    currencyName: data.RAW.BTC.USD.TOSYMBOL,
    currencySymbol: data.DISPLAY.BTC.USD.TOSYMBOL,
    coinName: data.RAW.BTC.USD.FROMSYMBOL,
    coinSymbol: data.DISPLAY.BTC.USD.FROMSYMBOL,
    price: data.RAW.BTC.USD.PRICE
  }
  return coinData
}

function apiCall(){
  let API = "https://min-api.cryptocompare.com/data/pricemultifull?fsyms=BTC,ETH,DOGE,XRP&tsyms=USD,JPY,EUR,GBP"
  fetch(API)
  .then(data => JSON.parse(data))
  .then(data => grabData(data))
<<<<<<< HEAD
  .then(data => console.log(data))
}
=======
const BTCLineDiv = document.getElementById("btc-line")

const BTCLineOptions = {
    series: [{
        data: [{
            x: 5,
            y: 5
        },{
            x: 10,
            y: 10
        }]
    }],
    chart: {
        id: 'btc-line',
        group: 'btc',
        type: 'line',
    },
    yaxis: {
        labels: {
            minWidth: 40
        }
  }
}

let BTCLine = new ApexCharts(BTCLineDiv, BTCLineOptions)
BTCLine.render()
>>>>>>> added cdn to index.html and basic line graph to js
=======
  .then(data => updateGraph(data))
}

setInterval(apiCall, 12000)
>>>>>>> added object data in grabData and updated apiCall to send that object to updateGraph
