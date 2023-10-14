'use client';

import Image from 'next/image'
import { useState, useEffect } from 'react';
import { IoTriangle } from 'react-icons/io5';
import UnityLoader from '../components/UnityLoader';
import { useQRCode } from 'next-qrcode'
import { createClient } from '@supabase/supabase-js'

import EmotionsData from '@/types/EmotionsData';
import HumanData from '@/types/HumanData';
import NewRecordType from '@/types/NewRecordType';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
                            )

const Home : React.FC = () => {

    const [interactionsRecorded, setinteractionsRecorded] = useState<number>(0);

    const [roomOcupied, setroomOcupied] = useState<boolean>(false);

    const [emotionsData, setemotionsData] = useState<EmotionsData>({
        "happiness": 1.4,
        "anger": 6.8,
        "sadness": 4.3,
        "relaxation": 2.8
        });


    const [humanData, sethumanData] = useState<HumanData[]>([
        {
            "movementQuantity": 2.3,
            "speed": 4.1,
            "motionRange": 2.2,
            "proximity": 5.9
        },
        {
            "movementQuantity": 8.1,
            "speed": 2.3,
            "motionRange": 7.8,
            "proximity": 6.3
        },
        {
            "movementQuantity": 5.3,
            "speed": 8.4,
            "motionRange": 5.7,
            "proximity": 9.1
        }        
     ]
    );

    const [objectGenerator, setobjectGenerator] = useState<string>("1536716117162210270113237713327615153061660714276153671611716221027011323771332761515306166071427615");

    const [qrUrl, setqrUrl] = useState<string>("");

    const [lang, setLang] = useState<string>("es");

    //const [createdDate, setcreatedDate] = useState<time>

    const { SVG } = useQRCode();

    const emotionsParam:string = encodeURIComponent(JSON.stringify(emotionsData));
    const humanParam:string = encodeURIComponent(JSON.stringify(humanData));


    const [timeString, setTimeString] = useState<string>('');
    const [dateString, setDateString] = useState<string>('');

    useEffect(() => {

        const newUrl:string = `${window.location.pathname}?emotionsData=${emotionsParam}&humanData=${humanParam}&objGen=${objectGenerator}`;

        setqrUrl(`https://ui-api-next.vercel.app/mobileview?emotionsData=${emotionsParam}&humanData=${humanParam}&objGen=${objectGenerator}`)

        window.history.replaceState({}, '', newUrl);

        console.log("Url: ", newUrl);

        console.log("Mobile Url: ", qrUrl);

    }, [emotionsParam, humanParam, objectGenerator, qrUrl]);

      
    useEffect(() => {
        const languages = ['es', 'en', 'cat'];  // array of languages
        let currentLangIndex = 0;  // starting with Spanish
    
        const intervalId = setInterval(() => {
          currentLangIndex = (currentLangIndex + 1) % languages.length;  // cycle through languages
          setLang(languages[currentLangIndex]);
        }, 12000);  // change language every 5 seconds
    
        return () => clearInterval(intervalId);  // cleanup interval on component unmount
      }, []);  


useEffect(() => {  
    const changes = supabase
    .channel('table-db-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'room_state_dev',
      },
      (payload) => {
        const { new: newRecord } = payload;

        console.log('New Record:', newRecord);


        const { actual_state, number_interactions } = newRecord as NewRecordType; 

        if (number_interactions !== interactionsRecorded){

            setinteractionsRecorded(number_interactions);

        }
        
        if(actual_state === "InitialState"){

            setroomOcupied(true);
            
        } else if(actual_state === "FinalState"){

            window.location.reload()
        } else {

            setroomOcupied(false);
        }

      } 
    )
    .subscribe()

}, []);

    
    useEffect(() => {
    // Define an async function
    const fetchInteractions = async () => {
      try {
        const { data, error } = await supabase
          .from('room_state_dev')
          .select('number_interactions')
          .single();

        if (error) {
          throw new Error(error.message);
        }

        if (data) {
          setinteractionsRecorded(data.number_interactions);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    // Call the async function
    fetchInteractions();

    }, []); 


    useEffect(() => {
        const fetchRoomState = async () => {
          try {
            const { data, error } = await supabase
              .from('room_state_dev')
              .select('actual_state')
              .single(); 
    
            if (error) {
              throw new Error(error.message);
            }
    
            if (data) {
              // Check if the actual_state value is "InitialState" and update roomOccupied accordingly
              setroomOcupied(data.actual_state === 'InitialState');
            }
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };
    
        // Call the async function
        fetchRoomState();
      }, []);

      useEffect(() => {
        const fetchData = async () => {
          try {
            const { data, error } = await supabase
              .from('last_session_dev')
              .select('created_at')
              .single();  // Assuming you want to fetch a single row
    
            if (error) {
                console.log("Error in Supabase", error)
              throw error;
            }
    
            if (data) {

              const supabaseDate: string = data.created_at;

              // Create a new Date object from the Supabase date
              const date = new Date(supabaseDate);
          
              // Format the time string
              const hours = String(date.getHours()).padStart(2, '0');
              const minutes = String(date.getMinutes()).padStart(2, '0');
              const seconds = String(date.getSeconds()).padStart(2, '0');
              const formattedTime = `${hours}:${minutes}:${seconds}`;
          
              // Format the date string
              const day = String(date.getDate()).padStart(2, '0');
              const month = String(date.getMonth() + 1).padStart(2, '0');  // Months are 0-based in JavaScript
              const year = date.getFullYear();
              const formattedDate = `${day}/${month}/${year}`;
          
              // Update state with the formatted strings
              setTimeString(formattedTime);
              setDateString(formattedDate);
              //console.log("created at in data", createdDate)
            }
          } catch (error:any) {
            console.error(error.message);
          }
        };
    
        fetchData();
        

      }, []);

      if(timeString && dateString){

        console.log("time string", timeString, "date string", dateString)
      }

      

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
                            className="w-8/12 pt-8"
                            />
                            <div className="w-full text-right pt-8">
                                <p className="font-light text-lg">Number of interactions: { interactionsRecorded }</p>
                            </div>
                            <div className="text-xl uppercase mt-auto mb-3 text-graphics-green"><p className="">ROOM status: { `${ roomOcupied ? "OCCUPIED" : "FREE" }` }</p></div>
                        </div>

                        {/* Second text block */}


                        <div className="flex flex-col w-full pt-6 border-white border-b-[3px] pb-11">

                        <p className="font-plex font-regular text-2xl">Experience duration: 5 min</p>

                        <h1 className="text-5xl uppercase text-accents-green font-bold pt-5 pb-8">STATE: { roomOcupied ? "COLLECTING DATA" : "WAITING FOR HUMANS"}</h1>


                        { lang === "es" && (       
                        <div className="border-white border-l-2 -ml-2 pl-4 mb-8">
                        <p className="font-plex font-semibold text-2xl uppercase">INSTRUCCIONES</p>
                        <ul className="flex flex-col  gap-11 text-2xl font-extralight pt-10">
                            <li>
                                <p className="">Participa con al menos un acompañante</p>
                            </li>
                            <li>
                                <p className="">Entrad en la cápsula interactiva</p>
                            </li>
                            <li>
                                <p className="">Seguid las instrucciones de la IA</p>
                            </li>
                            <li>
                                <p className="">Cooperad con vuestros movimientos para interactuar con la IA</p>
                            </li>
                            <li>
                                <p className="">Volved aquí para descargar vuestra entidad digital</p>
                            </li>

                        </ul>
                        </div>
                        )
                        }

                        { lang === "en" && (
                        <div className="border-white border-l-2 -ml-2 pl-4 mb-8">
                        <p className="font-plex font-semibold text-2xl uppercase">INSTRUCTIONS</p>
                        <ul className="flex flex-col  gap-11 text-2xl font-extralight pt-10">
                            <li>
                                <p className="">Participate with at least one companion</p>
                            </li>
                            <li>
                                <p className="">Enter the interactive capsule</p>
                            </li>
                            <li>
                                <p className="">Follow the instructions of the AI</p>
                            </li>
                            <li>
                                <p className="">Cooperate with your movements to interact with the AI</p>
                            </li>
                            <li>
                                <p className="">Return here to download your digital entity</p>
                            </li>

                        </ul>
                        </div>
                        )
                        
                        }

                        { lang === "cat" && (
                        <div className="border-white border-l-2 -ml-2 pl-4 mb-8">
                        <p className="font-plex font-semibold text-2xl uppercase">INSTRUCCIONS</p>
                        <ul className="flex flex-col  gap-11 text-2xl font-extralight pt-10">
                            <li>
                                <p className="">Participa amb almenys un acompanyant</p>
                            </li>
                            <li>
                                <p className="">Entreu a la càpsula interactiva</p>
                            </li>
                            <li>
                                <p className="">Seguiu les instruccions de la IA</p>
                            </li>
                            <li>
                                <p className="">Coopereu amb els vostres moviments per interactuar amb la IA</p>
                            </li>
                            <li>
                                <p className="">Torneu aquí per descarregar la vostra entitat digital</p>
                            </li>

                        </ul>
                        </div> 
                        )
                        
                        }
                        
                        </div>


                        
                            <div className="flex flex-col w-full">


                                {/* Data display */}

                                <div className="flex flex-row w-full h-auto pt-11">

                                                                        
                                    <div id="qrCode" className="w-3/12 h-[220px] text-black text-center text-3xl">
                                         {qrUrl && qrUrl.length > 0 ? (
                                            <SVG
                                              text={qrUrl}
                                              options={{
                                                margin: 1,
                                                width: 220,
                                                color: {
                                                  light: '#FFFFFFFF',
                                                },
                                              }}
                                            />
                                         ) : (
                                           <p>Loading...</p>  // or render nothing or some loading indicator
                                         )}
                                    </div>

                                    <div className="border-r-2 border-white my-auto h-20 w-7/12">
                                    <p className="w-full font-bold text-5xl pt-3 text-center">LAST SESSION DATA</p>
                                    </div>
                                    <div className="flex flex-col w-2/12 my-auto text-xl font-semibold pl-4">
                                        <p>{timeString}</p>
                                        <p>{dateString}</p>

                                    </div>
                                
                                </div>

                                {/* Unity background */}
                                <div className="relative flex-grow flex w-full h-full ">
     
                                <div className="flex flex-col h-[780px] w-full absolute z-[-1] ">
 
                                <UnityLoader />
 
                                 <div id="unityPlayer" className="h-[780px] mx-auto text-black text-center text-3xl fade-out-edges">
                                     <canvas id="unity-canvas" className="w-full h-full rounded"></canvas>
                                 </div>
 
                                 </div>
                                </div>
 


                                <div className="grid grid-cols-2 grid-rows-2 h-auto pt-28 w-full">
                                
                                {/* Human 01 resume */}

                                <div className="w-1/2">

                                <div className="flex align-center justify-center w-full bg-accents-red h-11 border-gray-400 border-2">
                                    <p className="font-light text-xl my-auto text-gray-200">Human 01 Resume</p>
                                </div>
                                

                                <ul className="flex flex-col w-full font-extralight pt-5 text-base gap-2">
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

                                </div>

                                {/* Emotions data display */}

                                <ul className="flex flex-col w-full pt-12 gap-7 pr-4">

                                    <li className="flex flex-row-reverse w-full gap-8">
                                        <IoTriangle className="text-2xl"/>
                                        <p className="font-semibold text-xl my-auto">Happy: { `${emotionsData.happiness}`}</p>
                                        
                                    </li>

                                    <li className="flex flex-row-reverse w-full gap-8">
                                    <IoTriangle className="text-2xl"/>
                                        <p className="font-semibold text-xl my-auto">Angry: { `${emotionsData.anger }`}</p>
                                        
                                    </li>

                                    <li className="flex flex-row-reverse w-full gap-8">
                                    <IoTriangle className="text-2xl"/>
                                        <p className="font-semibold text-xl my-auto">Sad: { `${emotionsData.sadness }`}</p>
                                        
                                    </li>

                                    <li className="flex flex-row-reverse w-full gap-8">
                                        <IoTriangle className="text-2xl"/>
                                        <p className="font-semibold text-xl my-auto">Relax: { `${emotionsData.relaxation }`}</p>
                                        
                                    </li>
                                </ul>



                                {/* Human 02 resume */}

                                <div className="w-1/2">

                                <div className="flex align-center justify-center w-full bg-accents-green h-11 border-gray-400 border-2 mt-6">
                                    <p className="font-regular text-xl my-auto text-black">Human 02 Resume</p>
                                </div>

                                <ul className="flex flex-col  w-full font-extralight pt-5 text-base gap-2">
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

                                </div>

                                {/* Human 03 resume */}
                                
                                <div className="w-1/2 ml-auto">

                                <div className="flex align-center justify-center w-full bg-accents-blue h-11 border-gray-400 border-2 mt-6">
                                    <p className="font-regular text-xl my-auto text-gray-200">Human 03 Resume</p>
                                </div>

                                <ul className="flex flex-col  w-full font-extralight pt-5 text-base gap-2 text-right">
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

                                </div>

                                </div>


                            </div>


                    </div>

                </div>
            </div>
        </div>

    </div>

        )
}


export default Home;