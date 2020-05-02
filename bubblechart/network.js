function network(bookid){
  const width = 650;
  const height = 650;
  var svg3 = d3version4.select("#networkchart")
                  .append('svg')
                  .attr('width', width)
                  .attr('height', height)
  
  var simulation = d3version4.forceSimulation()
      .force("link", d3version4.forceLink().id(function(d) { return d.id; }))//.distance(150))
      .force('charge', d3version4.forceManyBody()
      .strength(-2500)
      .distanceMax(height/2))
      .force("center", d3version4.forceCenter(width / 2, height / 2))
      .force("collide", d3version4.forceCollide(10).iterations(10));
    
  function run(graph) {
    
    d3version4.select(".side_title_network").html("Review Summary");

    
    var link = svg3.append("g")
                  .selectAll("line")
                  .data(graph.links)
                  .style("stroke", function(d) { return d.value > 0 ? "#E5E7E9" : ""})
                  .enter().append("line");
  
    var node = svg3.append("g")
              .attr("class", "nodes")
              .selectAll("circle")
              .data(graph.nodes)
              .enter().append("circle")
              .attr("r", 50)
              .style("fill","pink")
              .call(d3version4.drag()
              .on("start", dragstarted)
              .on("drag", dragged)
              .on("end", dragended));

    function camelCase(str) { 
      return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) 
      { 
        return index == 0 ? word.toUpperCase() : word.LowerCase(); 
      }).replace(/\s+/g, ''); 
    }
    
    var label = svg3.append("g")
        .attr("class", "labels")
        .attr("text-anchor", "middle")
        .selectAll("text")
        .data(graph.nodes)
        .enter().append("text")
          .attr("class", "label")
          .attr("font-weight","bold")
          .text(function(d) { return camelCase(d.id); });
  
    simulation
        .nodes(graph.nodes)
        .on("tick", ticked);
  
    simulation.force("link")
        .links(graph.links);

  
    var tooltip2 = d3version4.select(".network")
    .append("div")
    .attr("class", "tooltip2")
    .style("opacity", 0);
  
    const linkedByIndex = {};
    graph.links.forEach(d => {
      if(d.value != 0){
        linkedByIndex[`${d.source.index},${d.target.index}`] = 1;
      }
    });
  
    function isConnected(a, b) {
      return linkedByIndex[`${a.index},${b.index}`] || linkedByIndex[`${b.index},${a.index}`] || a.index === b.index;
    }
    
    function fade(opacity) {
      return d => {
        node.style('stroke-opacity', function (o) {
          const thisOpacity = isConnected(d, o) ? 1 : opacity;
          this.setAttribute('fill-opacity', thisOpacity);
          return thisOpacity;
        });

        link.style('stroke-opacity', o => ((o.source === d || o.target === d) && o.value>0 ? 1 : opacity));
        link.style('stroke', o => ((o.source === d || o.target === d) && o.value>0 ? "black" : o.value > 0 ? "#E5E7E9":""));

      };
    }
  
    function releasenode(d) {
      d.fx = null;
      d.fy = null;
    }
  
    function ticked() {
  
      var thickness = d3version4.scaleLinear().range([0.5, 7]);
      thickness.domain([d3version4.min(graph.links, function(d) { return +d.value; }), d3version4.max(graph.links, function(d) { return +d.value; })]);

      //const radiusScale = d3version4.scaleSqrt().domain([0, 800]).range([5, 80]);
      var radiusScale = d3version4.scaleLinear().range([12, 60]);
      radiusScale.domain([d3version4.min(graph.nodes, function(d) { return +d.value; }), d3version4.max(graph.nodes, function(d) { return +d.value; })]);

      link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; })
        //.style("stroke-width", 1.5)
        .style("stroke", function(d) { return d.value > 0 ? "#E5E7E9" : ""})
        //.on('mouseover.tooltip', function(d) {
        //  tooltip2.transition()
        //    .style("opacity", .8);
        //  tooltip2.html("Source:"+ camelCase(d.source.id) + 
        //               "<p/>Target:" + camelCase(d.target.id) +
        //              "<p/>Strength:"  + d.value)
        //    .style("left", (d3version4.event.pageX) + "px")
        //    .style("top", (d3version4.event.pageY + 10) + "px"); 
        //})
        //.on("mouseout.tooltip", function() {
        //  tooltip2.transition()
        //    .style("opacity", 0);
        //})
        //.on('mouseout.fade', fade(1))
        //.on("mousemove", function() {
        //  d3version4.select(this).style("stroke",function(d) { return d.value > 0 ? "black" : ""});
        //  tooltip2.style("left", (d3version4.event.pageX) + "px")
        //    .style("top", (d3version4.event.pageY + 10) + "px");
        //})
        //.on("mouseout",function(d){
        //  d3version4.select(this).style("stroke","");//function(d) { return d.value > 0 ? "#d3d3d3" : ""});
        //});
  
      node
         .attr("r", function(d) { return radiusScale(+d.value); })
         .style("fill", "pink")
         .style("stroke", "black")
         .style("stroke-width", "1px")
         .attr("cx", function (d) { return d.x+5; })
         .attr("cy", function(d) { return d.y-3; })
         .on('mouseover.tooltip', function(d) {
              tooltip2.transition()
                .style("opacity", .8);
              tooltip2.html("Node:" + camelCase(d.id) + 
                       "<p/>Frequency:" + d.value)
                .style("left", (d3version4.event.pageX) + "px")
                .style("top", (d3version4.event.pageY + 10) + "px");
            })
          .on('mouseover.fade', fade(0.1))
          .on("mouseout.tooltip", function() {
              tooltip2.transition()
                .style("opacity", 0);
            })
          .on('mouseout.fade', fade(1))
          .on("mousemove", function() {
              d3version4.select(this).style("fill","#89cff0");
              link.style("stroke-width", function(d){return thickness(d.value)});
              d3version4.select(this).attr("r", function(d) { return radiusScale(+d.value) + 7; })
              tooltip2.style("left", (d3version4.event.pageX) + "px")
                      .style("top", (d3version4.event.pageY + 10) + "px");
          })
          .on("mouseout",function(){
            d3version4.select(this).style("fill","pink");
            link.style('stroke', function(d) { return d.value > 0 ? "#E5E7E9" : ""})
            link.style("stroke-width",1.5)
            d3version4.select(this).attr("r", function(d) { return radiusScale(+d.value); })
          })
          .on('dblclick',releasenode);
      
      label
        .attr("x", function(d) { return d.x; })
        .attr("y", function (d) { return d.y; })
        .style("font-weight","bold")
        .style("font-size", "15px")
        .style("fill", "#900C3F");
    }
  }
  
  function dragstarted(d) {
    if (!d3version4.event.active) simulation.alphaTarget(0.3).restart()
    d.fx = d.x
    d.fy = d.y
  }
  
  function dragged(d) {
    d.fx = d3version4.event.x
    d.fy = d3version4.event.y
  }
  
  function dragended(d) {
    d.fx = d3version4.event.x
    d.fy = d3version4.event.y
    if (!d3version4.event.active) simulation.alphaTarget(0);
  }
  
 var bookId = bookid;
  d3version4.json("./nodes.json", function(data) {
      d3version4.json("./edges.json", function(data1) {
        const graph = {
          "nodes": data[bookId],
          "links": data1[bookId]
        }
        run(graph)
      });
      
  
  });
    
  
  }
