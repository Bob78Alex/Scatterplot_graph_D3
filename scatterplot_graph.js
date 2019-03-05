(function() {
  var url = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json";
  
  
  var margin = { top: 60, left: 60, bottom: 60, right: 90 } 
  var height = 480, width = 780;
  
  var ft = d3.time.format("%M:%S");
  
  
  var y = d3.scale.linear().range([0, height]);
  var x = d3.time.scale().range([0, width]);
  
 
  var xAxis = d3.svg.axis().scale(x).orient("bottom")
      .ticks(d3.time.seconds, 30)
      .tickFormat(ft);
  
  var yAxis = d3.svg.axis().scale(y).orient("left");

  var svg = d3.select("#scatterplot-stats").append("svg")
      .attr("height", height + margin.top + margin.bottom)
      .attr("width", width + margin.left + margin.right);
  
  svg.append("rect")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("x", 0)
        .attr("y", 0)
        .attr("fill", "white")
        .attr("fill-opacity", 0.8);
  
  svg = svg.append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
 
  var tooltip = d3.select("#scatterplot-stats").append("div")
      .attr("class", "tooltip");
  
 
  function doping(arg) {
    return arg !== "" ? "red" : "orange";
  }
  
  function showToolTip(d, i) {
    tooltip.style({
      "height": "125px",
      "width": "200px",
      "opacity": 0.9
    });
    var circle = d3.event.target; 
    var tippadding = 5, tipsize = { 
      dx: parseInt(tooltip.style("width")), 
      dy: parseInt(tooltip.style("height")) 
    };
  
    tooltip.style({
        "top": (d3.event.pageY - tipsize.dy - 5) + "px",
        "left": (d3.event.pageX - tipsize.dx - 5) + "px"
      }).html("<span><b>" + d.Name + ": " + d.Nationality + "<br/>" + 
            "Place: " + d.Place + " | Time: " + d.Time + "<br/>" + 
            "Year: " + d.Year + "<br/><br/>" + 
            "Doping: " + d.Doping + "</b></span>");
  }
  
  
  function hideToolTip(d, i) {
    tooltip.style({
      "height": 0,
      "width": 0,
      "opacity": 0
    }).html("");
  }
  
  
  function openEntry(d) {
    if(d.URL) {
      var win = window.open(d.URL, "_blank");
      win.focus();
    }
  }
  
  
  d3.json(url, (error, data) => {
    if(error) {
      throw new Error("d3.json error");
    }
    else {
      var fastest = d3.min(data.map((item) => { return ft.parse(item.Time); }));
      var slowest = d3.max(data.map((item) => { return ft.parse(item.Time); }));
      
      x.domain([slowest, fastest]);
      y.domain([1, d3.max(data, (d) => { return d.Place; }) + 1]);
  
      svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis)
        .append("text") //add text to the axis
          .attr("transform", "translate(" + width + ",-30)")
          .attr("dy", "1.8em")
          .attr("text-anchor", "end")
          .text("Race time for 13.8km");
      
      svg.append("g")
          .attr("class", "y axis")
          .call(yAxis)
        .append("text") 
          .attr("transform", "rotate(-90)")
          .attr("dy", "-0.8em")
          .attr("text-anchor", "end")
          .text("Rank");
      
     
      var cyclist = svg.selectAll(".cyclist")
          .data(data)
        .enter().append("g")
          .attr("class", "cyclist")
          .attr("x", (d) => { return x(ft.parse(d.Time)); })
          .attr("y", (d) => { return y(d.Place); });
      
      cyclist.append("circle")
          .attr("cx", (d) => { return x(ft.parse(d.Time)); })
          .attr("cy", (d) => { return y(d.Place); })
          .attr("r", 5)
          .attr("fill", (d) => { return doping(d.Doping); })
          
          .on("mouseover", showToolTip)
          .on("mouseout", hideToolTip)
          .on("click", openEntry);
      
      
      cyclist.append("text")
          .attr("x", (d) => { return x(ft.parse(d.Time)) + 7; })
          .attr("y", (d) => { return y(d.Place) + 5; })
          .text((d) => { return d.Name; });
      
      
      var isDoped = svg.append("g")
          .attr("transform", "translate(" + (width - 150) + "," + (height - 100) + ")")
          .append("text") 
            .attr("x", 10)
            .attr("y", 5)
            .attr("fill", "red")
            .text("* Doping allegiance");;
      var isNotDoped = svg.append("g")
          .attr("transform", "translate(" + (width - 150) + "," + (height - 80) + ")")
          .append("text")
            .attr("x", 10)
            .attr("y", 5)
            .attr("fill", "orange")
            .text("* No doping allegiance");
    } 
    
  });
}());