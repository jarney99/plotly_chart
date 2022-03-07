// DELIVERABLE 1: Create a Horizontal Bar Chart

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
      var PANEL = d3.select("$sample-metadata");
  
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
function init () {
    var selector = d3.select("#selDataset");
    d3.json("samples.json").then((data) => {
      var sampleNames = data.names;
      sampleNames.forEach((sample) => {
        selector.append("option").text(sample).property("value", sample);
      });
      var firstSample = sampleNames[0];
      buildCharts(firstSample);
      buildMetadata(firstSample);
    });
  }
  
  init();
  
  function optionChanged (newSample) {
    buildMetadata(newSample);
    buildCharts(newSample);
  }
  
  function buildMetadata (sample) {
    d3.json("samples.json").then((data) => {
      var metadata    = data.metadata;
      var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
      var result      = resultArray[0];
      var PANEL       = d3.select("$sample-metadata");
      PANEL.html("");
      Object.entries(result).forEach(([key, value]) => {
        PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
      });
    });
  }
  
  function buildCharts (sample) {
    d3.json("samples.json").then((data) => {
      var samples       = data.samples;
      var resultArray   = samples.filter(sampleObj => sampleObj.id == sample);
      var metadataArray = data.metadata.filter(sampleObj => sampleObj.id == sample);
      var result        = resultArray[0];
      var metadata      = metadataArray[0];
      var otu_ids       = result.otu_ids;
      var otu_labels    = result.otu_labels;
      var sample_values = result.sample_values;
      var frequency     = parseFloat(metadata.wfreq);
      var yticks        = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
      var barData       = [
        {
          y           : yticks,
          x           : sample_values.slice(0, 10).reverse(),
          text        : otu_labels.slice(0, 10).reverse(),
          type        : "bar",
          orientation : "h",
        }
      ];
      var barLayout = {
        title  : "Top 10 Bacteria Cultures Found",
        margin : {t: 30, l: 150}
      };
      Plotly.newPlot("bar", barData, barLayout);
      var bubbleData = [
        {
          x      : otu_ids,
          y      : sample_values,
          text   : otu_labels,
          mode   : "markers",
          marker : {
            size       : sample_values,
            color      : otu_ids,
            colorscale : "Earth"
          }
        }
      ];
      var bubbleLayout = {
        title : "Bacteria Cultures Per Sample",
        margin : {t: 0},
        hoverMode : "closest",
        xaxis : {title: "OTU ID"},
        margin: {t: 30}
      };
      Plotly.newPlot("bubble", bubbleData, bubbleLayout);
      var gaugeData = [
        {
          domain: { x: [0, 1], y: [0, 1] },
          value: frequency,
          title: { text: "<b>Belly Button Washing Frequency</b> <br> Scrubs per Week"},
          type: "indicator",
          mode: "gauge+number",
          gauge: {
            axis: { range: [null, 10] },
            bar: { color: "black"},
            steps: [
              { range: [0, 2], color: "red" },
              { range: [2, 4], color: "orange" },
              { range: [4, 6], color: "yellow" },
              { range: [6, 8], color: "yellowgreen" },
              { range: [8, 10], color: "green" }
            ],
          }
        }
      ];
      var gaugeLayout = {
        width : 500,
        height : 425,
        margin : {t: 0, b:0}
      };
      Plotly.newPlot("gauge", gaugeData, gaugeLayout);
    });
  }