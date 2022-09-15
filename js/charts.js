function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

//Create the buildCharts function.
function buildCharts(sample) {
  //Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    //Create a variable that holds the samples array. 
    let samples = data.samples;
    //Create a variable that filters the samples for the object with the desired sample number.
    let filteredSamples = samples.filter(sampleObj => sampleObj.id == sample);
    //Create a variable that holds the first sample in the array.
    let firstSample = filteredSamples[0];
    console.log(firstSample);

    //Create variables that hold the otu_ids, otu_labels, and sample_values.
    let otuIDs = firstSample.otu_ids;
    let otuLabels = firstSample.otu_labels;
    let sampleValues = firstSample.sample_values;
  
    //Create the yticks for the bar chart.
    let top10Samples = sampleValues.slice(0,10).reverse();
    let top10otuIDs = otuIDs.slice(0,10).reverse().map(id => "OTU " + id.toString());
  
   
    let yticks = top10otuIDs;
    
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    let washingFreq = result.wfreq;
    

    //Create the trace for the bar chart. 
    var barData = [{
      x: top10Samples,
      y: yticks,
      type: "bar",
      orientation: "h"
    }];

    //Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      
      
    };
    //Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

    // Bar and Bubble charts
    // Create the buildCharts function.
    
    // Use d3.json to load and retrieve the samples.json file 
  

    // 1. Create the trace for the bubble chart.

    var bubbleData = [{
      x: otuIDs,
      y: sampleValues,
      mode: "markers",
      text: otuLabels,
      marker:{
        size: sampleValues,
        color: otuIDs,
        colorscale: "YlOrRd"
      }
    }];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      showlegend: false,
      xaxis: {automargin: true},
      yaxis: {automargin: true}
      
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout); 

    console.log(washingFreq);
    // 4. Create the trace for the gauge chart.
    var gaugeData = [
      {
        
        value: washingFreq,
        title: { text: "Belly Button Washing Frequency<br> Scrubs per Week", font: {size: 24} },
        type: "indicator",
        mode: "gauge+number",
        gauge:{
          axis:{range: [0, 10], tickwidth: 1},
          bar: {color: "black"},
          steps:[
            {range: [0, 2], color: "red"},
            {range: [2, 4], color: "orange"},
            {range: [4, 6], color: "yellow"},
            {range: [6, 8], color: "lightgreen"},
            {range: [8, 10], color: "green"}
          ]
        }
      }
    ];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      width: 600, height: 500, margin: { t: 25, r: 25, l: 25, b: 25 }
     
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge",gaugeData,gaugeLayout,{responsive: true});
      
  });
};


