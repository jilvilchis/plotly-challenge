d3.json("./static/data/samples.json").then(function(data) {
    var id_samples = data.names;
    var testMetadata = data.metadata;

    console.log(data);
    console.log(testMetadata);
    console.log(testMetadata[0]);
    console.log(testMetadata[1].ethnicity);

    /* var x = `${id_samples[1]}`;
    var y = Object.keys(id_samples);
    console.log (y)
    var us = Object.values(data.samples[0]);
     console.log (us);*/

// Using d3 to append a blank option element in the list    
    d3.select("#selDataset").append("option");     
//  Loop to append all samples ids to selDataset  
    for (let i=0; i<id_samples.length; i++){
        var newOption = document.createElement("option");
        var node = document.createTextNode(id_samples[i]); 
        newOption.appendChild(node);
        newOption.setAttribute("value", i);
        document.getElementById("selDataset").append(newOption);
    }
});

var dropdownMenu = d3.select("#selDataset");

// Function called by DOM changes
function optionChanged() {
    var dropdownMenu = d3.select("#selDataset");
    // Assign the value of the dropdown menu option to a variable
    var userChoice = dropdownMenu.property("value");
    // Initialize an empty array for the country's data
    console.log(userChoice);

    d3.json("./static/data/samples.json").then(function(data) {
                
    // THIS CODE IS TO PLOT THE HORIZONTAL BARS
        // Use sample_values as the values for the bar chart
        // Use otu_ids as the labels for the bar chart
        // Use otu_labels as the hovertext for the chart
 
        var x_values = Object.values(data.samples[userChoice].sample_values).slice(0,10);
        var y_values = Object.values(data.samples[userChoice].otu_ids).slice(0,10);
        var hover_values = Object.values(data.samples[userChoice].otu_labels).slice(0,10);
        console.log(x_values);
        console.log(y_values);
        console.log(hover_values);
        
        var traceBar = {
            x: x_values,
            y: y_values.map(d => `OTU ${d}`), 
            // meter sort
            hovertext: hover_values,
            orientation: 'h',
            type: "bar",
            
        };
        var dataBar = [traceBar];
        // console.log(y_values.map(d => `OTU ${d}`));
        var layout = {
            title: 'top 10 OTUs', //`${stock} closing prices`,
        };
        Plotly.newPlot('bar', dataBar, layout);
  
    // THIS CODE IS TO PLOT THE BUBBLE CHARTS
        // Use otu_ids for the x values
        // Use sample_values for the y values
        // Use sample_values for the marker size
        // Use otu_ids for the marker colors
        // Use otu_lables for the text values
    
        var bubble_x = Object.values(data.samples[userChoice].otu_ids);
        var bubble_y = Object.values(data.samples[userChoice].sample_values);
        var bubble_size = Object.values(data.samples[userChoice].sample_values);
        var bubble_colors = Object.values(data.samples[userChoice].otu_ids);
        var bubble_labels = Object.values(data.samples[userChoice].otu_labels);
        // Note if you want to use only the top ten include .slice(0,10) at the end of each variable definition
        console.log(bubble_x);
        console.log(bubble_y);
        console.log(bubble_size);
        console.log(bubble_colors);
        console.log(bubble_labels);

        var trace1 = {
        x: bubble_x,
        y: bubble_y,
        text: bubble_labels,
        mode: 'markers',
        marker: {
            size: bubble_size,
            color: bubble_colors
        }
        };

        var dataBubble = [trace1];

        var layout = {
            title: 'Bubble Chart',
            showlegend: false,
            // In this case we do not adjust the H & W because we are using col-md-12 in html
            // height: 600,
            // width: 600
        };

        Plotly.newPlot('bubble', dataBubble, layout);
    
    // THIS CODE DISPLAYS THE SAMPLE METADATA
        // i.e. an individual's demographic information
        // Display each key-value pair from the metadata JSON object on the page

        var metadata = Object.values(data.metadata[userChoice]);
        console.log(metadata)
       
        // 0: id
        // 1: ethnicity
        // 2: gender
        // 3: age
        // 4: location
        // 5: bbtype
        // 6: wfreq

        //To clear fields
        d3.select("#sample-metadata").html("");
        // To populate the fields
        d3.select("#sample-metadata").append("p").text(`id: ${metadata[0]}`);
        d3.select("#sample-metadata").append("p").text(`ethnicity: ${metadata[1]}`);
        d3.select("#sample-metadata").append("p").text(`gender: ${metadata[2]}`);
        d3.select("#sample-metadata").append("p").text(`age: ${metadata[3]}`);
        d3.select("#sample-metadata").append("p").text(`location: ${metadata[4]}`);
        d3.select("#sample-metadata").append("p").text(`bbtype: ${metadata[5]}`);
        d3.select("#sample-metadata").append("p").text(`wfreq: ${metadata[6]}`);

    // THIS CODE CREATES THE GAUGE GRAPH

        console.log(metadata[6]);

        var dataGauge = [
            {
              domain: { x: [0, 1], y: [0, 1] },
              value: metadata[6],
              title: { text: "wfreq" },
              type: "indicator",
              mode: "gauge+number+delta",
              delta: { reference: 1 },
              gauge: {
                axis: { range: [null, 10] },
                steps: [
                  { range: [0, 2], color: "lightgray" },
                  { range: [2, 4], color: "gray" },
                  { range: [4, 6], color: "lightgray" },
                  { range: [6, 8], color: "gray" },
                  { range: [8, 10], color: "lightgray" }                  
                ],
                threshold: {
                  line: { color: "red", width: 4 },
                  thickness: 0.75,
                  value: 3
                }
              }
            }
          ];
        var layout = { width: 600, height: 450, margin: { t: 0, b: 0 } };
        Plotly.newPlot('gauge', dataGauge, layout);
    });
}