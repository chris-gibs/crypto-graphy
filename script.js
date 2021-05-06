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
  //let API = "https://min-api.cryptocompare.com/data/pricemultifull?fsyms=BTC,ETH,DOGE,XRP&tsyms=USD,JPY,EUR,GBP"
  const coins = {
    BTC: "BTC",
    ETH: "ETH",
    DOGE: "ETH",
    XRP: "XRP"
  }
  const currencies = {
    USD: "USD",
    JPY: "JPY",
    EUR: "EUR",
    GBP: "GBP"
  }
  const api = ()=> {
    return "https://min-api.cryptocompare.com/data/pricemultifull?fsyms=BTC,ETH,DOGE,XRP&tsyms=USD,JPY,EUR,GBP"
  }
  fetch(api())
  .then(data => data.json())
  .then(data => grabData(data))
  .then(data => updateGraph(data))
}

const BTCLineDiv = document.getElementById("btc-line")
const BTCPercentDiv = document.getElementById("btc-percent")

const BTCLineOptions = {
    series: [{
        data: []
    }],
    chart: {
        id: 'btc-line',
        group: 'btc',
        type: 'line',
        height: 300
    },
    noData: {
        text: "loading..."
    },
    yaxis: {
        labels: {
            minWidth: 40
        }
  }
}
const BTCPercentOptions = {
    series: [{
        data: []
    }],
    chart: {
        id: 'btc-percent',
        group: 'btc',
        type: 'line',
        height: 300
    },
    noData: {
        text: "loading..."
    },
    yaxis: {
        labels: {
            minWidth: 40
        }
  }
}
let BTCPercent = new ApexCharts(BTCPercentDiv, BTCPercentOptions)
BTCPercent.render();
let BTCLine = new ApexCharts(BTCLineDiv, BTCLineOptions)

BTCLine.render()

setInterval(apiCall, 2000)