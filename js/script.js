
//restrict mode
"use strict";


//global variables
const mapSerieToName = {'Saldos das operações de crédito das instituições financeiras sob controle privado nacional - Total':	'12106',
    'Saldos das operações de crédito das instituições financeiras sob controle estrangeiro - Total'	:'12150',
    'Saldos das operações de crédito das instituições financeiras sob controle público - Total'	:'2007',
    'Saldos das operações de crédito das instituições financeiras sob controle privado - Total'	:'2043',
    'Inadimplência da carteira de crédito das instituições financeiras sob controle público - Total'	:'13667',
    'Inadimplência da carteira de crédito das instituições financeiras sob controle privado nacional - Total'	:'13673',
    'Inadimplência da carteira de crédito das instituições financeiras sob controle estrangeiro - Total'	:'13679',
    'Inadimplência da carteira de crédito das instituições financeiras sob controle privado - Total'	:'13685',
    'Taxa Preferencial Brasileira'	:'20019',
    'Percentual do total de provisões em relação à carteira de crédito do Sistema Financeiro Nacional'	:'13645'}

      
async function getDataFromBacen(strSerie="20749") {
        
        const url = `https://api.bcb.gov.br/dados/serie/bcdata.sgs.${Number(strSerie)}/dados?formato=json`
        
        try {
          
          const response = await fetch(url);
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          const dataSet = await response.json();
          const x = [];
          const y = [];
          for (const i of dataSet) {

            x.push(new Date(new Date(i.data).toLocaleDateString('en-GB')));
            y.push(Number(i.valor))
        }
          const data = {x,y}
          return data;
        
        } catch (error) {
          console.error(error);
        }
      
    }

async function plotSeries(seriesName) {
    const data = await getDataFromBacen(mapSerieToName[seriesName]);
    const x = data.x;
    const y = data.y;
    const layout = {
        title: seriesName,
        xaxis: {title: 'Data'},
        yaxis: {title: 'Valor'}
    };
    Plotly.newPlot('tester', [
        {
            x,
            y
        }
    ], layout);
}

async function plotMultipleSeries(idDiv,seriesNames) {
    //add a drop down to append multiple series

    const data = await Promise.all(seriesNames.map(async (seriesName) => {
        const data = await getDataFromBacen(mapSerieToName[seriesName]);
        const x = data.x;
        const y = data.y;
        return {x,y,name:seriesName}
    }));

    const layout = {
      //add second y axis option
      yaxis2: {title: 'Valor',overlaying: 'y',side: 'right'},
      
      xaxis: {type: 'date',automargin: true,tickformat: '%m/%Y'},
      legend: { orientation: "h", yanchor: "bottom", y: 1.02, xanchor: "right", x: 1 }
    };
    console.log(data);
    Plotly.newPlot(idDiv, data, layout);
}

//add options from mapSerieToName to drop down
for (const serie in mapSerieToName) {
  const option = document.createElement('option');
  option.value = serie;
  option.innerHTML = serie;
  document.querySelector('#options-series').appendChild(option);
}

//plot multiple series from a option drop down selection using the plotMultipleSeries function
const submitButton = document.querySelector('#button-submit');
submitButton.addEventListener('click', (event) => {
  event.preventDefault();
  //create button to add more series
  const seriesName = document.querySelector('#options-series').value;
  //add element with series name and closing button
  const div = document.createElement('div');
  div.innerHTML = `<span id = serie-${mapSerieToName[seriesName]}>${seriesName}</span><button id="close-btn-${mapSerieToName[seriesName]}">X</button>`;
  console.log(div);
  document.querySelector('.grafico').appendChild(div);
});

//delete series from div if close button is clicked
document.querySelector('.grafico').addEventListener('click', (event) => {
  if (event.target.tagName === 'BUTTON') {
    const id = event.target.id;
    const serieId = id.split('-')[2];
    const serie = document.querySelector(`#serie-${serieId}`);
    serie.parentNode.removeChild(serie);
    event.target.parentNode.removeChild(event.target);
  }});

  //plot all series from div whenever add button or close button is clicked
  document.querySelector('.grafico').addEventListener('click', (event) => {
    const seriesNames = [];
    const series = document.querySelectorAll('.grafico span');
    for (const serie of series) {
      seriesNames.push(serie.innerHTML);
    };
    plotMultipleSeries('grafico-1',seriesNames);
  });



  
  





//plotMultipleSeries('grafico-1',['Inadimplência da carteira de crédito das instituições financeiras sob controle público - Total', 'Inadimplência da carteira de crédito das instituições financeiras sob controle privado nacional - Total', 'Inadimplência da carteira de crédito das instituições financeiras sob controle estrangeiro - Total']);

