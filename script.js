let selectedCoin = "BTC"
let selectedCurrency = "USD"
let currentStatus = "Steady"
const coinImage = {
  "BTC": "./images/bitcoin-logo.svg",
  "ETH": "./images/ethereum-logo.svg",
  "DOGE": "./images/dogecoin-logo.svg",
  "XRP": "./images/xrp-logo.svg"
}

let img = document.querySelector("img")
let currentPrice = document.querySelector("#current-price")
let status = document.querySelector("#status")
let marketCap = document.querySelector("#market-cap")
let high = document.querySelector("#high")
let low = document.querySelector("#low")
const BTCLineDiv = document.getElementById("btc-line")
const BTCPercentDiv = document.getElementById("btc-percent")
const updateButton = document.querySelector("#updateButton")
updateButton.addEventListener("click", updateUserSelect)

const BTCLineOptions = {
  series: [{
      name: "Current Price",
      data: []
  }],
  chart: {
      id: 'btc-line',
      group: 'btc',
      type: 'line',
      height: 350,
      width: 1000,
      animations: {
          enabled: false
      }
  },
  markers: {
      size: 5
  },
  theme: {
      mode: 'dark'
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
      name: "% change",
      data: []
  }],
  chart: {
      id: 'btc-percent',
      group: 'btc',
      type: 'line',
      height: 350,
      width: 1000,
      animations: {
          enabled: false
      }
  },
  markers: {
      size: 5
  },
  theme: {
      mode: 'dark'
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

//Needs work
function specialAlert(slicedArray){
  //console.log(slicedArray[0]["y"])
  if (slicedArray.length == 3){
    if (slicedArray[0]["y"] < slicedArray[1]["y"] && slicedArray[1]["y"] < slicedArray[2]["y"]){
      console.log("To The Moon!")
      currentStatus = "To The Moon!"
    } else if (slicedArray[0]["y"] > slicedArray[1]["y"] && slicedArray[1]["y"] > slicedArray[2]["y"]){
      console.log("Buy The Dip!")
      currentStatus = "Buy The Dip!"
    } else {
      currentStatus = "Steady"
    }
  }
}

function priceColour(data){
  if (data["PRICE"] > data["HIGH24HOUR"]){
    currentPrice.style.color = "lightgreen"
  } else if (data["PRICE"] < data["LOW24HOUR"]){
    currentPrice.style.color = "red"
  }
}

function updateStats(displayData){
  img.src = coinImage[selectedCoin]
  currentPrice.innerText = displayData["PRICE"]
  status.innerText = currentStatus
  marketCap.innerText = displayData["MKTCAP"]
  high.innerText = displayData["HIGH24HOUR"]
  low.innerText = displayData["LOW24HOUR"]
}

function updateUserSelect(){
  let coinSelect = document.querySelector("#coins").selectedIndex
  selectedCoin = document.querySelectorAll(".coinOption")[coinSelect].value
  let currencySelect = document.querySelector("#currencies").selectedIndex
  selectedCurrency = document.querySelectorAll(".currencyOption")[currencySelect].value
  clearGraph()
}

function updateAPICall(){
  return `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${selectedCoin}&tsyms=${selectedCurrency}`
}

function apiCall(){
  fetch(updateAPICall())
  .then(response => response.json())
  .then(data => {
    updateStats(data["DISPLAY"][selectedCoin][selectedCurrency])
    updateGraph(data["RAW"][selectedCoin][selectedCurrency]["PRICE"])
    priceColour(data["RAW"][selectedCoin][selectedCurrency])
  })
  .catch(error => error.message)
}

const updateGraph = (price) => {
    const time = new Date
    const timeString = `${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`
    const graphData = {
        yValues: BTCLine.data.twoDSeries,
        xValues: BTCLine.data.twoDSeriesX
    }
    updateLine(graphData, price, timeString)
    updatePercent(graphData, price, timeString)
}

const updatePercent = (graphData, newPrice, timeString) => {
    // convert array of prices into array of percentages
    graphData.yValues.push(newPrice)
    graphData.xValues.push(timeString)
    percentArray = graphData.yValues.map((value, index, array) => {
        if (index == 0) return 0
        return ((array[index] - array[index-1]) / array[index-1] * 100).toFixed(4)
        
    })
    const objArray = []
    for(i=0;i<graphData.yValues.length; i++){
        objArray.push({
            x: graphData.xValues[i],
            y: percentArray[i]
        })
    }

    if(objArray.length > 10) objArray.shift()
    BTCPercent.updateSeries([{
        data: objArray
    }])
    
}
const updateLine = (graphData, newPrice, timeString) => {
    if(graphData.yValues.length < 10){
        BTCLine.appendData([{
            data: [{
                x: timeString,
                y: newPrice
                
            }]
        }])
    } else{
        const objArray = []
        for(i = 1; i < graphData.yValues.length; i++)
        objArray.push({
            x: graphData.xValues[i],
            y: graphData.yValues[i]
        })
        objArray.push({
            x: timeString,
            y: newPrice
        })
        BTCLine.updateSeries([{
            data: objArray
        }])
        //specialAlert(objArray.slice(-3))
    }
}
const clearGraph = () => {
    BTCLine.updateSeries([{
        data: []
    }]),
    BTCPercent.updateSeries([{
        data: []
    }])
}

setInterval(apiCall, 12000)