import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

function TimelineChart() {
  const id1 = Math.random().toString();
  const id2 = Math.random().toString();
  const [initialized, setInitialized] = useState(false);
  const [series, setSeries] = useState([
    {
      name: "Presence",
      data:  [
        {
          x: 'Sunday',
          y: [
            new Date('2019-03-02T08:00:00').getTime(),
            new Date('2019-03-02T08:30:00').getTime()
          ]
        },
        {
          x: 'Sunday',
          y: [
            new Date('2019-03-02T09:00:00').getTime(),
            new Date('2019-03-02T10:00:00').getTime()
          ]
        },
        {
          x: 'Monday',
          y: [
            new Date('2019-03-02T08:00:00').getTime(),
            new Date('2019-03-02T11:00:00').getTime()
          ]
        },
        {
          x: 'Tuesday',
          y: [
            new Date('2019-03-02T08:00:00').getTime(),
            new Date('2019-03-02T12:00:00').getTime()
          ]
        },
        {
          x: 'Wednesday',
          y: [
            new Date('2019-03-02T09:00:00').getTime(),
            new Date('2019-03-02T11:00:00').getTime()
          ]
        },
        {
          x: 'Thursday',
          y: [
            new Date('2019-03-02T14:00:00').getTime(),
            new Date('2019-03-02T16:00:00').getTime()
          ]
        }
      ]
    },
  ]);
  const options1 = {
    chart: {
      id: id1,
      height: 350,
      foreColor: "#ccc",
      type: 'rangeBar',
    },
    grid: {
      strokeDashArray: 5,
      xaxis: {
        lines: {
            show: true
        }
      },
    },
    plotOptions: {
      bar: {
        horizontal: true
      }
    },
    xaxis: {
      type: 'datetime',
      min:  new Date(new Date().setHours(15,0,0,0)).getTime(),
      max:  new Date(new Date(new Date().setDate(new Date().getDate()+1)).setHours(1,0,0,0)).getTime(),
    },
    title: {
      text: 'In Office Hours',
      align: 'middle',
    }
  }

  useEffect(() => {
    if(initialized) return;
    console.log("min", options1.xaxis.min);
    console.log("max", options1.xaxis.max);
    const generateFakeData = () => {
      const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];
      const currentDate = new Date();
      const currentDayIndex = currentDate.getDay(); // 0 for Sunday, 1 for Monday, ..., 6 for Saturday

      const newSeries = daysOfWeek.map((day, index) => {
        if (index < currentDayIndex) {
          const timeRanges = [];
          let lastTime = 0;
          for (let i = 0; i < 3; i++) {
            // Generate fake data for days before the current day
            const startDate = new Date(currentDate);
            if(i===0) {
              startDate.setHours(16, 0, 0, 0)
              const time = startDate.getTime()
              startDate.setTime(time+(Math.random() * (0.8 - 0.5) + 0.5) * 60 * 60 * 1000)
            }
            else{
              startDate.setTime(lastTime+(Math.random() * (1 - 0.5) + 0.5) * 60 * 60 * 1000) 
            }
            const duration = (Math.random() * (2 - 0.5) + 0.5) * 60 * 60 * 1000
            lastTime = startDate.getTime() + duration
            timeRanges.push({
              x: day,
              y: [
                startDate.getTime(),
                lastTime
              ]
            })
            // const endDate = new Date(new Date(new Date().setDate(new Date().getDate()+1)).setHours(1,0,0,0)).getTime();
          }

          return timeRanges;
        } else {
          // For the current day and days in the future, no fake data generated
          return {
            x: day,
            y: []
          };
        }
      });

      console.log("sereis", newSeries);
      const flattenedSeries = newSeries.map(element => {
        // Check if the element is an array
        if (Array.isArray(element)) {
          // Flatten the array and return the result
          return element.flat();
        } else {
          // If the element is not an array, return it as is
          return element;
        }
      }).flat();
      
      // Log the resulting array
      console.log(flattenedSeries);
      setSeries([
        {
          name: "series-1",
          data: flattenedSeries,
        },
      ]);
    };

    generateFakeData();
    setInitialized(true);
  }, [initialized]);
  return (
    <div className="relative flex flex-col">
      <Chart
        type="rangeBar"
        width={640}
        height={"90%"}
        series={series}
        options={options1}
      ></Chart>
      <div className="flex flex-row gap-2 absolute ml-10">
          <button className='btn btn-sm p-1 border border-white tooltip tooltip-left'
           onClick={()=>{setInitialized(!initialized)}}
           data-tip='Last week'>
            <FaChevronLeft size={20}></FaChevronLeft>
          </button>
          <button className='btn btn-sm p-1 border border-white tooltip tooltip-right'
          data-tip='Next week'>
            <FaChevronRight size={20}></FaChevronRight>
          </button>
      </div>
    </div>
  );
}

export default TimelineChart;