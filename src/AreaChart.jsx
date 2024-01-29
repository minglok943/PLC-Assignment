import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";

function AreaChart() {
  const id1 = Math.random().toString();
  const id2 = Math.random().toString();
  const [series, setSeries] = useState([
    {
      name: "series-1",
      data: [],
    },
  ]);
  const options1 = {
    chart: {
      id: id1,
      foreColor: "#ccc",
      toolbar: {
        autoSelected: "pan",
        show: true,
      },
    },
    colors: ["#00BAEC"],
    stroke: {
      width: 3,
    },
    grid: {
      borderColor: "#555",
      clipMarkers: false,
      yaxis: {
        lines: {
          show: false,
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    fill: {
      gradient: {
        enabled: true,
        opacityFrom: 0.55,
        opacityTo: 0,
      },
    },
    markers: {
      size: 5,
      colors: ["#000524"],
      strokeColor: "#00BAEC",
      strokeWidth: 3,
    },
    tooltip: {
      theme: "dark",
    },
    xaxis: {
      type: "datetime",
    },
    yaxis: {
      min: 0,
      tickAmount: 4,
    },
  };

  const options2 = {
    chart: {
      id: id2,
      foreColor: "#ccc",
      brush: {
        target: id1,
        enabled: true,
      },
      selection: {
        enabled: true,
        fill: {
          color: "#fff",
          opacity: 0.4,
        },
        xaxis: {
          min: new Date().getTime()-(5 * 24 * 60 * 60 * 1000),
          max: new Date().getTime()-(1 * 24 * 60 * 60 * 1000),
        },
      },
    },
    colors: ["#FF0080"],
    stroke: {
      width: 2,
    },
    grid: {
      borderColor: "#444",
    },
    markers: {
      size: 0,
    },
    xaxis: {
      type: "datetime",
      tooltip: {
        enabled: false,
      },
    },
    yaxis: {
      tickAmount: 2,
    },
  };

  function generateDayWiseTimeSeries(baseval, count, yrange) {
    var i = 0;
    var series = [];
    while (i < count) {
      var x = baseval;
      var y =
        Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;

      series.push([x, y]);
      baseval += 86400000;
      i++;
    }
    return series;
  }

  useEffect(() => {
    const data = generateDayWiseTimeSeries(
      new Date("22 Dec 2023").getTime(),
        Math.ceil((new Date()-new Date("22 Dec 2023"))/ (24 * 60 * 60 * 1000)),
      {
        min: 30,
        max: 90,
      }
    );
    setSeries([
      {
        name: "series-1",
        data: data,
      },
    ]);
  }, []);
  return (
    <div className="flex flex-col">
      <Chart
        type="area"
        width={640}
        height={"45%"}
        series={series}
        options={options1}
      ></Chart>
      <Chart
        type="bar"
        width={"100%"}
        height={"45%"}
        series={series}
        options={options2}
      ></Chart>
    </div>
  );
}

export default AreaChart;