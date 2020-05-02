function stackbar(Asin){
d3version3.json("datasetfinal.json", function(dataset1){
  var dataset = dataset1[Asin]
  console.log(dataset)
        var margins = {
                top: 17,
                left: 30,
                right: 38,
                bottom: 84
            },
            legendPanel = {
                width: 170
              
            },
            width = 700 - margins.left - margins.right - legendPanel.width,
            height = 140 - margins.top - margins.bottom ,
            series = dataset.map(function(d) { return d.name; }),
            dataset = dataset.map(function(d) {
                return d.data.map(function(o, i) {
                    // Structure it so that your numeric
                    // axis (the stacked amount) is y
                    return {
                        y: o.count,
                        x: o.month
                    };
                });
            }),
            stack = d3version3.layout.stack();

        stack(dataset);

        function colores_google(n) {
  		var colores_g = ["#B0E6EA", "#52D0DA", "#0BA1AD", "#EE75C5", "#DD5BB1"];
  		return colores_g[n % colores_g.length];
		}

        var dataset = dataset.map(function(group) {
            return group.map(function(d) {
                // Invert the x and y values, and y0 becomes x0
                return {
                    x: d.y,
                    y: d.x,
                    x0: d.y0
                };
            });
        }),
        svg = d3version3.select('#stackbar')
            .append('svg')
                .attr('width', width + margins.left + margins.right)
                .attr('height', 200)
            .append('g')
                .attr('transform', 'translate(' + margins.left + ',' + margins.top + ')'),
        xMax = d3version3.max(dataset, function(group) {
            return d3version3.max(group, function(d) {
                return d.x + d.x0;
            });
        }),
        xScale = d3version3.scale.linear()
            .domain([0, xMax])
            .range([0, width]),
        months = dataset[0].map(function(d) { return ''; }),
        _ = console.log(months),
        yScale = d3version3.scale.ordinal()
            .domain(months)
            .rangeRoundBands([0, height], .1),
        xAxis = d3version3.svg.axis()
            .scale(xScale)
            .orient('bottom'),
        yAxis = d3version3.svg.axis()
            .scale(yScale)
            .orient('left'),
        groups = svg.selectAll('g')
            .data(dataset)
            .enter()
            .append('g')
                .style('fill', function(d, i) {
                    return colores_google(i);
                }),

        
        rects = groups.selectAll('rect')
            .data(function(d) { return d; })
            .enter()
                .append('rect')
                    .attr('x', function(d) { return xScale(d.x0); })
                    .attr('y', function(d, i) { return yScale(d.y); })
                    .attr('height', function(d) { return yScale.rangeBand(); })
                    .attr('width', function(d) { return xScale(d.x); })
                    .on('mousemove', function(d,i) {
                    
                        var xPos = parseFloat(d3version3.select(this).attr('x')) / 2 + width / 2;
                        var yPos = parseFloat(d3version3.select(this).attr('y')) + yScale.rangeBand() / 2;
console.log(d3version3.select(this))
                        d3version3.select('#tooltipstack')
                        .style("top", (d3version3.event.pageY-70) + "px").style("left", (d3version3.event.pageX-10) + "px")
                        .text(d.x);

                        d3version3.select('#tooltipstack').classed('hidden', false);
                    })
                    .on('mouseout', function() {
                        d3version3.select('#tooltipstack').classed('hidden', true);
                    })

        svg.append('g')
            .attr('class', 'axis')
            .attr('transform', 'translate(0,' + height + ')')
            .call(xAxis);

        svg.append('g')
            .attr('class', 'axis')
            .call(yAxis);

       
        series.forEach(function(s, i) {
            svg.append('text')
                .attr('fill', 'black')
                .attr('x', i * 70 + 6)
                .attr('y', height + margins.right + 20)
                .text(s);
            svg.append('rect')
                .attr('fill', colores_google(i))
                .attr('width', 20)
                .attr('height', 20)
                .attr('x', i * 70 + 6 )
                .attr('y', height + margins.right + 30);
        });
        });
    }