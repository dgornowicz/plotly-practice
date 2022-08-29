// This function initializes the dropdown menu options from
// the json stored in the file "samples.json".
// It also initializes the charts with the default dropdown item by
// calling the buildCharts & buildMetadata functions.
function init() {
  var selector = d3.select("#selDataset");

  d3.json("samples.json").then((data) => {
    console.log(data);
    var sampleNames = data.names;
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    buildMetadata(sampleNames[0]);
    buildCharts(sampleNames[0]);
    
})}

init();

// This funciton is called by the html file whenever a new
// dropdown item is selected 
function optionChanged(newSample) {
buildMetadata(newSample);
buildCharts(newSample);
}

// This function builds the Metadata info to populate the 
// Demographic Info panel.
function buildMetadata(sample) {
d3.json("samples.json").then((data) => {
  var metadata = data.metadata;
  var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
  var result = resultArray[0];
  var washings = parseInt(result.wfreq);
  buildGaugeChart(washings);
  var PANEL = d3.select("#sample-metadata");

    PANEL.html("");
    Object.entries(result).forEach(([key,value]) => {
      item = (key+": "+value)
      PANEL.append("h6").text(item);
    })

});
}


// This function builds the bar and bubble charts.
// The parameter passed is the Test Subject ID No. from the dropdown list. 
function buildCharts(sample) {
d3.json("samples.json").then((data) => {
  var samplesArray = data.samples;
  var filteredSamplesArray = samplesArray.filter(sampleObj => sampleObj.id == sample);
  console.log(filteredSamplesArray)
  var sampleValues = filteredSamplesArray[0].sample_values.slice(0,10).reverse();
  var otuIds = filteredSamplesArray[0].otu_ids.slice(0,10).reverse();
  var otuLabels = filteredSamplesArray[0].otu_labels.slice(0,10).reverse();

  var barData = {
    type: 'bar',
    x: sampleValues,
    y: otuIds.map((item) => "OTU" + item),
    text: otuLabels,
    orientation: 'h'
  };

  var layoutBar = {
    title: 'Top 10 Bacterial Species',
    paper_bgcolor: '#00ffff'
  };

  Plotly.newPlot('bar', [barData], layoutBar);
  
  var bubbleData = {
    x: otuIds,
    y: sampleValues,
    text: otuLabels,
    mode: 'markers',
    marker: {
      color: otuIds,
      size: sampleValues
    } 
  };
  
  var layoutBubble = {
    title: 'Sample Size by OTU ID',
    xaxis: {title: 'OTU ID'},
    yaxis: {title: 'no. of samples'},
    paper_bgcolor: '#00ffff'
  };

  Plotly.newPlot('bubble', [bubbleData], layoutBubble);


});
}

// This function builds the gauge chart.  It is called from the
// buildMetadata function where the parameter is generated.
function buildGaugeChart(washings) {

var gaugeData = {
  domain: { x: [0, 10], y: [0, 10] },
  value: washings,
  type: 'indicator',
  mode: 'gauge+number'      
  };

var layoutGauge = {
  title: 'Belly Button Washing Frequency',
  annotations: [{
    text: 'Scrubs per Week', 
    showarrow: false, 
    align: 'center',
    x: 0.5,
    y: 1.15}],
    paper_bgcolor: '#00ffff'
};

Plotly.newPlot('gauge', [gaugeData], layoutGauge);

}