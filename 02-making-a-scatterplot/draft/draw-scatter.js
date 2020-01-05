async function drawScatter() {
  //Access data

  let dataset = await d3.json("./../../my_weather_data.json");
  //console.log(dataset)
  const xAccessor = d => d.dewPoint;
  const yAccessor = d => d.humidity;
  const colorAccessor = d => d.cloudCover;

  //Create chart dimensions

  const width = d3.min([window.innerWidth * 0.9, window.innerHeight * 0.9]);
  let dimensions = {
    width: width,
    height: width,
    margin: {
      top: 10,
      right: 10,
      bottom: 50,
      left: 50
    }
  };
  dimensions.boundedWidth =
    dimensions.width - dimensions.margin.left - dimensions.margin.right;
  dimensions.boundedHeight =
    dimensions.height - dimensions.margin.top - dimensions.margin.bottom;

  //Draw canvas

  const wrapper = d3
    .select("#wrapper")
    .append("svg")
    .attr("width", dimensions.width)
    .attr("height", dimensions.height);

  const bounds = wrapper
    .append("g")
    .style(
      "transform",
      `translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)`
    );

  //Create Scales

  const xScale = d3
    .scaleLinear()
    .domain(d3.extent(dataset, xAccessor))
    .range([0, dimensions.boundedWidth])
    .nice();

  const yScale = d3
    .scaleLinear()
    .domain(d3.extent(dataset, yAccessor))
    .range([dimensions.boundedHeight, 0])
    .nice();

  const colorScale = d3
    .scaleLinear()
    .domain(d3.extent(dataset, colorAccessor))
    .range(["skyblue", "darkslategrey"]);

  //console.log(d3.extent(dataset, yAccessor))
  //console.log(yScale.domain())

  //draw data

  const dots = bounds
    .selectAll("circle")
    .data(dataset)
    .enter()
    .append("circle")
    .attr("cx", d => xScale(xAccessor(d)))
    .attr("cy", d => yScale(yAccessor(d)))
    .attr("r", 4)
    .attr("fill", d => colorScale(colorAccessor(d)));

  // function drawDots(dataset, color) {
  //   const dots = bounds.selectAll("circle").data(dataset);

  //   dots
  //     .enter()
  //     .append("circle")
  //     .attr("cx", d => xScale(xAccessor(d)))
  //     .attr("cy", d => yScale(yAccessor(d)))
  //     .attr("r", 5)
  //     .attr("fill", color);
  // }

  // drawDots(dataset.slice(0, 200), "darkgrey");

  // setTimeout(() => {
  //   drawDots(dataset, "cornflowerblue");
  // }, 1000);

  //Draw Peripherals

  const xAxisGenerator = d3.axisBottom().scale(xScale);

  const xAxis = bounds
    .append("g")
    .call(xAxisGenerator)
    .style("transform", `translateY(${dimensions.boundedHeight}px)`);

  const xAxisLabel = xAxis
    .append("text")
    .attr("x", dimensions.boundedWidth / 2)
    .attr("y", dimensions.margin.bottom - 10)
    .attr("fill", "black")
    .style("font-size", "1.4em")
    .html("Dew Point (&deg;F)");

  const yAxisGenerator = d3
    .axisLeft()
    .scale(yScale)
    .ticks(4);

  const yAxis = bounds.append("g").call(yAxisGenerator);

  const yAxisLabel = yAxis
    .append("text")
    .attr("x", -dimensions.boundedHeight / 2)
    .attr("y", -dimensions.margin.left + 10)
    .attr("fill", "black")
    .style("font-size", "1.4em")
    .text("Relative Humidity")
    .style("transform", "rotate(-90deg)")
    .style("text-anchor", "middle");

  const legendGroup = wrapper
    .append("g")
    .attr(
      "transform",
      `translate(${350},${
        dimensions.width > 50
          ? dimensions.boundedHeight - 20
          : dimensions.boundedHeight * 1
      })`
    );

  const legendTitle = legendGroup
    .append("text")
    .attr("y", -23)
    .attr("class", "legend-title")
    .text("Weather");

  const legendByline = legendGroup
    .append("text")
    .attr("y", -9)
    .attr("class", "legend-byline")
    .text("Dew point and humidity");

  const defs = wrapper.append("defs");
  const legendGradientId = "legend-gradient";
  const gradient = defs
    .append("linearGradient")
    .attr("id", legendGradientId)
    .selectAll("stop")
    .data(colorScale.range())
    .enter()
    .append("stop")
    .attr("stop-color", d => d)
    .attr(
      "offset",
      (d, i) =>
        `${
          (i * 100) / 2 // 2 is one less than our array's length
        }%`
    );
  const legendWidth = 120;
  const legendHeight = 16;
  const legendGradient = legendGroup
    .append("rect")
    .attr("x", -legendWidth / 2)
    .attr("height", legendHeight)
    .attr("width", legendWidth)
    .style("fill", `url(#${legendGradientId})`);

  const legendValueRight = legendGroup
    .append("text")
    .attr("class", "legend-value")
    .attr("x", legendWidth / 2 + 10)
    .attr("y", legendHeight / 2)
    .text(`${d3.format(".1f")(80)} F`);

  const legendValueLeft = legendGroup
    .append("text")
    .attr("class", "legend-value")
    .attr("x", -legendWidth / 2 - 10)
    .attr("y", legendHeight / 2)
    .text(`${d3.format(".1f")(-10)} F`)
    .style("text-anchor", "end");
}
drawScatter();
