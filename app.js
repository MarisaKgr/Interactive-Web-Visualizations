//pull graph from samples.json
function init(){


  function bargraph(sample){
    d3.json("samples.json").then((data)=>{
      var samples= data.samples;
      var sampleArray= samples.filter(sampleobject => 
        sampleobject.id == sample);
      var sample_result= sampleArray[0]
  
      var ids = sample_result.otu_ids;
      var labels = sample_result.otu_labels;
      var values = sample_result.sample_values;
      var bar_data =[
        {
          y:ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(),
          x:values.slice(0,10).reverse(),
          text:labels.slice(0,10).reverse(),
          type:"bar",
          orientation:"h"
  
        }
      ];
  
      var barLayout = {
        title: "Top 10 Microbial Species Found"
      };
  
      Plotly.newPlot("bar", bar_data, barLayout);
    });   
  
}

init();


