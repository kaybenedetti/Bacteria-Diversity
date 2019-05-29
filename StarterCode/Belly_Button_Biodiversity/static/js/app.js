function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  d3.json(`/metadata/${sample}`).then(function (sample_info) {
    // console.log(sample_info);
    // Use d3 to select the panel with id of `#sample-metadata`
    var selector = d3.select("#sample-metadata");
    // Use `.html("") to clear any existing metadata
    selector.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    Object.entries(sample_info).map(function (key, value) {
      // Hint: Inside the loop, you will need to use d3 to append new
      // tags for each key-value in the metadata.
      selector.append("li").text(`${key}: ${value}`)
    });
  })};

  
function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json("/samples/" + sample).then(function (data) {
    console.log(data)

    // @TODO: Build a Bubble Chart using the sample data
    var bubble = document.getElementById('bubble')
    var trace = {
      type: 'scatter',
      mode: 'markers',
      x: data.otu_ids,
      y: data.sample_values,
      hovertext: data.otu_labels,
      marker: {
        size: data.sample_values,
        sizemode: "diameter",
        color: ['rbg(250, 250, 250)']
      }
    }
    var bubbleData = [trace]
    var layout = {
      xaxis: {
        title: "OTU IDs"
      },
      showlegend: true,
      automargin: true,
      height: 640,

    }
    Plotly.plot(bubble, bubbleData, layout);

    // @TODO: Build a Pie Chart
    var pieData = [{
      values: data.sample_values.slice(0, 10),
      labels: data.otu_ids.slice(0, 10),
      hovertext: data.otu_labels.slice(0, 10),
      type: 'pie',
    }];
    var pieLayout = {
      showlegend: true,
    };
    Plotly.newPlot('pie', pieData, pieLayout);
  })
};
// HINT: You will need to use slice() to grab the top 10 sample_values,
// otu_ids, and labels (10 each).


function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
