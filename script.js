let selectedCurrency = "USD"
let selectedCoins = []
let coinData = {}
//let alertValues = []

const updateButton = document.querySelector("#updateButton")
updateButton.addEventListener("click", updateUserSelect)

function updateUserSelect(){
  selectedCoins = [] //clear array
  let checkboxes = document.querySelectorAll('input[type="checkbox"]')
  checkboxes.forEach(checkbox => {
    if (checkbox.checked){ //if checked is true
      selectedCoins.push(checkbox.id) //put string of coin into array
    }
  })

  let currencySelect = document.querySelector("#currencies").selectedIndex
  selectedCurrency = document.querySelectorAll(".currencyOption")[currencySelect].value
  clearGraph()
}

function updateAPICall(){
  //multifull and fsyms required for multiple coins, this works!
  selectedCoins.length > 1 ? isMulti = "multifull?fsyms" : isMulti = "?fsym"
  return `https://min-api.cryptocompare.com/data/price${isMulti}=${selectedCoins.join(",")}&tsyms=${selectedCurrency}`
}

// function specialAlert(value){
//   console.log(value)
//   alertValues[alertValues.length] = value
//   if (alertValues.length == 3){
//     if (alertValues[0] < alertValues[1] && alertValues[1] < alertValues[2]){
//       alert("To The Moon!")
//     }
//     if (alertValues[0] > alertValues[1] && alertValues[1] > alertValues[2]){
//       alert("Buy The Dips!")
//     }
//   }
//   console.log(alertValues)
//   alertValues.shift()
// }

function apiCall(){
  fetch(updateAPICall())
  .then(response => response.json())
  .then(data => {
    selectedCoins.forEach((coin) => {
      coinData[coin] = data["RAW"][coin][selectedCurrency]["PRICE"]
    })
    updateGraph(coinData)
    //specialAlert(data[Object.keys(data)[0]])
  })
  .catch(error => error.message)
}

const BTCLineDiv = document.getElementById("btc-line")
const BTCPercentDiv = document.getElementById("btc-percent")

const BTCLineOptions = {
    series: [{
        data: [{
          x: 5,
          y: 5
        },
        {
          x: 10,
          y: 10
        }]
    },{
      data: [{
        x: 15,
        y: 15
      },{
        x: 20,
        y: 20
      }]
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
// Update this function to allow for multiple lines, create a forEach loop and feed it an object with coin name for key and a value of object holding currency for key and price for value. We will need to give each a colour and display a key for each colour
const updateGraph = (coinData) => {
    const time = new Date
    const timeString = `${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`
    const graphData = {
        yValues: BTCLine.data.twoDSeries,
        xValues: BTCLine.data.twoDSeriesX
    }
    Object.entries(coinData).forEach(entry => {
      updateLine(graphData, entry[1], timeString)
      updatePercent(graphData, entry[1], timeString)
    })
    
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
        console.log(objArray)
        BTCLine.appendData(objArray)
        

        // BTCLine.updateSeries([{
        //   data: objArray
        // }])
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