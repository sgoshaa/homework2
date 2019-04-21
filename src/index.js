import "babel-polyfill";
import Chart from "chart.js";

//const currencyURL = "www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml";
//const meteoURL = "/xml.meteoservice.ru/export/gismeteo/point/140.xml";
const meteoURL = "/xml.meteoservice.ru/export/gismeteo/point/140.xml";
/*const resultatArray=new Array();
async function loadCurrency() {
  const response = await fetch(meteoURL);
  
  const xmlTest = await response.text();
  
  const parser = new DOMParser();

  const currencyData = parser.parseFromString(xmlTest, "text/xml");
  // <Cube currency="USD" rate="1.1321" />
  const forecasts = currencyData.querySelectorAll("FORECAST");
  const temperatures = currencyData.querySelectorAll("TEMPERATURE");
  const heat = currencyData.querySelectorAll("HEAT");
  
  const resultForecast = Object.create(null);
  
  const weakSet = new WeakSet();
  //прогрнозы
 
  for (let i = 0; i < forecasts.length; i++) {
    const forecastTag = forecasts.item(i);
    const hour = forecastTag.getAttribute("hour");
    const temperaturaTag = temperatures.item(i);
    const maxTemp = Number.parseInt(temperaturaTag.getAttribute("max"));
    const minTemp = Number.parseInt(temperaturaTag.getAttribute("min"));
    const srtemperatura = (maxTemp+minTemp)/2;

    const heatTag = heat.item(i);
    const maxHeat = Number.parseInt(heatTag.getAttribute("max"));
    const minHeat = Number.parseInt(heatTag.getAttribute("min"));
    const srHeat = (maxHeat+minHeat)/2;

    var resultat = new Object();

    resultForecast[hour] = srtemperatura.toString();
    resultat.hour = hour;
    resultat.temperatura = srtemperatura.toString();
    resultat.heat = srHeat.toString();
    weakSet.add(resultat);

    resultatArray[i]=resultat;

  }
  //result["EUR"] = 1;
   //result["RANDOM"] = 1 + Math.random();
  //return resultForecast; //resultatArray;
 return resultatArray;
 // return weakSet;  
}*/
/*
 function normalizeDataByCurrency(data, currency) {
  const result = Object.create(null);
  const value = data[currency];
  for (const key of Object.keys(data)) {
    result[key] = value / data[key];
  }
  return result;
 }*/

const buttonBuild = document.getElementById("btn");
const canvasCtx = document.getElementById("out").getContext("2d");
buttonBuild.addEventListener("click", async function(){
  //const currencyData1 = await loadCurrency();
  //const normalData = normalizeDataByCurrency(currencyData, "RUB");
  /*const keys = Object.keys(normalData).sort((k1, k2) =>
    compare(normalData[k1], normalData[k2])
  );*/
//начало куска
  const response = await fetch(meteoURL);
  
  const xmlTest = await response.text();
  
  const parser = new DOMParser();

  const meteoData = parser.parseFromString(xmlTest, "text/xml");
  // <Cube currency="USD" rate="1.1321" />
  const forecasts = meteoData.querySelectorAll("FORECAST[hour]");
  const temperatures = meteoData.querySelectorAll("TEMPERATURE[max][min]");
  const heat = meteoData.querySelectorAll("HEAT[max][min]");
  
  const resultForecast = Object.create(null);
  
  const weakSet = new WeakSet();
  //прогнозы
  const arrLabels = new Array();
  const arrTemp = new Array();
  const arrHeat = new Array();

  for (let i = 0; i < forecasts.length; i++) {
    const forecastTag = forecasts.item(i);
    const hour = forecastTag.getAttribute("hour");
    const temperaturaTag = temperatures.item(i);
    const maxTemp = Number.parseInt(temperaturaTag.getAttribute("max"));
    const minTemp = Number.parseInt(temperaturaTag.getAttribute("min"));
    const srtemperatura = (maxTemp+minTemp)/2;

    const heatTag = heat.item(i);
    const maxHeat = Number.parseInt(heatTag.getAttribute("max"));
    const minHeat = Number.parseInt(heatTag.getAttribute("min"));
    const srHeat = (maxHeat+minHeat)/2;

    arrLabels[i] = hour;
    arrTemp[i]   = srtemperatura;
    arrHeat[i]   = srHeat;
  }
    //конец

  
 
 // const keys = Object.keys(currencyData1);
  //const plotData = Object.values(currencyData1); 
 // keys.map(key => resultForecast[key]);
  const labelsData = arrLabels;
  const plotData = arrTemp;
  const plotData1 = arrHeat;
  //const plotData1 = ["+6","-5","+10","+5"];
  //= keys.map(key => normalData[key]);
  var dataFirst = {
    label: "Температура воздуха по ощущениям",
   // backgroundColor: "rgb(24, 240, 46)",
    borderColor: "rgb(180, 0, 0)",
    data: plotData1,
    lineTension: 0.3,
    // Set More Options
  };
     
  var dataSecond = {
    label: "Температура воздуха в градусах,С",
    //backgroundColor: "rgb(255, 20, 20)",
    borderColor: "rgb(180, 200, 0)",
   // label: "Температура",
    data: plotData,
    // Set More Options
  };

  const chartConfig = {
    type: "line",

    data: {
      labels: labelsData,
      //labels: keys,
     // labels:["21","03","09","15"],
      datasets: [dataFirst,dataSecond]
      
    }
  };

  

  if (window.chart) {
    chart.data.labels = chartConfig.data.labels;
    chart.data.datasets[0].data = chartConfig.data.datasets[0].data;
    chart.update({
      duration: 800,
      easing: "easeOutBounce"
    });
  } else {
    window.chart = new Chart(canvasCtx, chartConfig);
    //window.chart = new Chart(canvasCtx, chartConfig);
  }
});

/*function compare(a, b) {
  if (a > b) return 1;
  if (a < b) return -1;
  return 0;
} */
