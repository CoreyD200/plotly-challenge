// For testing you must initiate a local http server.
// open terminal. Navigate to lowest possible level (where the web docs are)
// execute " python -m http.server"
// this opens a webserver on port 8000 on your local machine
// *****************************************
//  Much easier solution to the above is to use the extenstion "live server"

let url = "samples.json"

// using d3 to get data from json file and initiate a promise 
d3.json(url).then(function(data) {
    console.log(data);
})

// #####################################
// create function to get and filter data to use for barchart
function buildChart(sample) {
    d3.json(url).then((data) => {
      let samples = data.samples;
      let resultArray = samples.filter(sampleObj => sampleObj.id == sample);
      let result = resultArray[0];
      let otu_ids = result.otu_ids;
      let otu_labels = result.otu_labels;
      let sample_values = result.sample_values;
    
//  build and define the bar chart using on the the top 10 values   
    let yticks=(otu_ids.slice(0,10).map(otu_ids=> `OTU ${otu_ids}`)).reverse()
    let trace1 = {
        y: yticks,
        x: sample_values,
        hover_data: otu_labels,
        type: 'bar',
        orientation: 'h'
        
        
    }
    let bardata = [trace1]

    let layout = {
        xaxis: { title: "Samples"}
        
    };
    Plotly.newPlot('bar', bardata, layout)
})
}

// buildChart(940)
// #####################################
// build guage chart




// ######################################

function buildBubbleChart(sample) {
    d3.json(url).then((data) => {
        let samples = data.samples;
        let resultArray = samples.filter(sampleObj => sampleObj.id == sample);
        let result = resultArray[0];
        let otu_ids = result.otu_ids;
        let otu_labels = result.otu_labels;
        let sample_values = result.sample_values;

        let trace1 = {
            x: otu_ids,
            y: sample_values,
            mode: 'markers',
            type: 'scatter',
            marker: {
                size:sample_values,
                color: otu_ids,
                colorscale: 'Earth',
                showscale: true
            }
        }
        let bubbledata = [trace1]
    
        let layout = {
            xaxis: { title: 'OTU ID'},
            
        };
        Plotly.newPlot('bubble', bubbledata, layout)
    })
}

// buildBubbleChart(940)

// ######################################

function buildDemographics(sample) {
    d3.json(url).then((data) => {
        let metadata = data.metadata
        let result = metadata.filter(sampleObj => sampleObj.id == sample);
        let table = d3.select('#sample-metadata');
        console.log(result)
        table.html("");

        Object.entries(result[0]).forEach(([key, value]) => {
            table.append('h5').text(`${key}: ${value}`);
    })
})
}
// buildDemographics(940)
// building function to set value into the "selectDataset" button on the HTML page. Adding the first ID from the dataset as default

function init() {
    let selector = d3.select('#selDataset');
    d3.json(url).then((data)=>{
        let idData = data.names
        idData.forEach((id)=>{
            selector
                .append("option")
                .text(id)
                .property('value', id);
        });

        const firstId = idData[0];
        buildDemographics(firstId);
        buildChart(firstId);
        // buildGuage(firstId);
        buildBubbleChart(firstId);
    });
}

// ######################################
// build function to change all of the charts based off of the current selction as selected in the dropdown on the html page
 

function optionChanged(newId){
    buildDemographics(newId);
    buildChart(newId);
    // buildGuage(newId);
    buildBubbleChart(newId);

}
init()