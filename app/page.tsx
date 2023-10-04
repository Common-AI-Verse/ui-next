'use client';

import Image from 'next/image'
import { useState, useEffect } from 'react';
import { IoTriangle } from 'react-icons/io5';
import UnityLoader from '../components/UnityLoader';

export default function Home() {

    const [interactionsRecorded, setinteractionsRecorded] = useState(0);
    const [roomOcupied, setroomOcupied] = useState("FREE");
    const [dataStatus, setdataStatus] = useState("displaying");
    const [emotionsData, setemotionsData] = useState({
        "happiness": 0.0,
        "anger": 0.0,
        "sadness": 0.0,
        "relaxation": 0.0
    });
    const [humanData, sethumanData] = useState([
        {
            "movementQuantity": 0.0,
            "speed": 0.0,
            "motionRange": 0.0,
            "proximity": 0.0
        },
        {
            "movementQuantity": 0.0,
            "speed": 0.0,
            "motionRange": 0.0,
            "proximity": 0.0
        },
        {
            "movementQuantity": 0.0,
            "speed": 0.0,
            "motionRange": 0.0,
            "proximity": 0.0
        },
        
        
     ]
    );

  return (
    <div className="h-screen w-full p-4">
        <div className="h-full border-2 border-graphics-red p-3">
            <div className="h-full border-2 border-graphics-green p-3">
                <div className="h-full border-2 border-graphics-blue p-5">

                    {/*UI Design*/}

                    <div className="w-full h-full flex flex-col font-plex">

                        {/* First text block */}

                        <div className="grid grid-rows-2 grid-cols-2 w-full border-white border-b-[3px] gap-y-3 pb-2">
                            <Image
                            src="/cLogo.png"
                            alt="Common AI Verse Logo"
                            width={781}
                            height={68}
                            className="w-9/12 pt-2"
                            />
                            <div className="w-full text-right">
                                <p className="font-light text-lg l-auto">Duration: 5 min</p>
                                <p className="font-light text-lg uppercase">Interacciones recorded: { interactionsRecorded }</p>
                            </div>
                            <div className="text-2xl uppercase mt-auto mb-3 font-light"><p>AI STATUS: LEARNING</p></div>
                            <div className="text-2xl uppercase mt-auto mb-3 text-right"><p className="">ROOM status: { roomOcupied }</p></div>
                        </div>

                        {/* Second text block */}

                        <div className="flex flex-col w-full pt-6 px-4 border-white border-b-[3px] pb-11">

                        <p className="font-plex font-semibold text-2xl uppercase">UNDERSTANDING THE COMMON-AI-VERSE</p>

                        <p className="font-plex font-extralight text-[21px] pt-4">COMMON-AI-VERSE es una interfaz inversiva que comunica los estados
                        anímicos de dos grandes cuerpos sociales: La inteligencia artificial y la especie humana.
                        <br />
                        La instalación propone una relación basada en la inteligencia colectiva
                        que es retada para entrar en empatía con una inteligencia artificial.
                        </p>

                        <p className="font-plex font-semibold text-2xl uppercase pt-6">INSTRUCCIONES</p>
                        <ul className="flex flex-col  gap-4 text-[21px] font-extralight pt-4">
                            <li>
                                <p className="">1° Participa con al menos un acompañante. Máximo de 3 personas</p>
                            </li>
                            <li>
                                <p className="">2° Reacciona a los estados anímicos de la IA</p>
                            </li>
                            <li>
                                <p className="">3° Enseña a la IA a sentir en grupo</p>
                            </li>
                            <li>
                                <p className="">4° Vuelve a estar monitor para ver el resultado</p>
                            </li>

                        </ul>
                        
                        </div>

                        {/* Data display */}

                        {   

                        dataStatus == "displaying" &&

                        (
                            <div className="flex flex-row w-full gap-14">

                                <div className="flex flex-col h-auto pt-10 w-1/4">

                                {/* Emotions data display */}

                                <ul className="flex flex-col w-full pl-5 gap-4 pb-14">

                                    <li className="flex flex-row w-full gap-3">
                                        <IoTriangle className="text-4xl"/>
                                        <p className="font-semibold text-xl my-auto">Happy: { `${emotionsData.happiness}`}</p>
                                    </li>

                                    <li className="flex flex-row w-full gap-3">
                                        <IoTriangle className="text-4xl"/>
                                        <p className="font-semibold text-xl my-auto">Angry: { `${emotionsData.anger }`}</p>
                                    </li>

                                    <li className="flex flex-row w-full gap-3">
                                        <IoTriangle className="text-4xl"/>
                                        <p className="font-semibold text-xl my-auto">Sad: { `${emotionsData.sadness }`}</p>
                                    </li>

                                    <li className="flex flex-row w-full gap-3">
                                        <IoTriangle className="text-4xl"/>
                                        <p className="font-semibold text-xl my-auto">Relax: { `${emotionsData.relaxation }`}</p>
                                    </li>
                                </ul>


                                <span className="pl-3">
                                
                                {/* Human 01 resume */}

                                <div className="flex align-center justify-center w-full bg-accents-red h-11 border-gray-400 border-2">
                                    <p className="font-light text-xl my-auto text-gray-200">Human 01 Resume</p>
                                </div>

                                <ul className="flex flex-col w-full font-extralight pt-5 text-base">
                                    <li>
                                    <p>
                                    Movement Quantity<br/>
                                    { humanData[0].movementQuantity }                           
                                    </p>
                                    </li>

                                    <li>
                                    <p>
                                    Speed<br/>
                                    { humanData[0].speed }                           
                                    </p>
                                    </li>

                                    <li>
                                    <p>
                                    Motion Range<br/>
                                    { humanData[0].motionRange }                           
                                    </p>
                                    </li>

                                    <li>
                                    <p>
                                    Proximidad<br/>
                                    { humanData[0].proximity }                           
                                    </p>
                                    </li>

                                </ul>

                                {/* Human 02 resume */}

                                <div className="flex align-center justify-center w-full bg-accents-green h-11 border-gray-400 border-2 mt-8">
                                    <p className="font-regular text-xl my-auto text-black">Human 02 Resume</p>
                                </div>

                                <ul className="flex flex-col  w-full font-extralight pt-5 text-base">
                                    <li>
                                    <p>
                                    Movement Quantity<br/>
                                    { humanData[1].movementQuantity }                           
                                    </p>
                                    </li>

                                    <li>
                                    <p>
                                    Speed<br/>
                                    { humanData[1].speed }                           
                                    </p>
                                    </li>

                                    <li>
                                    <p>
                                    Motion Range<br/>
                                    { humanData[1].motionRange }                           
                                    </p>
                                    </li>

                                    <li>
                                    <p>
                                    Proximidad<br/>
                                    { humanData[1].proximity }                           
                                    </p>
                                    </li>

                                </ul>

                                {/* Human 03 resume */}

                                <div className="flex align-center justify-center w-full bg-accents-blue h-11 border-gray-400 border-2 mt-8">
                                    <p className="font-regular text-xl my-auto text-gray-200">Human 03 Resume</p>
                                </div>

                                <ul className="flex flex-col  w-full font-extralight pt-5 text-base">
                                    <li>
                                    <p>
                                    Movement Quantity<br/>
                                    { humanData[2].movementQuantity }                           
                                    </p>
                                    </li>

                                    <li>
                                    <p>
                                    Speed<br/>
                                    { humanData[2].speed }                           
                                    </p>
                                    </li>

                                    <li>
                                    <p>
                                    Motion Range<br/>
                                    { humanData[2].motionRange }                           
                                    </p>
                                    </li>

                                    <li>
                                    <p>
                                    Proximidad<br/>
                                    { humanData[2].proximity }                           
                                    </p>
                                    </li>

                                </ul>

                                </span>

                                </div>

                                <div className="flex flex-col h-full pt-10 w-3/4 gap-12">
                                    <p className="w-full font-light text-center text-xl text-gray-200">Descarga el resultado y contacta con tu grupo</p>

                                    <div id="qrCode" className="w-[310px] h-[310px] bg-white mx-auto text-black text-center text-3xl">
                                        <p className="pt-36">QR CODE</p>
                                        </div>

                                    <UnityLoader />

                                    <div id="unityPlayer" className="w-[640px] h-[640px] mx-auto text-black text-center text-3xl">
                                      <canvas id="unity-canvas" className="w-full h-full"></canvas>
                                    </div>

                                </div>

                            </div>


                        )


                        }


                    </div>

{/*         <div className="flex flex-col w-full border-l-2 border-white">

                <div className="w-full h-full p-8">

                    <div className="flex flex-row w-full">
                        <h1 className="text-lg">CURRENT INTERACTION RESULTS</h1>
                        <div className="flex flex-col ml-auto uppercase">
                            <p className="">TIME: 16:43:00</p>
                            <p className="">DATE: 23/10/23</p>
                        </div>
                    </div>

                    <div className="flex flex-row h-full w-full gap-24">

                        <ul className="flex flex-col w-7/12 gap-3">

                            <li className="flex flex-col gap-3">
                                <p>Participation level</p>
                                <div className="border-2 border-white w-full h-4">
                                <div className="bg-white w-[40%] h-3"></div>
                                </div>
                            </li>

                            <li className="flex flex-col gap-3">
                                <p>Connection frequency</p>
                                <div className="border-2 border-white w-full h-4">
                                <div className="bg-white w-[57%] h-3"></div>
                                </div>
                            </li>

                            <li className="flex flex-col gap-3">
                                <p>Empathy level</p>
                                <div className="border-2 border-white w-full h-4">
                                <div className="bg-white w-[5%] h-3"></div>
                                </div>
                            </li>

                            <li className="flex flex-col gap-3">
                                <p>Empathy level</p>
                                <div className="border-2 border-white w-full h-4">
                                <div className="bg-white w-[18%] h-3"></div>
                                </div>
                            </li>

                            <li className="flex flex-col gap-3">
                                <p>Empathy level</p>
                                <div className="border-2 border-white w-full h-4">
                                <div className="bg-white w-[29%] h-3"></div>
                                </div>
                            </li>

                        </ul>
                        
                        <div className="flex flex-col pl-auto pt-12 gap-3">
                        <p className="text-center font-bold text-xl">SCAN ME TO GET THE RESULTS</p>    
                        <div id="QRCode" className="w-[300px] h-[300px] bg-white "></div>
                        </div>
                    </div>
                    

                </div>

                <div className="w-full h-full border-t-2 border-white p-8">

                <div className="flex flex-row w-full">
                        <h1 className="text-lg">LAST INTERACTION</h1>
                        <div className="flex flex-col ml-auto uppercase">
                            <p className="">TIME: 16:43:00</p>
                            <p className="">DATE: 23/10/23</p>
                        </div>
                    </div>

                        <div className="flex flex-row h-full w-full gap-24">

                        <ul className="flex flex-col w-7/12 gap-3">

                            <li className="flex flex-col gap-3">
                                <p>Participation level</p>
                                <div className="border-2 border-white w-full h-4">
                                <div className="bg-white w-[50%] h-3">                                 
                                </div>

                                </div>
                            </li>

                            <li className="flex flex-col gap-3">
                                <p>Connection frequency</p>
                                <div className="border-2 border-white w-full h-4">
                                <div className="bg-white w-[75%] h-3"></div>
                                </div>
                            </li>

                            <li className="flex flex-col gap-3">
                                <p>Empathy level</p>
                                <div className="border-2 border-white w-full h-4">
                                <div className="bg-white w-[25%] h-3"></div>
                                </div>
                            </li>

                            <li className="flex flex-col gap-3">
                                <p>Empathy level</p>
                                <div className="border-2 border-white w-full h-4">
                                <div className="bg-white w-[95%] h-3"></div>
                                </div>
                            </li>

                            <li className="flex flex-col gap-3">
                                <p>Empathy level</p>
                                <div className="border-2 border-white w-full h-4">
                                <div className="bg-white w-[20%] h-3"></div>
                                </div>
                            </li>

                        </ul>
                        
                        <div className="flex flex-col pl-auto pt-12 gap-3">
                        <p className="text-center font-bold text-normal uppercase">Colective intelligence results</p>    
                        <svg className="w-full h-[300px]" xmlns="http://www.w3.org/2000/svg">


                            <polygon points="10,290 60,290 35,245" fill="white"/>
                        
                            <polygon points="290,10 270,60 230,80 250,30 290,10" fill="white"/>

                            <polygon points="260,255 290,215 230,215 260,255" fill="white"/>
                        
                            <polygon points="35,258 260,23 260,238" fill="none" stroke="white" stroke-width="2"/>
                        </svg>

                        </div>
                    </div>

                </div>

        </div> */}

                </div>
            </div>
        </div>

    </div>

        )
}
