var margin = {top: 20, right: 20, bottom: 30, left: 100},
    width = 5000 - margin.left - margin.right,
    height = 1500 - margin.top - margin.bottom;

var dropdown = d3version3.select(".dropdown")
  .insert("select", "svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var margin = {top: 100, right: 20, bottom: 20, left: 60},
    width = 650 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x0 = d3version3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var x1 = d3version3.scale.ordinal();

var y = d3version3.scale.linear()
    .range([height, 0]);

var xAxis = d3version3.svg.axis()
    .scale(x0)
    .tickSize(0)
    .orient("bottom");

var yAxis = d3version3.svg.axis()
    .scale(y)
    .orient("left");

var color = d3version3.scale.ordinal()
    .range(["#2E86C1","#E67E22"]);
    
    
    

var svg = d3version3.select('#barchart').append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
   
var makeVis = function(dpath){

    d3version3.select(".side_title_bar").html("Reviews given on kindle and Hardcover by Year");


    svg.selectAll("g").remove();

    var url = './data/'+dpath+'.json';
d3version3.json(url, function(error, data) {

  var yearssNames = data.map(function(d) { return d.year; });
  var typeNames = data[0].values.map(function(d) { return d.type; });

  x0.domain(yearssNames);
  x1.domain(typeNames).rangeRoundBands([0, x0.rangeBand()]);
  y.domain([0, d3version3.max(data, function(year) { return d3version3.max(year.values, function(d) { return d.value; }); })]);

  var tooltip = d3version3.select("#barchart")
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

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .append("text")
      .attr("transform", "rotate(0)")
      .attr("x", 565)
      .attr("y", 8)
      .attr("dy", ".71em")
      .style("text-anchor", "middle")
      .style('font-weight','bold')
      .text("Year");

  svg.append("g")
      .attr("class", "y axis")
      .style('opacity','0')
      .call(yAxis)
  .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .style('font-weight','bold')
      .text("Number of Reviews");

      

  svg.select('.y').transition().duration(500).delay(1300).style('opacity','1');

  var slice = svg.selectAll(".slice")
      .data(data)
      .enter().append("g")
      .attr("class", "g")
      .attr("transform",function(d,i) { return "translate(" + x0(d.year) + ",0)"; });

  slice.selectAll("rect")
      .data(function(d) { return d.values; })
  .enter().append("rect")
      .attr("width", x1.rangeBand())
      .attr("x", function(d) { return x1(d.type); })
      .style("fill", function(d) { return color(d.type) })
      .attr("y", function(d) { return y(0); })
      .attr("height", function(d) { return height - y(0); })
      .on("click",function(d,i,j){


        d3version5.select(".side_title").html("Top Ranked Books in the year "+yearssNames[j]+" in "+dpath);


        let myBubbleChart = bubbleChart();

// function called once promise is resolved and data is loaded from csv
// calls bubble chart function to display inside #vis div
function display(data) {
  data = data.filter(function(row) {
        return row['Category'] == dpath && row['Review_time'] == yearssNames[j];
    })

    d3version5.select("#chart svg").remove();
  myBubbleChart('#chart', data);
}

// load data
d3version5.csv('./top10BooksandKindle.csv').then(display);
          
    
      
            
        })
        .on("mouseover", function(d) {
            d3version3.select(this).style("fill", d3version5.rgb(color(d.type)).darker(2));


                                   tooltip.html(d.type);
                                   return tooltip.style("visibility", "visible");
                               })
        .on("mousemove", function() {

                                   return tooltip.style("top", (d3version3.event.pageY - 150) + "px").style("left", (d3version3.event.pageX-300) + "px");
                               })
        .on("mouseout", function(d) {
            d3version3.select(this).style("fill", d3version3.rgb(color(d.type)));


                                   return tooltip.style("visibility", "hidden");
                               })

  slice.selectAll("rect")
      .transition()
      .delay(function (d) {return Math.random()*1000;})
      .duration(1000)
      .attr("y", function(d) { return y(d.value); })
      .attr("height", function(d) { return height - y(d.value); });

  //Legend
  var legend = svg.selectAll(".vis-container")
      .data(data[0].values.map(function(d) { return d.type; }).reverse())
  .enter().append("g")
      .attr("class", "vis-container")
      .attr("transform", function(d,i) { return "translate(0," + i * 20 + ")"; })
      .style("opacity","0");

  legend.append("rect")
      .attr("x", width)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", function(d) { return color(d); });

  legend.append("text")
      .attr("x", width-5)
      .attr("y", 9)
      .attr("dy", ".70em")
      .style("text-anchor", "end")
      .text(function(d) {return d; });

  legend.transition().duration(500).delay(function(d,i){ return 1300 + 100 * i; }).style("opacity","1");

});
}
cerealMap={}
  cerealMap={"Choose a Genre":"","Literature & Fiction":"","Science & Math":"","History":"","Travel":"","Romance":"","Science Fiction & Fantasy":"","Teen & Young Adult":"","Humor & Entertainment":"","Mystery, Thriller & Suspense":"","Health, Fitness & Dieting":""}
  var cereals = Object.keys(cerealMap).sort();
  var dropdownChange = function() {
      var newCereal = d3version3.select(this).property('value')
    //   console.log(newCereal);
      dpath = newCereal
    //   console.log(dpath)
      makeVis(dpath)
  };
  
  dropdown
  .on("change", dropdownChange);
    dropdown.selectAll("option")
        .data(cereals)
      .enter().append("option")
        .attr("value", function (d) { return d; })
        .text(function (d) {
            return d[0].toUpperCase() + d.slice(1,d.length); // capitalize 1st letter
        }); 

var dpath = 'Health, Fitness & Dieting'
        makeVis(dpath)



        