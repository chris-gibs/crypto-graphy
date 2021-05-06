let selectedCoin = "BTC"
let selectedCurrency = "USD"

const updateButton = document.querySelector("#updateButton")
updateButton.addEventListener("click", updateUserSelect)

function updateUserSelect(){
  let coinSelect = document.querySelector("#coins").selectedIndex
  selectedCoin = document.querySelectorAll(".coinOption")[coinSelect].value
  let currencySelect = document.querySelector("#currencies").selectedIndex
  selectedCurrency = document.querySelectorAll(".currencyOption")[currencySelect].value
}

function updateAPICall(){
  
  //multifull and fsyms, BTC,ETH,DOGE,XRP,USD,JPY,EUR,GBP use for multiple stuff later
  // Consider building array with values from checkbox selection pushed in, then join(",") and feed into coin/currency in link and if more than one coin, insert  and fsyms else empty string and fsym
  //clearGraph()
  let isMultiple = "?fsym"
  //
  return `https://min-api.cryptocompare.com/data/price${isMultiple}=${selectedCoin}&tsyms=${selectedCurrency}`
}

function apiCall(){
  fetch(updateAPICall())
  .then(response => response.json())
  .then(data => updateGraph(data[Object.keys(data)[0]]))
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

const updateGraph = (dataObj) => {
    console.log(dataObj)

}
