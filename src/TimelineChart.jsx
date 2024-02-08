import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

function TimelineChart({presence}) {
  const id1 = Math.random().toString();
  const id2 = Math.random().toString();
  const [week, setWeek] = useState(0);
  const [day, setDay] = useState("current week");

  const [initialized, setInitialized] = useState(false);
  const [series, setSeries] = useState([
    {
      name: "Presence",
      data:  [
        {
          x: 'Sunday',
          y: [
            new Date('2024-01-30T08:00:00').getTime(),
            new Date('2024-01-30T08:30:00').getTime()
          ]
        },
        {
          x: 'Monday',
          y: [
            new Date('2024-01-30T08:00:00').getTime(),
            new Date('2024-01-30T11:00:00').getTime()
          ]
        },
        {
          x: 'Tuesday',
          y: [
            new Date('2024-01-30T08:00:00').getTime(),
            new Date('2024-01-30T12:00:00').getTime()
          ]
        },
        {
          x: 'Wednesday',
          y: [
            new Date('2024-01-30T09:00:00').getTime(),
            new Date('2024-01-30T11:00:00').getTime()
          ]
        },
        {
          x: 'Thursday',
          y: [
            new Date('2024-01-30T14:00:00').getTime(),
            new Date('2024-01-30T16:00:00').getTime()
          ]
        },
        {
          x: 'Sunday',
          y: [
            new Date('2024-01-30T09:00:00').getTime(),
            new Date('2024-01-30T10:00:00').getTime()
          ]
        },
      ]
    },
  ]);
  const [backup, setBackup] = useState();
  const [options1, setOptions] = useState({
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
  })

  useEffect(() => {
    if (week === 0) {
      setDay("current week");
    } else {
      // Calculate the start and end dates of the previous week
      const currentDate = new Date();
      const lastWeekStartDate = new Date();
      lastWeekStartDate.setDate(currentDate.getDate() - week*7 - currentDate.getDay());
      console.log("lastweekstart", lastWeekStartDate);
      const lastWeekEndDate = new Date(lastWeekStartDate);
      lastWeekEndDate.setDate(lastWeekStartDate.getDate() + 4);
      console.log("lastweekend", lastWeekEndDate);

      // Format the dates as 'DD/MM/YYYY'
      const formattedStartDate = `${lastWeekStartDate.getDate()}/${lastWeekStartDate.getMonth() + 1}/${lastWeekStartDate.getFullYear()}`;
      const formattedEndDate = `${lastWeekEndDate.getDate()}/${lastWeekEndDate.getMonth() + 1}/${lastWeekEndDate.getFullYear()}`;

      setDay(`${formattedStartDate} - ${formattedEndDate}`);
      setOptions(prevOptions => ({
        ...prevOptions,
        xaxis: {
          ...prevOptions.xaxis,
          min:  new Date(new Date().setHours(15,0,0,0)).getTime(),
          max:  new Date(new Date(new Date().setDate(new Date().getDate()+1)).setHours(1,0,0,0)).getTime(),
        },
      }));
    }
  }, [week, options1]);
  
  useEffect(() => {
    if(initialized) return;
    if(week === 0 && backup){
      setSeries(backup);
      return;
    }
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];
    const generateFakeData = () => {
      const currentDate = new Date();
      let currentDayIndex = currentDate.getDay(); // 0 for Sunday, 1 for Monday, ..., 6 for Saturday
      if(week>0){
        currentDayIndex = 5;
      }
      const newSeries = daysOfWeek.map((day, index) => {
        if (index < currentDayIndex) {
          const timeRanges = [];
          let lastTime = 0;
          const num = Math.round(Math.random()+2);
          for (let i = 0; i < num; i++) {
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

      // console.log("sereis", newSeries);
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
    
      if(week === 0){
        setBackup([
          {
            name: "presence",
            data: flattenedSeries,
          },
        ]);
        setSeries([
          {
            name: "presence",
            data: flattenedSeries,
          },
        ]);
      }else{
        setSeries([
          {
            name: "presence",
            data: flattenedSeries,
          },
        ]);
      }
    };

    generateFakeData();
    setInitialized(true);
  }, [initialized, week, backup]);

  useEffect(()=>{
    if(!presence || !backup) {
      setOptions(prevOptions => ({
        ...prevOptions,
        xaxis: {
          ...prevOptions.xaxis,
          min:  new Date(new Date().setHours(15,0,0,0)).getTime(),
          max:  new Date(new Date(new Date().setDate(new Date().getDate()+1)).setHours(1,0,0,0)).getTime(),
        },
      }));
      return;
    }
    const gmtOffset = 8*60*60*1000;
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];
    let start = new Date();
    if(start.getDay() > 4) return;
    const id = setInterval(()=>{
      console.log("add");
      const end = new Date()
      const endTime = end.getTime();
      const newData = {
        x: daysOfWeek[end.getDay()],
        y: [
          start.getTime() + gmtOffset - 250,
          endTime + gmtOffset
        ]
      };
      const newSeries = [{
        name: 'Presence',
        data: [...backup[0].data, newData]
      }]
      setBackup(newSeries);
      if(week === 0){
        setSeries(newSeries);
        setOptions(prevOptions => ({
          ...prevOptions,
          xaxis: {
            ...prevOptions.xaxis,
            min: start.getTime() - 60000 + gmtOffset,
            max: end.getTime() + 10000 + gmtOffset,
          },
        }));
        console.log("options", options1);
      }
      start.setTime(endTime);
    }, 5000)
    return  ()=>{
      clearInterval(id);
    }
  },[presence, backup, week. options1])

  return (
    <div className="relative flex flex-col">
      <Chart
        type="rangeBar"
        width={640}
        height={"90%"}
        series={series}
        options={options1}
      ></Chart>
      <div className="flex flex-row gap-2 absolute right-[160px]">
          <button className='btn btn-sm p-1 border border-white tooltip tooltip-left'
           onClick={()=>{setWeek(week+1);setInitialized(false);}}
           data-tip='Last week'>
            <FaChevronLeft size={20}></FaChevronLeft>
          </button>
          <button className='btn btn-sm p-1 border border-white tooltip tooltip-right'
          data-tip='Next week'
          onClick={()=>{if(week>0)setWeek(week-1);setInitialized(false);}}>
            <FaChevronRight size={20}></FaChevronRight>
          </button>
      </div>
      <h1 className="absolute ml-5 font-extrabold">{day}</h1>
    </div>
  );
}

export default TimelineChart;