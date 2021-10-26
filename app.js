//build graph from samples.json

function graphs(sample){
  d3.json("samples.json").then((data)=> {
    var samples= data.samples;
    //filter samples
    var sampleArray= samples.filter(sampleobject => 
      sampleobject.id == sample);
    var sample_result= sampleArray[0];

    var ids = sample_result.otu_ids;
    var labels = sample_result.otu_labels;
    var values = sample_result.sample_values;
    var barData =[{
      y:ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(),
      x:values.slice(0,10).reverse(),
      text:labels.slice(0,10).reverse(),
      type:"bar",
      orientation:"h"
    }];
  

    var barLayout ={
      title: "Top 10 Microbial Species Found"
    };
  
    Plotly.newPlot("bar", barData, barLayout);

    //bubble chart
    var bubbleData=[{
      x: ids,
      y:values,
      text: labels,
      mode:'markers',
      marker:{
        size: values,
        color: ids,
        colorscale: 'Jet'
      }
    }];

    var bubbleLayout = {
      title:"Microbial Species"
    };

    Plotly.newPlot("bubble", bubbleData, bubbleLayout);
  });   
}


//pull metadata from samples.json
function metaData(sample){
  d3.json("samples.json").then((data)=> {
    var metadata = data.metadata;
    //filter for microbe
    var sampleArray = metadata.filter(sampleobject => 
      sampleobject.id == sample);
    var sample_result= sampleArray[0];
    //select to fill table
    var metatable = d3.select("#sample-metadata");
    //clear for new choice
    metatable.html("");

    //add key and value pairs to chart
    Object.entries(sample_result).forEach(([key, value]) => {
      metatable.append("h6").text(`${key}: ${value}`);
    });

    //gauge chart from wfreq field of metadata
    
    var wash_freq = parseInt(sample_result.wfreq);
   
    var gaugeData = [{
        type: "indicator",
        mode: "gauge+number+delta",
        value: wash_freq,
        title: { text: "<b>Belly Button Washing Frequency</b><br>Srubs Per Week", font: { size: 24 } },
        //delta: { reference: 400, increasing: { color: "RebeccaPurple" } },
        gauge: {
          axis: { range: [null, 9], tickwidth: 1, tickcolor: "darkblue" },
          bar: { color: "darkblue" },
          bgcolor: "white",
          borderwidth: 2,
          bordercolor: "gray",
          steps: [
            { range: [0,1], color: 'rgb(30,30,62)'},
            { range: [1,2], color: 'rgb(32,30,64)'},
            { range: [2,3], color: 'rgb(33,33,68)'},
            { range: [3,4], color: 'rgb(35,34,71)'},
            { range: [4,5], color: 'rgb(36,36,74)'},
            { range: [5,6], color: 'rgb(37,41,80)'},
            { range: [6,7], color: 'rgb(39,42,83)'},
            { range: [7,8], color: 'rgb(44,44,90)'},
            { range: [8, 9], color: 'rgb(49,49,100)'}
         ],
          //threshold: {
            //line: { color: "red", width: 4 },
            //thickness: 0.75
          //}
        }
      }];
     
    var gaugeLayout = {
      width: 500,
      height: 400,
      margin: { t: 25, r: 25, l: 25, b: 25 },
      paper_bgcolor: "lavender",
      font: { color: "darkblue", family: "Arial" }
    };
     
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });  
}

function init() {

  //function for dropdown

  var dropdown = d3.select("#selDataset");

  d3.json("samples.json").then((data) => {
    console.log(data);
    var sampleNames = data.names;
    sampleNames.forEach((sample) => {
      dropdown
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // call the functions to display the data and the plots to the page
    var firstSample = sampleNames[0];
    graphs(firstSample);
    metaData(firstSample);
  });
}

//function for change in dropdown
function optionChanged(newSample) {
  graphs(newSample);
  metaData(newSample);
}

//initailize dashboard
init();