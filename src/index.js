import "babel-polyfill";
import Chart from "chart.js";

//const currencyURL = "www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml";
//const meteoURL = "/xml.meteoservice.ru/export/gismeteo/point/140.xml";
const meteoURL = "/xml.meteoservice.ru/export/gismeteo/point/140.xml";

function toParseMeteo(xmltext,tag) {

  const resultatArray=Object.create(null);
  const parser = new DOMParser();

  const meteoData = parser.parseFromString(xmltext, "text/xml");
  const forecasts = meteoData.querySelectorAll("FORECAST");
  const weatherData = meteoData.querySelectorAll(tag);
  //const heat = meteoData.querySelectorAll("HEAT");
  for (let i = 0; i < forecasts.length; i++) {
    const forecastTag = forecasts.item(i);
    const hour = forecastTag.getAttribute("hour");
    const temperaturaTag = weatherData.item(i);
    const maxTemp = Number.parseInt(temperaturaTag.getAttribute("max"));
    const minTemp = Number.parseInt(temperaturaTag.getAttribute("min"));
    const srtemperatura = (maxTemp+minTemp)/2;
    resultatArray[hour]=srtemperatura;
  }
  return resultatArray;
 }

const buttonBuild = document.getElementById("btn");
const canvasCtx = document.getElementById("out").getContext("2d");
buttonBuild.addEventListener("click", async function(){
  const response = await fetch(meteoURL);
  const xmlTest = await response.text();
  const tempData = toParseMeteo(xmlTest,"TEMPERATURE");
  const heatData = toParseMeteo(xmlTest,"HEAT");

  //const plotData = keys.map(key => normalData[key]);
  const labelsData = Object.keys(tempData);
  const plotData =  labelsData.map(key =>tempData[key]);
  const plotData1 = labelsData.map(key =>heatData[key]);
  
  var dataFirst = {
    label: "Температура воздуха по ощущениям,С",
    backgroundColor: "rgb(222, 40, 40)",
    borderColor: "rgb(128, 5, 5)",
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