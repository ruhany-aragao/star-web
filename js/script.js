
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
            x.push(new Date(i.data));
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
    //plotSeries('Saldos das operações de crédito das instituições financeiras sob controle privado nacional - Total');

async function plotMultipleSeries(seriesNames) {
    
    const arrayBacenData = {}
    
    //get promise from API
    for(const i=0; i<seriesNames.length; i++){
      let arrayData = {};
      arrayData = await getDataFromBacen(mapSerieToName[seriesNames[i]]);
      arrayBacenData[seriesNames[i]] = arrayData;
    }
    //create series
    const series = []
    for(const i=0; i<seriesNames.length; i++){
        series.push({
            x: arrayBacenData[seriesNames[i]].x,
            y: arrayBacenData[seriesNames[i]].y,
            name: seriesNames[i]})
    }
    //create layout
    const layout = {
        title: 'Série Temporal',
        xaxis: {title: 'Data'},
        yaxis: {title: 'Valor'}
    };

    //Plot
    Plotly.newPlot('tester', series, layout);
}




    
  plotMultipleSeries(['Saldos das operações de crédito das instituições financeiras sob controle privado nacional - Total','Taxa Preferencial Brasileira']);