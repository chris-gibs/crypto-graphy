let selectedCoin = "BTC"
let selectedCurrency = "USD"
let alertValues = []

const updateButton = document.querySelector("#updateButton")
updateButton.addEventListener("click", updateUserSelect)

function updateUserSelect(){
  let coinSelect = document.querySelector("#coins").selectedIndex
  selectedCoin = document.querySelectorAll(".coinOption")[coinSelect].value
  let currencySelect = document.querySelector("#currencies").selectedIndex
  selectedCurrency = document.querySelectorAll(".currencyOption")[currencySelect].value
  clearGraph()
  
}

function updateAPICall(){
  //multifull and fsyms required for multiple coins
  return `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${selectedCoin}&tsyms=${selectedCurrency}`
}

function specialAlert(value){
  //console.log(value)
  alertValues[alertValues.length] = value
  if (alertValues.length == 3){
    if (alertValues[0] < alertValues[1] && alertValues[1] < alertValues[2]){
      alert("To The Moon!")
    }
    if (alertValues[0] > alertValues[1] && alertValues[1] > alertValues[2]){
      alert("Buy The Dips!")
    }
  }
  //console.log(alertValues)
  alertValues.shift()
}

function updateStats(data){
  let marketCap = document.querySelector("#market-cap")
  let high = document.querySelector("#market-cap")
  let low = document.querySelector("#market-cap")

  marketCap.innerText = `Market Cap: ${data["MKTCAP"]}`
  high.innerText = `24-hour High: ${data["HIGHDAY"]}`
  low.innerText = `24-hour low: ${data["LOWDAY"]}`
}

function apiCall(){
  fetch(updateAPICall())
  .then(response => response.json())
  .then(data => {
    //console.log(data)
    console.log(data["DISPLAY"][selectedCoin][selectedCurrency]["FROMSYMBOL"])

    updateStats(data["DISPLAY"][selectedCoin][selectedCurrency])
    updateGraph(data["RAW"][selectedCoin][selectedCurrency]["PRICE"]),
    specialAlert(data[Object.keys(data)[0]])
  })
  .catch(error => error.message)
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
        height: 350,
        width: 1000,
        animations: {
            enabled: false
        }
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

setInterval(apiCall, 2000)