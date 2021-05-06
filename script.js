let graphSelection = [["BTC", "USD"]]

const updateButtons = document.querySelectorAll(".updateButton")
updateButtons.forEach(button => {
  button.addEventListener("click", updateUserSelect)
})

function updateUserSelect(event){
  const parent = event.target.parentNode
  let coinSelect = parent.querySelector(".coins").selectedIndex
  selectedCoin = parent.querySelectorAll(".coins > option")[coinSelect].value
  let currencySelect = parent.querySelector(".currencies").selectedIndex
  selectedCurrency = parent.querySelectorAll(".currencies > option")[currencySelect].value
  console.log(parent)
  console.log(coinSelect)
  console.log(selectedCoin)
  console.log(currencySelect)
  console.log(selectedCurrency)
}

function updateAPICall(){
  
  //multifull and fsyms, BTC,ETH,DOGE,XRP,USD,JPY,EUR,GBP use for multiple stuff later
  // Consider building array with values from checkbox selection pushed in, then join(",") and feed into coin/currency in link and if more than one coin, insert  and fsyms else empty string and fsym
  
  let isMultiple = "?fsym"
  //
  return `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=BTC,ETH&tsyms=USD,EUR`
  //`https://min-api.cryptocompare.com/data/price${isMultiple}=${selectedCoin}&tsyms=${selectedCurrency}`
}

function handleData(data){
  console.log(data)
  console.log(Object.entries(data["RAW"]))
}

function apiCall(){
  fetch(updateAPICall())
  .then(response => response.json())
  .then(handleData)
  .then(updateGraph)
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
        width: 700,
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