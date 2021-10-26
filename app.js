//pull graph from samples.json

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

    var bubbleData=[{
      x: ids,
      y:values,
      text: labels,
      mode:'markers',
      marker:{
        size: values,
        color: ids
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