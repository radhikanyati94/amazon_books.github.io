function bubbleChart() {
            const width = 650;
            const height = 650;
          
            // location to centre the bubbles
            const centre = { x: width/2, y: height/2 };
          
            // strength to apply to the position forces
            const forceStrength = 0.03;
          
            // these will be set in createNodes and chart functions
            let svg = null;
            let bubbles = null;
            let labels = null;
            let nodes = [];
          
            // charge is dependent on size of the bubble, so bigger towards the middle
            function charge(d) {
              return Math.pow(d.radius, 2.0) * 0.01
            }
          
            // create a force simulation and add forces to it
            const simulation = d3version5.forceSimulation()
              .force('charge', d3version5.forceManyBody().strength(charge))
              // .force('center', d3version5.forceCenter(centre.x, centre.y))
              .force('x', d3version5.forceX().strength(forceStrength).x(centre.x))
              .force('y', d3version5.forceY().strength(forceStrength).y(centre.y))
              .force('collision', d3version5.forceCollide().radius(d => d.radius + 1));
          
            // force simulation starts up automatically, which we don't want as there aren't any nodes yet
            simulation.stop();
          
            // set up colour scale
            const fillColour = d3version5.scaleOrdinal()
                .domain(["1", "2"])
                .range(["#2E86C1","#E67E22"]);
          
            // data manipulation function takes raw data from csv and converts it into an array of node objects
            // each node will store data and visualisation values to draw a bubble
            // rawData is expected to be an array of data objects, read in d3version5.csv
            // function returns the new node array, with a node for each element in the rawData input
            function createNodes(rawData) {

                
            
              // use max Rank in the data as the max in the scale's domain
              // note we have to ensure that Rank is a number
              const maxSize = d3version5.max(rawData, d => +d.Rank);
              const minSize = d3version5.min(rawData, d => +d.Rank);
          
              // size bubbles based on area
              const radiusScale = d3version5.scaleSqrt()
                .domain([maxSize, minSize])
                .range([0,70])
          
              // use map() to convert raw data into node data
              const myNodes = rawData.map(d => ({
                ...d,
                radius: radiusScale(+d.Rank),
                size: +d.Rank,
                x: Math.random() * 900,
                y: Math.random() * 800
              }))
          
              return myNodes;
            }
          
            // main entry point to bubble chart, returned by parent closure
            // prepares rawData for visualisation and adds an svg element to the provided selector and starts the visualisation process
            let chart = function chart(selector, rawData) {
                
                
                var tooltip = d3version5.select("#chart")
            .append("div")
            .style("position", "absolute")
            .style("visibility", "hidden")
            .style("color", "white")
            .style("padding", "8px")
            .style("background-color", "#626D71")
            .style("border-radius", "6px")
            .style("text-align", "center")
            .style("font-family", "monospace")
            .style("width", "400px")
            .text("");
              // convert raw data into nodes data
              nodes = createNodes(rawData);
          
              // create svg element inside provided selector
              svg = d3version5.select(selector)
                .append('svg')
                .attr('width', width)
                .attr('height', height)


          
              // bind nodes data to circle elements
              const elements = svg.selectAll('.bubble')
                .data(nodes, d => d.Title)
                .enter()
                .append('g')
                
                var scrollable = d3.select(".container");

                function scrollTopTween(scrollTop) {
                    return function() {
                        
                      var i = d3.interpolateNumber(this.scrollTop, scrollTop);
                      
                      return function(t) { this.scrollTop = i(t); };
                   };
                  }
                  

              bubbles = elements
                .append('circle')
                .classed('bubble', true)
                .attr('r', d => d.radius)
                .attr('fill', d => fillColour(d.bookType))
                .on('click', function(d) {

                    // d3version5.select(".side_title").html("Top Ranked Books in the year "+yearssNames[j]+" in "+dpath);
                    var scrollheight = scrollable.property("scrollHeight");
                    
                    d3.select("#scrollable").transition().duration(2000)
                      .tween("uniquetweenname", scrollTopTween(scrollheight));

                     

                      d3version4.select("#networkchart svg").remove();
                      d3version4.select(".side_title2").html(d.Title);
                     

                     network(d.Asin);
                     console.log(d.Asin)
                     d3radar.select("#charts svg").remove();
                     d3radar.select(".side_title_radar").html("Emotions(%) depicted in Reviews");
                     radarchart(d.Asin);
                     d3stack.select("#stackbar svg").remove();
                     d3stack.select(".side_title_stack").html("Rating Distribution");
                     stackbar(d.Asin);
                    //  var del = d3.select("#stacks");
                    //     del.selectAll("*").remove();
                    //  stackbar(d.Asin);
                    //  d3stack.select("#stackchart g").remove();
                    //  stackbar(d.Asin);

                    })
                .on("mouseover", function(d) {
                    d3version5.select(this).style("fill", d3version5.rgb(color(d.bookType)).darker(2));


                                           tooltip.html(d.bookType + "<br>" + d.Title + "<br> Salesrank : " +d.Rank+"<br> Average Ratings : " +d.AvgRating+"<br> Click to view Review Summary");
                                           return tooltip.style("visibility", "visible");
                                       })
                .on("mousemove", function() {

                                           return tooltip.style("top", (d3version5.event.pageY - 150) + "px").style("left", (d3version5.event.pageX-300) + "px");
                                       })
                .on("mouseout", function(d) {
                    d3version5.select(this).style("fill", d3version5.rgb(color(d.bookType)));


                                           return tooltip.style("visibility", "hidden");
                                       })
          
              // labels
              labels = elements
                .append('text')
                .attr('dy', '.50em')
                .style('text-anchor', 'middle')
                .style('font-size', 15)
                .style("display","block")
                .text(function(d){
                   
                    text =""
                    for(i=0;i<5;i++){

                        text += d.Title[i]

                    }
                    return text+".."
                });
                
          
              // set simulation's nodes to our newly created nodes array
              // simulation starts running automatically once nodes are set
              simulation.nodes(nodes)
                .on('tick', ticked)
                .restart();
            }
          
            function ticked() {
              bubbles
                .attr('cx', d => d.x)
                .attr('cy', d => d.y)
          
              labels
                .attr('x', d => d.x)
                .attr('y', d => d.y)
            }
          
            // return chart function from closure
            return chart;
          }


          


// function bubbleChart() {
//     var width = 650,
//         height = 700,
//         maxRadius = 6,
//         columnForColors = "bookType",
//         columnForRadius = "Rank";

//     function chart(selection) {
//         var data = selection.datum();
//         var div = selection;
//         //     svg = div.selectAll('svg');
//         // svg.attr('width', width).attr('height', height);

//         var tooltip = selection
//             .append("div")
//             .style("position", "absolute")
//             .style("visibility", "hidden")
//             .style("color", "white")
//             .style("padding", "8px")
//             .style("background-color", "#626D71")
//             .style("border-radius", "6px")
//             .style("text-align", "center")
//             .style("font-family", "monospace")
//             .style("width", "400px")
//             .text("");
//             const forceStrength = 0.03;
//             const centre = { x: width/2, y: height/2 };
                    
                   


//             function charge(d) {
//                 return Math.pow(d.radius, 2.0) * 0.01
//               }
//             var simulation = d3version5.forceSimulation(data)
//             .force("charge", d3version5.forceManyBody().strength(charge))
//             .force('x', d3version5.forceX().strength(forceStrength).x(centre.x))
//     .force('y', d3version5.forceY().strength(forceStrength).y(centre.y))
//             .force('collision', d3version5.forceCollide().radius(d => d.radius + 1))
//             .on("tick", ticked);

//             function ticked(e) {
//                 node.attr("cx", function(d) {
//                         return d.x;
//                     })
//                     .attr("cy", function(d) {
//                         return d.y;
//                     });
//             }

//         populate_circles= function(){
//             var width = 650,
//         height = 700,
//         maxRadius = 6,
//         columnForColors = "bookType",
//         columnForRadius = "Rank";
//         columnfortime = "Review_time"
       
//         d3version5.select("#chart").html("Top Ranked Books of the YEAR").style("color","red").style("text-align", "center")
//         .style("font-family", "monospace").style("font-size", "20px"); 
//         var data = selection.datum();
//         var div = selection;
//         //     svg = div.selectAll('svg');
//         // svg.attr('width', width).attr('height', height);

//         var tooltip = selection
//             .append("div")
//             .style("position", "absolute")
//             .style("visibility", "hidden")
//             .style("color", "white")
//             .style("padding", "8px")
//             .style("background-color", "#626D71")
//             .style("border-radius", "6px")
//             .style("text-align", "center")
//             .style("font-family", "monospace")
//             .style("width", "400px")
//             .text("");
            
        

//             var simulation = d3version5.forceSimulation(data)
//             .force("charge", d3version5.forceManyBody().strength([-500]))
//             .force("x", d3version5.forceX())
//             .force("y", d3version5.forceY())
//             .on("tick", ticked);

//             function ticked(e) {
//                 node.attr("cx", function(d) {
//                         return d.x;
//                     })
//                     .attr("cy", function(d) {
//                         return d.y;
//                     });
//             }
            
//             div.append("svg");
//             svg2 = div.selectAll('svg');
//             svg2.attr('width', 700).attr('height', 700).attr("margin-top",0);

//         // console.log(simulation)

//         var colorCircles = d3version5.scaleOrdinal(d3version5.schemeCategory10);
//         // var scaleRadius = d3version5.scaleLinear().domain([d3version5.min(data, function(d) {
//         //     return +d[columnForRadius];
//         // }), d3version5.max(data, function(d) {
//         //     return +d[columnForRadius];
//         // })]).range([5, 18])

//         const maxSize = d3version5.max(data, d => +d.Rank);
//         const minSize = d3version5.min(data, d => +d.Rank);
//         const scaleRadius = d3version5.scaleSqrt()
//       .domain([maxSize, minSize])
//       .range([0, 80])

//             var new_nodes = svg2.selectAll("circle")
//                    .data(data)
//                    .enter()
//                    .append("circle")
//                    .attr('r', function(d) {
//                        return scaleRadius(d[columnForRadius],d[columnForRadius])
//                    })
//                    .style("fill", function(d) {
//                        return colorCircles(d[columnForColors])
//                    })
//                    .attr('transform', 'translate(' + [width / 2, height / 2] + ')')
//                    .on("mouseover", function(d) {
//                        tooltip.html(d[columnForColors] + "<br>" + d.Title + "<br>" + d[columnForRadius] + " - SalesRank");
//                        return tooltip.style("visibility", "visible");
//                    })
//                    .on("mousemove", function() {
//                        return tooltip.style("top", (d3version5.event.pageY - 150) + "px").style("left", (d3version5.event.pageX-300) + "px");
//                    })
//                    .on("mouseout", function() {
//                        return tooltip.style("visibility", "hidden");
//                    })
//                    .attr("cx", function(d) {
//                         return d.x;
//                     })
//                     .attr("cy", function(d) {
//                         return d.y;
//                     });
            
                   

//            return new_nodes;

           
//         }

//         // svg.selectAll("circle");
//         var node = populate_circles();

        
//     }

    

//     chart.width = function(value) {
//         if (!arguments.length) {
//             return width;
//         }
//         width = value;
//         return chart;
//     };

//     chart.height = function(value) {
//         if (!arguments.length) {
//             return height;
//         }
//         height = value;
//         return chart;
//     };


//     // chart.columnForColors = function(value) {
//     //     if (!arguments.columnForColors) {
//     //         return columnForColors;
//     //     }
//     //     columnForColors = value;
//     //     return chart;
//     // };

//     // chart.columnForRadius = function(value) {
//     //     if (!arguments.columnForRadius) {
//     //         return columnForRadius;
//     //     }
//     //     columnForRadius = value;
//     //     return chart;
//     // };

//     return chart;
// }