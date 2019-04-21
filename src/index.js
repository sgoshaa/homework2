import "babel-polyfill";
import Chart from "chart.js";

//const currencyURL = "www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml";
//const meteoURL = "/xml.meteoservice.ru/export/gismeteo/point/140.xml";
const meteoURL = "/xml.meteoservice.ru/export/gismeteo/point/140.xml";
//не удалось вернуть массив объектов
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
//начало получаем и парсим
  const response = await fetch(meteoURL);
  const xmlTest = await response.text();
  const parser = new DOMParser();

  const meteoData = parser.parseFromString(xmlTest, "text/xml");
  const forecasts = meteoData.querySelectorAll("FORECAST");
  const temperatures = meteoData.querySelectorAll("TEMPERATURE");
  const heat = meteoData.querySelectorAll("HEAT");
 
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
  const labelsData = arrLabels;
  const plotData = arrTemp;
  const plotData1 = arrHeat;
  
  var dataFirst = {
    label: "Температура воздуха по ощущениям,С",
    backgroundColor: "rgb(222, 40, 40)",
    borderColor: "rgb(128, 5, 5)",
    labelString: "Температура ,С",
    data: plotData1,
  };
     
  var dataSecond = {
    label: "Температура воздуха,С",
    backgroundColor: "rgb(10, 204, 30)",
    borderColor: "rgb(8, 153, 22)",
   // label: "Температура",
    data: plotData,
    };

  const chartConfig = {
    type: "line",
    options:
    {
      scales: {
        xAxes: [
        {
        gridLines: {
          display: true,
          color: "black",
          borderDash: [2, 5],
        },
        scaleLabel: {
          display: true,
          fontColor:"grey",
          labelString: "Время в часах",
        }
      }],
      yAxes: [{
        gridLines: {
          color: "black",
          display:true,
          borderDash: [2, 5],
        },
        scaleLabel: {
          display: true,
          fontColor:"grey",
          labelString: "Температура,C",
        }
      }]
    }
    },

    data: {
      labels: labelsData,
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
  }
});

/*function compare(a, b) {
  if (a > b) return 1;
  if (a < b) return -1;
  return 0;
} */
