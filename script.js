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
        height: 300,
        animations: {
            enabled: false
        }
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
        height: 300,
        animations: {
            enabled: false
        }
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
        return (array[index] - array[index-1]) / array[index-1] * 100
        
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
    }])
}
