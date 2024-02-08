import { useState, useEffect, useRef } from 'react'
import './App.css'
import { IoPeople } from "react-icons/io5";
import { PiVideoDuotone } from "react-icons/pi";


import { GiClick } from "react-icons/gi";

import TimelineChart from './TimelineChart';
import P311 from "./assets/311.mp4"
import P312 from "./assets/312.mp4"
import P313 from "./assets/313.mp4"
import P314 from "./assets/314.mp4"
import P315 from "./assets/315.mp4"
import pattern from "./assets/pattern.jpeg"

import io from "socket.io-client";
const socket = io("http://localhost:4000");
socket.connect();
socket.on("connect", () => {
  console.log("WebSocket connected");
  // You can start sending and receiving messages here
});

function App() {
  const [result, setResult] = useState(
    {RESULT_NVL: false,RESULT1_NVL: false,RESULT2_NVL: false,RESULT3_NVL: false,RESULT4_NVL: false,});
  useEffect(()=>{
    socket.on("result", (data)=>{
      console.log("socket", data);
      setResult(data);
    })
  }, [])
  return (
    <>
      <div className='w-screen h-screen overflow-auto bg-slate-900'>
        <div className='flex flex-col gap-2'>
          <div className='flex items-center border rounded-xl p-3 gap-48'>
            <h1 className='text-3xl font-extrabold text-white'>Group G01</h1>
            <h1 className='text-3xl font-extrabold text-white ml-[240px]'>Lecturer Presence Kiosk</h1>
            <h1 className='text-3xl font-extrabold text-white ml-[180px]'>Assignment</h1>
          </div>
          <div className='relative flex justify-center h-96 overflow-hidden'>
            <img src={pattern} className='absolute object-fill w-[50%]'></img>
          </div>
          <div className='flex flex-wrap p-3 gap-6 justify-center mt-6'>
            <PresenceTag data={result["RESULT_NVL"]} num={'P08-311'} lecturer={'Dr. Sophan'} video={P311}></PresenceTag>
            <PresenceTag data={result["RESULT1_NVL"]} num={'P08-312'} lecturer={'Prof. Athif'} video={P312}></PresenceTag>
            <PresenceTag data={result["RESULT2_NVL"]} num={'P08-313'} lecturer={'Prof. Sevia'} video={P313}></PresenceTag>
            <PresenceTag data={result["RESULT3_NVL"]} num={'P08-314'} lecturer={'Dr. Lim CS'} video={P314}></PresenceTag>
            <PresenceTag data={result["RESULT4_NVL"]} num={'P08-315'} lecturer={'Dr. Shafis'} video={P315}></PresenceTag>
          </div>
        </div>
      </div>
    </>
  )
}

export default App

function PresenceTag({data, num, lecturer, video}){
  const [visible, setVisible] = useState(false);
  const dialogId = Math.random().toString();
  const videoRef = useRef();
  useEffect(()=>{
    if(!videoRef.current) return;
    videoRef.current.playbackRate = 2.0;
  },[])
  return(
    <>
    <button onClick={()=>{setVisible(!visible); document.getElementById(dialogId).showModal()}}>
    <div className='relative flex p-5 gap-4 border rounded-lg shadow-lg shadow-cyan-500/50'>
      <div className='flex flex-col'>
        <h1 className='text-2xl font-extrabold text-white'>{lecturer}</h1>
        <h1 className={`text-1xl font-extrabold ${data?'text-teal-300':'text-red-600'}`}>
          {data?'Present':'Absent'}
        </h1>
        <h1 className='text-emerald-300'>Room No: {num}</h1>
      </div>
      <IoPeople size={60} color={data?'cyan':'red'}></IoPeople>
      <GiClick size={25} className='absolute bottom-4 right-6'></GiClick>
    </div>
    </button>

    <dialog id={dialogId} className="modal">
      <div className="relative flex flex-row bg-slate-800 flex w-max p-10 border rounded-lg justify-center gap-10">
        <div className='flex flex-col gap-3'>
          <h1 className='font-bold text-2xl'>Direction to Room {num}</h1>
          <video ref={videoRef} src={video} loop={true} controls width={600} autoPlay={visible} muted={true} ></video>
        </div>
          <TimelineChart presence={data}></TimelineChart>
          <form method='dialog'>
            <button className='absolute btn border border-white bottom-5 right-5' onClick={()=>{setVisible(!visible)}}>Close</button>
          </form>
      </div>
    </dialog>
    </>
  )
}
