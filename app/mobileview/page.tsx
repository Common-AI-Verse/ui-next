'use client';

import Image from 'next/image'
import { useState, useEffect } from 'react';
import { IoTriangle } from 'react-icons/io5';
import UnityLoader from '../../components/UnityLoader';
import { useQRCode } from 'next-qrcode'
import { createClient } from '@supabase/supabase-js'

import EmotionsData from '@/types/EmotionsData';
import HumanData from '@/types/HumanData';
import NewRecordType from '@/types/NewRecordType';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
                            )

const MobileView : React.FC = () => {

    const [interactionsRecorded, setinteractionsRecorded] = useState<number>(0);

    const [roomOcupied, setroomOcupied] = useState<boolean>(false);

    const [timeRemaining, setTimeRemaining] = useState(5 * 60);
    const [timerActive, setTimerActive] = useState(true);

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
      const intervalId = setInterval(() => {
          if (timerActive) {
              setTimeRemaining(prevTime => {
                  if (prevTime > 0) {
                      return prevTime - 1;
                  } else {
                      clearInterval(intervalId);
                      return 0;
                  }
              });
          }
      }, 1000);  // Update every second
  
      return () => clearInterval(intervalId);  // Clear interval on unmount
  }, [timerActive]);


  useEffect(() => {

    const handlePostgresChanges = (payload:any) => {

        const { new: newRecord } = payload;

        console.log('New Record:', newRecord);

        const { actual_state, number_interactions } = newRecord;

        if (number_interactions !== interactionsRecorded) {
            setinteractionsRecorded(number_interactions);
        }

        if (actual_state === "InitialState") {
          setroomOcupied(true);
          setTimerActive(true);  // Start the timer when the state is 'InitialState'
      } else if (actual_state === "WaitingPeople") {
          setTimerActive(false);  // Stop the timer and reset to 5 minutes when the state is 'WaitingPeople'
          setTimeRemaining(5 * 60);
      } else if (actual_state === "FinalState") {
          window.location.reload();
      }
    };

    const changes = supabase
        .channel('table-db-changes')
        .on(
            'postgres_changes',
            {
                event: '*',
                schema: 'public',
                table: 'room_state_dev',
            },
            handlePostgresChanges
        )
        .subscribe();

    return () => {

        //supabase.removeSubscription(changes);  // Unsubscribe on unmount

    };
}, []); 


  
  useEffect(() => {
      const fetchRoomState = async () => {
          const { data, error } = await supabase
              .from('room_state_dev')
              .select('actual_state')
              .single();
  
          if (error) {
              throw new Error(error.message);
          }
  
          if (data) {

              const isInitialState = data.actual_state === 'InitialState';
              const isWaitingPeople = data.actual_state === 'WaitingPeople';
              const isFinalState = data.actual_state === 'FinalState';

              setroomOcupied(isInitialState);
  
              // Reset timer and stop countdown if necessary
              if (isFinalState || isWaitingPeople) {

                  setTimerActive(false);

              }
          }
      };
  
      const intervalId = setInterval(fetchRoomState, 5000);  // Check every 5 seconds
  
      return () => clearInterval(intervalId);  // Clear interval on unmount
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
              
              const isInitialState = data.actual_state === 'InitialState';
              const isWaitingPeople = data.actual_state === 'WaitingPeople';
              const isFinalState = data.actual_state === 'FinalState';

              // Check if the actual_state value is "InitialState" and update roomOccupied accordingly
              setroomOcupied(isInitialState);

              if (isFinalState || isWaitingPeople) {

                setTimerActive(false);

            }
            
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


      useEffect(() => {

        async function fetchData() {
            const { data, error } = await supabase
                .from('last_session_dev')
                .select('metadata')
                .single();
    
            if (error) {
                console.error('Error fetching data: ', error.message);
                return;
            }
    
            if (data && data.metadata) { 
    
                console.log("Data", data.metadata);
    
                setemotionsData({
                    happiness: data.metadata.emotions.Happy,
                    anger: data.metadata.emotions.Angry,
                    sadness: data.metadata.emotions.Sad,
                    relaxation: data.metadata.emotions.Relax,
                });
    
                // Transforming the 'people' array to match the structure of HumanData

                const transformedHumanData = data.metadata.people.map((person: any) => ({
                    movementQuantity: person.movement_quantity,
                    speed: person.speed,
                    motionRange: person.motion_range,
                    proximity: person.proximity,
                }));
    
                sethumanData(transformedHumanData);
    
                setobjectGenerator(data.metadata.object_generator);
            }
        }
    
        fetchData();

    }, []);


        

      if(timeString && dateString){

        console.log("time string", timeString, "date string", dateString)
      }

      const [formData, setFormData] = useState({
        nombre: '',
        email: '',
      });
    
      const handleChange = (e:any) => {
        const { name, value } = e.target;
        setFormData({
          ...formData,
          [name]: value,
        });
      };
    
      const handleSubmit = (e:any) => {
        e.preventDefault();
        // Handle form submission here
        console.log('Form data submitted:', formData);
      };
    

      

    return (
    <div className="h-auto w-full p-2">
        <div className="h-full border-2 border-graphics-red p-2">
            <div className="h-full border-2 border-graphics-green p-2">
                <div className="h-full border-2 border-graphics-blue p-5">

                    {/*UI Design*/}

                    <div className="w-full h-full flex flex-col font-plex">

                        {/* First text block */}

                        <div className="w-full border-white border-b-[1px] pb-3">
                            <Image
                            src="/cLogo.png"
                            alt="Common AI Verse Logo"
                            width={781}
                            height={68}
                            className="w-8/12 "
                            />
                        </div>


                        {/* Second text block */}

                        <div className="flex flex-col w-full pt-4 border-white border-b-[3px] pb-8">
                          
                        { lang === "es" && (       
                        <div className="">
                        <h1 className={`text-base uppercase text-accents-green font-bold`}>BIENVENIDO A COMMON-AI-VERSE INTERACTION USER DATA INTERFACE</h1>
                        <p className="text-sm pt-3"><span className="font-semibold">Gracias por su participación.</span>
                        <br/>
                        <br/>                     
                        Si estás aquí es porque has escaneado el QR resultado de tu interacción colectiva. 
                        <br />
                        <br />
                        Rellena a continuación tu dirección de correo electrónico y tu nombre para recibir los resultados directamente en tu buzón, descargar el modelo 3D colectivo e incluso acuñarlo como NFT.
                        </p>
                            <form onSubmit={handleSubmit} className="pt-3">
                            <div className="mb-4">
                              <input
                                type="text"
                                name="nombre"
                                id="nombre"
                                placeholder='Nombre'
                                value={formData.nombre}
                                onChange={handleChange}
                                className="shadow appearance-none border rounded-sm w-full py-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm pl-2"
                              />
                            </div>
                            <div className="mb-4">
                              <input
                                type="email"
                                name="email"
                                id="email"
                                placeholder='E-mail'
                                value={formData.email}
                                onChange={handleChange}
                                className="shadow appearance-none border rounded-sm w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm pl-2"
                              />
                            </div>
                            <div className="flex items-center justify-end pt-3">
                              <button type="submit" className="bg-white text-gray-900 font-bold py-2 px-4 rounded-sm w-full mx-10">
                                Enviar
                              </button>
                            </div>
                          </form>
                        </div>
                        )
                        }

                        { lang === "en" && (       
                        <div className="">
                        <h1 className={`text-base uppercase text-accents-green font-bold`}> WELCOME TO COMMON-AI-VERSE INTERACTION USER DATA INTERFACE</h1>
                        <p className="text-sm pt-3"><span className="font-semibold">Thanks for your participation.</span>
                        <br/>
                        <br/>                     
                        If you are here it’s because you have scanned the QR result of your collective interaction.
                        <br />
                        <br />
                        Please fill bellow your e-mail address and name to receive your results directly in your mail box, to download the collective 3D model and even to mint it as a NFT.
                        </p>
                            <form onSubmit={handleSubmit} className="pt-3">
                            <div className="mb-4">
                              <input
                                type="text"
                                name="nombre"
                                id="nombre"
                                placeholder='Name'
                                value={formData.nombre}
                                onChange={handleChange}
                                className="shadow appearance-none border rounded-sm w-full py-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm pl-2"
                              />
                            </div>
                            <div className="mb-4">
                              <input
                                type="email"
                                name="email"
                                id="email"
                                placeholder='E-mail'
                                value={formData.email}
                                onChange={handleChange}
                                className="shadow appearance-none border rounded-sm w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm pl-2"
                              />
                            </div>
                            <div className="flex items-center justify-end pt-3">
                              <button type="submit" className="bg-white text-gray-900 font-bold py-2 px-4 rounded-sm w-full mx-10">
                                Send
                              </button>
                            </div>
                          </form>
                        </div>
                        )
                        }

                        { lang === "cat" && (       
                        <div className="">
                        <h1 className={`text-base uppercase text-accents-green font-bold`}>BENVINGUT A COMMON-AI-VERSE INTERACTION USER DATA INTERFACE</h1>
                        <p className="text-sm pt-3"><span className="font-semibold">Gràcies per la vostra participació.</span>
                        <br/>
                        <br/>                     
                        Si ets aquí és perquè has escanejat el QR resultat de la teva interacció col·lectiva.
                        <br />
                        <br />
                        Omple a continuació la teva adreça de correu electrònic i el teu nom per rebre els resultats directament a la teva bústia, descarregar el model 3D col·lectiu I fins I tot encunyar-lo com a NFT.
                        </p>
                            <form onSubmit={handleSubmit} className="pt-3">
                            <div className="mb-4">
                              <input
                                type="text"
                                name="nombre"
                                id="nombre"
                                placeholder='Nom'
                                value={formData.nombre}
                                onChange={handleChange}
                                className="shadow appearance-none border rounded-sm w-full py-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm pl-2"
                              />
                            </div>
                            <div className="mb-4">
                              <input
                                type="email"
                                name="email"
                                id="email"
                                placeholder='Email'
                                value={formData.email}
                                onChange={handleChange}
                                className="shadow appearance-none border rounded-sm w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm pl-2"
                              />
                            </div>
                            <div className="flex items-center justify-end pt-3">
                              <button type="submit" className="bg-white text-gray-900 font-bold py-2 px-4 rounded-sm w-full mx-10">
                                Enviar
                              </button>
                            </div>
                          </form>
                        </div>
                        )
                        }
                        
                        </div>


                        
                            <div className="flex flex-col w-full">


                                {/* Data display */}

                                <div className="flex flex-row w-full h-auto pt-5">

                                                                  
    <p className="flex flex-col w-full font-bold text-lg text-center justify-center items-center border-r-2 h-12 pr-4">SESSION DATA</p>


<div className="flex flex-col text-base justify-center items-center w-full">
    <p>{timeString}</p>
    <p className="">{dateString}</p>
</div>

</div>


                                {/* Unity background */}
                                <div className="relative flex-grow flex w-full h-full ">
     
                                <div className="flex flex-col h-auto w-full absolute z-[-1] ">
 
                                <UnityLoader />
 
                                 <div id="unityPlayer" className="h-auto w-full text-black text-center text-3xl fade-out-edges">
                                     <canvas id="unity-canvas" className="w-full h-full rounded"></canvas>
                                 </div>
 
                                 </div>
                                </div>
 


                                <div className="flex flex-col h-auto pt-28 w-full">

                                {/* Emotions data display */}

                                <ul className="flex flex-col w-full pt-12 gap-3 text-right h-auto pb-6">

                                    <li className="flex flex-row-reverse w-full">
                                        <IoTriangle className="text-xl"/>
                                        <p className="font-semibold text-base my-auto mr-auto">Happy: { `${emotionsData.happiness}`}</p>
                                        
                                    </li>

                                    <li className="flex flex-row-reverse w-full">
                                    <IoTriangle className="text-xl"/>
                                        <p className="font-semibold text-base my-auto mr-auto">Angry: { `${emotionsData.anger }`}</p>
                                        
                                    </li>

                                    <li className="flex flex-row-reverse w-full">
                                    <IoTriangle className="text-xl"/>
                                        <p className="font-semibold text-base my-auto mr-auto">Sad: { `${emotionsData.sadness }`}</p>
                                        
                                    </li>

                                    <li className="flex flex-row-reverse w-full">
                                        <IoTriangle className="text-xl"/>
                                        <p className="font-semibold text-base my-auto mr-auto">Relax: { `${emotionsData.relaxation }`}</p>
                                        
                                    </li>
                                </ul>
                                
                                {/* Human 01 resume */}

                                <div className="w-full">

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

                                {/* Human 02 resume */}

                                <div className="w-full">

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
                                
                                <div className="w-full">

                                <div className="flex align-center justify-center w-full bg-accents-blue h-11 border-gray-400 border-2 mt-6">
                                    <p className="font-regular text-xl my-auto text-gray-200">Human 03 Resume</p>
                                </div>

                                <ul className="flex flex-col  w-full font-extralight pt-5 text-base gap-2">
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


export default MobileView;