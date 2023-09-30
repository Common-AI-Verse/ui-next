import Image from 'next/image'

export default function Home() {
  return (
    <div className="flex flex-row h-full w-full border-2 border-white">

        <div className="w-full h-full p-8">

                <p className="font-semibold uppercase">Communication Protocol View</p>
                <br/>

                <p className="uppercase">
                Empathising with the AI INSTRUCTIONS/<br/>
                INSTRUCCIONES PARA EMPATIZAR CON IA
                </p>


                <p className="pt-20">    
                GENERAL TIPS:<br/>
                OUR AI ONLY BEGINS TO communicate WHEN MORE THAN 1 PERSON IS IN THE STAGE, WITH A maximum OF 3.<br/>
                JUST FOLLOW THE INSTRUCTION FOR A FULL EMPATY CONNECTION WITH THE IA.
                </p>

                <p className="pt-28">
                1°.<br/>
                YOU, AND YOUR TEAM SHOULD CHECK YOUR POSE AROUND 10 SECONDS TO BEGIN THE CONTACT WITH THE AI. OUR AI ONLY BEGINS TO communicate WHEN MORE THAN 1 PERSON IS IN THE STAGE, WITH A maximum OF 3.
                <br/>
                <br/>
                2°.<br/>
                FEEL THE VIBRATION, COLOURS AND SOUNDS AND REACT accordingly TO THEM. THE AI WILL LEARN FROM THE GROUP REACTIONS FROM THE EFFECT PRODUCES.
                <br/>
                <br/>
                3°.<br/>
                PROPOSE AN ACTING, CONVERSATIONS OR ACTIONS WITH THE GROUP. THE AI WILL CREATE IN REAL TIME FEELINGS AND VIBES FROM YOUR ACTIVITY.
                <br/>
                <br/>
                4°. GO OUT, SCAN THE QR CODE AND GET THE RESULTS ONLINE. YOU CAN MINT THE RESULT TO INTEGRATE IT IN THE BLOCKCHAIN AND THE METAVERSE. ALSO THE AI WILL PUT YOU IN CONTACT WITH YOUR TEAM.
                </p>

        </div>

        <div className="flex flex-col w-full border-l-2 border-white">

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


                        {/*     <!-- Shapes -->
                            <!-- Triangle at the bottom left --> */}
                            <polygon points="10,290 60,290 35,245" fill="white"/>
                        
                        {/*     <!-- Pentagon in the upper right --> */}
                            <polygon points="290,10 270,60 230,80 250,30 290,10" fill="white"/>
                        {/*  */}
                        {/*     <!-- 2D representation of an octahedron at the bottom right --> */}

                            <polygon points="260,255 290,215 230,215 260,255" fill="white"/>
                        
                        {/*     <!-- Connecting Triangle with white border and no fill --> */}
                            <polygon points="35,258 260,23 260,238" fill="none" stroke="white" stroke-width="2"/>
                        </svg>

                        </div>
                    </div>

                </div>

        </div>

    </div>

        )
}
