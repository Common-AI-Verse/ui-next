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

interface FormData {
    nombre: string;
    email: string;

}


const MobileView : React.FC = () => {

    const [emotionsData, setemotionsData] = useState<EmotionsData>({
        "happiness": 0.0,
        "anger": 0.0,
        "sadness": 0.0,
        "relaxation": 0.0
        });


    const [humanData, sethumanData] = useState<HumanData[]>([
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
        }        
     ]
    );

    const [formData, setFormData] = useState<FormData>({
      nombre: "",
      email: "",
    });

    const [objectGenerator, setobjectGenerator] = useState<string>("0");

    const [lang, setLang] = useState<string>("es");

    const { SVG } = useQRCode();

    const [timeString, setTimeString] = useState<string>('');
    const [dateString, setDateString] = useState<string>('');

    const [submissionStatusEs, setSubmissionStatusEs] = useState<string | null>(null);
    const [submissionStatusENG, setSubmissionStatusENG] = useState<string | null>(null);
    const [submissionStatusCat, setSubmissionStatusCat] = useState<string | null>(null);

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
        function fetchDataFromURL() {
            const params = new URLSearchParams(window.location.search);

            console.log("Params", params)
    
            // Extract and parse the emotionsData parameter
            const emotionsDataParam = params.get('emotionsData');

            if (emotionsDataParam) {
                const emotionsDataObj = JSON.parse(decodeURIComponent(emotionsDataParam));

                console.log("Emotions Data Obj", emotionsDataObj)

                setemotionsData(emotionsDataObj);
                console.log("Emotions Data", emotionsData)
            }
    
            // Extract and parse the humanData parameter
            const humanDataParam = params.get('humanData');
            if (humanDataParam) {
                const humanDataObj = JSON.parse(decodeURIComponent(humanDataParam));
                sethumanData(humanDataObj);
            }
    
            // Extract and set the objectGenerator parameter
            const objectGeneratorParam = params.get('objGen');
            if (objectGeneratorParam) {
                setobjectGenerator(objectGeneratorParam);
            }

            const timeStringParam = params.get('timeString');
            const dateStringParam = params.get('dateString');
            if (timeStringParam && dateStringParam) {
                setTimeString(timeStringParam);
                setDateString(dateStringParam);
            }
        }
    
        fetchDataFromURL();
    }, []);
      
    async function uploadData(data: any) {
      const { error } = await supabase
        .from('sessions_history')
        .insert([data])
    
      if (error) {
        console.error('Error uploading data:', error);
        if (error.code === '23505') {
          setSubmissionStatusEs('Usuario registrado, gracias por participar');
          setSubmissionStatusENG('User already registered, thank you for participating');
          setSubmissionStatusCat('Usuari registrat, gràcies per participar');

        } else {
          setSubmissionStatusEs('Ha ocurrido un error. Por favor intenta después.');
          setSubmissionStatusENG('An error occurred. Please try again later.');
          setSubmissionStatusCat("S'ha produït un error. Si us plau, torna-ho a intentar més tard.");
        }
      } else {
        setSubmissionStatusENG('Thank you for submitting your information, you will soon receive an email with your session details.');
        setSubmissionStatusEs('Gracias por enviar su información, pronto recibirá un correo electrónico con los detalles de su sesión.');
        setSubmissionStatusCat('Gràcies per enviar la seva informació, aviat rebrà un correu electrònic amb els detalls de la seva sessió.');

        console.log('Data uploaded successfully');
      }
    }
    
    
    
      const handleSubmit = (e:any) => {
        e.preventDefault();
        // Handle form submission here
        console.log('Form data submitted:', formData);

        const dataToUpload = {
          email: formData.email,
          name: formData.nombre,
          created_at:timeString + " , " + dateString,
          params: "timeString="+timeString + "&dateString=" + dateString + "&emotionsData=" + JSON.stringify(emotionsData) + "&humanData=" + JSON.stringify(humanData) + "&objGen=" + objectGenerator,
          metadata: {
            formData,
            emotionsData,
            humanData,
            objectGenerator,
            timeString,
            dateString
          }
        }

        uploadData(dataToUpload)
      };

      function getPlaceholderName(lang:string) {
        switch(lang) {
          case 'es':
            return 'Nombre';
          case 'en':
            return 'Name';
          case 'cat':
            return 'Nom';
          default:
            return 'Nombre';
        }
      }


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
                        </div>
                        )
                        }

  <div>
    {submissionStatusEs === null && submissionStatusENG === null && submissionStatusCat === null ? (
      <form onSubmit={handleSubmit} className="pt-3">
        <div className="mb-4">
          <input
            type="text"
            name="nombre"
            id="nombre"
            placeholder={getPlaceholderName(lang)}
            value={formData.nombre}
            onChange={(e: any) => {
              setFormData({ ...formData, nombre: e.target.value });
            }}
            className="shadow appearance-none border rounded-sm w-full py-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm pl-2"
            required
          />
        </div>

        <div className="mb-4">
          <input
            type="email"
            name="email"
            id="email"
            placeholder='E-mail'
            value={formData.email}
            onChange={(e: any) => { setFormData({ ...formData, email: e.target.value }) }}
            className="shadow appearance-none border rounded-sm w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm pl-2"
            required
          />
        </div>

        <div className="flex items-center justify-end pt-3">
          <button type="submit" className="bg-white text-gray-900 font-bold py-2 px-4 rounded-sm w-full mx-10 hover:text-gray-200 hover:bg-gray-800">
            { lang === "en" ? "Send" : "Enviar" }
          </button>
        </div>
      </form>
    ) : (
      <div className="flex w-full text-center text-accents-green text-base uppercas pt-5">
         { lang === "es" && ( submissionStatusEs )}
         { lang === "en" && ( submissionStatusENG )}
         { lang === "cat" && ( submissionStatusCat )}
          </div>
          )}
          </div>
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
{/*                                 <div className="flex-grow flex w-full h-full" style={{ zIndex: -1 }}>

<div className="flex flex-col h-auto w-full">

  <UnityLoader />

    <div id="unityPlayer" className="h-auto w-full text-black text-center text-3xl fade-out-edges">
        <canvas id="unity-canvas" className="w-full h-full rounded"></canvas>
    </div>

</div>
</div> */}
 


                                <div className="flex flex-col h-auto w-full">

                                {/* Emotions data display */}

                                <ul className="flex flex-col w-full pt-6 gap-3 text-right h-auto pb-6">

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