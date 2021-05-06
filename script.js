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