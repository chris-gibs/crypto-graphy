<<<<<<< HEAD
function grabData(data){
  let currencyName = data.RAW.BTC.USD.TOSYMBOL
  let currencySymbol = data.DISPLAY.BTC.USD.TOSYMBOL
  let coinName = data.RAW.BTC.USD.FROMSYMBOL
  let coinSymbol = data.DISPLAY.BTC.USD.FROMSYMBOL
  let price = data.RAW.BTC.USD.PRICE
}

function apiCall(){
  let API = "https://min-api.cryptocompare.com/data/pricemultifull?fsyms=BTC,ETH,DOGE,XRP&tsyms=USD,JPY,EUR,GBP"
  fetch(API)
  .then(data => JSON.parse(data))
  .then(data => grabData(data))
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
