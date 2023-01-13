// Used these as referenes
//https://www.d3-graph-gallery.com/graph/custom_axis.html
//https://www.d3-graph-gallery.com/graph/scatter_basic.html
//https://medium.com/@sabahatiqbal/building-a-scatter-plot-with-d3-js-66178fde56ac
//http://bl.ocks.org/weiglemc/6185069

var margins = {top:20, right:20, bottom: 30, left: 80 };
var totalWidth = 1100;
var totalHeight = 600;

var innerWidth = totalWidth - margins.left - margins.right;
var innerHeight = totalHeight - margins.top - margins.bottom;


function scatterP(){
    let scatterPlot = d3.select("#scatter").append("svg")
        .attr("width", innerWidth + margins.left + margins.right)
        .attr("height", innerHeight + margins.top + margins.bottom)
        .append("g")
        .attr("transform", "translate(" + margins.left + "," + margins.top + ")");

    let chart2 = d3.select("#scatter2");
    let chart3 = d3.select("#scatter3");


    let data = d3.csv("ESportEarningsv2.csv", function(d){
        return{
            name: d['Name'],
            pl: +d['Players'],
            tour: +d['Tournaments'],
            earn: +d['Earnings'],
            genre: d['Genre']
        };
    }).then(function (data) {
        console.log(data);



        //Scatterplot based on this
        //http://bl.ocks.org/weiglemc/6185069

   


        var xValue = function(d) { return d.tour},
            xSca = d3.scaleLinear().range([0, innerWidth]).nice(),
            xMap = function(d){return xSca(xValue(d));},
            xAxis = d3.axisBottom(xSca);

        var yValue = function(d){ return d.pl},
            ySca = d3.scaleLinear().range([innerHeight, 0]).nice(),
            yMap = function(d){return ySca(yValue(d));},
            yAxis = d3.axisLeft(ySca);

        xSca.domain([d3.min(data, xValue)-1, d3.max(data, xValue)+1]);
        ySca.domain([d3.min(data, yValue)-1, d3.max(data, yValue)+1]);

        var earnValue = function(d){return d.earn},
            earnSca = d3.scaleSqrt().range([3, 50]).domain([d3.min(data, earnValue), d3.max(data, earnValue)])


        // x_axis
        var xAA = scatterPlot.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + (innerHeight) + ")")
            .call(xAxis)

        scatterPlot.append('text')
            .attr("class", "label")
            .attr("x", innerWidth)
            .attr("y", innerHeight - 20)
            .style("text-anchor", "end")
            .text("Number of Tournaments");

        //y_axis
        var yAA = scatterPlot.append("g")
            .attr("class", "y_axis")
            .call(yAxis)

        scatterPlot.append('text')
            .attr("class", "label")
            .attr("transform", "rotate(-90)")
            .attr("x", 0 - innerHeight/ 2 )
            .attr("y", -50)
            .style("text-anchor", "end")
            .text("Number of Players")


        // Set up colors for each genre
        let color = d3.scaleOrdinal()
            .domain([
                "Strategy",
                "Sports",
                "FPS",
                "TPS",
                "Fighting",
                "Collectable Card",
            ]).range(
                ["#90BE6D", "#F8961E", "#F94144", "#43AA8B",
                    "#f55f09", "#577590"]
            );

        // Legend
        var legend = scatterPlot.selectAll(".legend")
            .data(color.domain())
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

        legend.append("rect")
            .attr("x", innerWidth - 18)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", color);

        // draw legend text
        legend.append("text")
            .attr("x", innerWidth - 24)
            .attr("y", 9)
            .attr("dy", ".35em")
            .style("text-anchor", "end")
            .text(function(d) { return d;})

        // Filtering by genre

        let deData = data;
        let sportData = data.filter(function(d) { return (d.genre == "Sports")});
        let strategyData = data.filter(function(d) { return (d.genre == "Strategy")});
        let fpsData = data.filter(function(d) { return (d.genre == "FPS")});
        let tpsData = data.filter(function(d) { return (d.genre == "TPS")});
        let fightingData = data.filter(function(d) { return (d.genre == "Fighting")});
        let cardData = data.filter(function(d) { return (d.genre == "Collectable Card")});



        d3.select("#genres").on("change", function(d){
          var selectedOption = d3.select(this).property("value")
            console.log(selectedOption);
            // https://stackoverflow.com/questions/8140862/how-to-select-a-value-in-dropdown-javascript
            if(selectedOption == "Sports"){
                update(sportData);
                console.log(document.getElementById("genres").value)
            }else if (selectedOption == "Strategy"){
                update(strategyData);
                console.log(document.getElementById("genres").value)

            }else if (selectedOption == "FPS"){
                update(fpsData);
                console.log(document.getElementById("genres").value)

            }else if (selectedOption == "TPS"){
                update(tpsData);
                console.log(document.getElementById("genres").value)

            }else if (selectedOption == "Fighting"){
                update(fightingData);
                console.log(document.getElementById("genres").value)

            }else if (selectedOption == "Collectable Card"){
                update(cardData);
                console.log(document.getElementById("genres").value)

            }else{
                update(deData);
                console.log(document.getElementById("genres").value)

            }
        })



        //tool tips
        // http://bl.ocks.org/williaster/af5b855651ffe29bdca1 //v6
        //https://bl.ocks.org/d3noob/180287b6623496dbb5ac4b048813af52

        var tooltip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        var tipMouseover = function(event, d){
            var co = color(d.genre)
            tooltip.transition()
                .duration(200) // in ms
                .style("opacity", 0.9);
            tooltip.html(d.name + "<br/>" + "<span style='color:" + co + ";'>" + d.genre +  "</span><br/>" + "Total Earnings: " + d.earn + "$" + "<br/>" + "Tournaments: "
                + d.tour + "</span><br/>"+ "Players: " + d.pl + "<br/>")
                .style("left", (event.pageX ) + "px")
                .style("top", (event.pageY - 28) + "px");
            console.log(d);
        };

        var tipMouseout = function(d){
            tooltip.transition()
                .duration(200)
                .style("opacity", 0);
        };




        // Zooming

        var clip = scatterPlot.append("defs").append("SVG:clipPath")
            .attr("id", "clip")
            .append("SVG:rect")
            .attr("width", innerWidth )
            .attr("height", innerHeight )
            .attr("x", 0)
            .attr("y", 0);

        var scatter = scatterPlot.append('g')
            .attr("clip-path", "url(#clip)")




        // zooming https://www.d3-graph-gallery.com/graph/interactivity_zoom.html#axisZoom
        // update to v6 https://observablehq.com/@d3/d3v6-migration-guide


        scatter.append("rect")
            .attr("width", innerWidth)
            .attr("height", innerHeight)
            .style("fill", "none")
            .style("pointer-events", "all")
            .attr('transform', 'translate(' + margins.left + ',' + margins.top + ')')
            .call(d3.zoom()
                .scaleExtent([.5, 20])  // This control how much you can unzoom (x0.5) and zoom (x20)
                .extent([[0, 0], [innerWidth, innerHeight]])
                .on("zoom", zooming))



        function zooming(event,d){
            newX = event.transform.rescaleX(xSca);
            newY = event.transform.rescaleY(ySca);

            xAA.call(d3.axisBottom(newX))
            yAA.call(d3.axisLeft(newY))

            scatter.selectAll("circle")
                .attr("cx", function(d){return newX(xValue(d));},)
                .attr("cy", function(d){return newY(yValue(d));},)

        }

        //Scale




        // //draw dots
        scatter.selectAll(".dot")
            .data(data)
            .enter().append("circle")
            .attr("class", "dot")
            .attr("r", function(d){
                return earnSca(d.earn);
            })
            .attr("cx", xMap)
            .attr("cy", yMap)
            .style("fill", function (d) {
                return color(d.genre);
            })
            .on("mouseover", tipMouseover)
            .on("mouseout", tipMouseout);

        // updates the chart using the design pattern
        //https://bost.ocks.org/mike/join/

        function update(adata) {
            var updating = scatter.selectAll(".dot").data(adata);

            updating.exit().remove()

            updating.enter().append("circle")
                .attr("class", "dot")
                .merge(updating)
                .attr("r", function(d){
                    return earnSca(d.earn);
                })
                .merge(updating)
                .attr("cx", xMap)
                .attr("cy", yMap)
                .style("fill", function (d) {
                    return color(d.genre);
                })
                .on("mouseover", tipMouseover)
                .on("mouseout", tipMouseout);



        }




    });
}
