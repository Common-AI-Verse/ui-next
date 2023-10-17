import { API_STATUS, RESPONSE_APIREST } from '@/lib/res_definitions';
import {
  createServerRouteClient,
} from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { get } from 'lodash';

type Session = { people: any[] };
type TrainingCategory = Session[];

function handleError(error: any): RESPONSE_APIREST {
  return {
    data: null,
    status: API_STATUS.SERVER_ERROR,
    error: get(error, 'message', 'server error'),
  };
}

function processReceivedJson(receivedJson: any): any {
  // Initialize sums and counters for averaging
  let sumMovementQuantity = [0, 0, 0];
  let sumSpeed = [0, 0, 0];
  let sumMotionRange = [0, 0, 0];
  let sumProximity = [0, 0, 0];
  let countPeople = [0, 0, 0];

  let sumHappy = 0;
  let sumAngry = 0;
  let sumRelax = 0;
  let sumSad = 0;
  let countEmotions = 0;

  // Process training data
  for (let category of Object.values(receivedJson.training) as TrainingCategory[]) {
    for (let session of category) {
        session.people.forEach((person: any, index: number) => {
            sumMovementQuantity[index] += person.movement_quantity;
            sumSpeed[index] += person.speed;
            sumMotionRange[index] += person.motion_range;
            sumProximity[index] += person.proximity;
            countPeople[index]++;
        });
    }
}

  // Process detection data for emotions
  receivedJson.detection.forEach((detection: any) => {
      sumHappy += detection.emotions.Happy;
      sumAngry += detection.emotions.Angry;
      sumRelax += detection.emotions.Relax;
      sumSad += detection.emotions.Sad;
      countEmotions++;
  });

  // Construct the final JSON
  const finalJson = {
    people: [
        {
            speed: Math.abs(sumSpeed[0] / countPeople[0]),
            proximity: Math.abs(sumProximity[0] / countPeople[0]),
            motion_range: Math.abs(sumMotionRange[0] / countPeople[0]),
            movement_quantity: Math.abs(sumMovementQuantity[0] / countPeople[0])
        },
        {
            speed: Math.abs(sumSpeed[1] / countPeople[1]),
            proximity: Math.abs(sumProximity[1] / countPeople[1]),
            motion_range: Math.abs(sumMotionRange[1] / countPeople[1]),
            movement_quantity: Math.abs(sumMovementQuantity[1] / countPeople[1])
        },
        {
            speed: Math.abs(sumSpeed[2] / countPeople[2]),
            proximity: Math.abs(sumProximity[2] / countPeople[2]),
            motion_range: Math.abs(sumMotionRange[2] / countPeople[2]),
            movement_quantity: Math.abs(sumMovementQuantity[2] / countPeople[2])
        }
    ],
    emotions: {
        Sad: Math.abs(sumSad / countEmotions),
        Angry: Math.abs(sumAngry / countEmotions),
        Happy: Math.abs(sumHappy / countEmotions),
        Relax: Math.abs(sumRelax / countEmotions)
    },
    object_generator: receivedJson.object_generator[0],
    new_state: receivedJson.new_state
};


  return finalJson;
}


function getCurrentTimestampTz() {
  const now = new Date();
  const formattedDate = now.toISOString().replace('T', ' ').replace('Z', '+00');
  return formattedDate;
}


export async function GET(req: Request) {
  
  //const sessionsStory = createServerRouteClient(cookies).from('sessions_history_dev');
  //const lastSession = createServerRouteClient(cookies).from('last_session_dev');

  //console.log('Supabase Response:', sessionsStory);

  

  try {
    
    //const result = await sessionsStory.select('*').order('id', { ascending: true });

    //console.log('Supabase Response:', result);

    //return NextResponse.json({ ...result });

    console.log("Common-AI-VERSE: API Running")

    return NextResponse.json({ "Common-AI-VERSE": "API Running" });

  } catch (error) {
    return NextResponse.json(handleError(error));
  }
}



export async function POST(req: Request) {

  const roomState = createServerRouteClient(cookies).from('room_state_dev');
  const lastSession = createServerRouteClient(cookies).from('last_session_dev');

  const receivedJson = await req.json();
  const { new_state } = receivedJson;
    
  try {

    console.log("new state: ", new_state)

    if (new_state === "FinalState"){

      const finalJson = processReceivedJson(receivedJson);  // Process received JSON
      const currentTimestampTz = getCurrentTimestampTz();

      try {
        // Fetch the current value of number_interactions
        const { data: currentData, error: fetchError } = await roomState
            .select('number_interactions')
            .eq('state', 'state')
            .single();
        
        if (fetchError) {
            console.error(fetchError);
            return NextResponse.json({ 'API Error': 'An error occurred' }, { status: 500 });
        }
    
        // Increment the number_interactions value
        const incrementedInteractions = currentData.number_interactions + 1;
    
        // Update metadata and created_at in lastSession
        const { error: lastSessionError } = await lastSession
            .update({ metadata: finalJson, created_at: currentTimestampTz })
            .eq('last_session', 'last_session');
    
        // Update actual_state and number_interactions in roomState
        const { error: roomStateError } = await roomState
            .update({ actual_state: new_state, number_interactions: incrementedInteractions })
            .eq('state', 'state');
        
        // Check for errors
        if (lastSessionError || roomStateError) {
            console.error(lastSessionError, roomStateError);
            return NextResponse.json({ 'API Error': 'An error occurred' }, { status: 500 });
        } else {
            return NextResponse.json({ 'State updated': `New State ${receivedJson.new_state}` }, { status: 200 });
        }
    
    } catch (error) {
        console.error(error);
        return NextResponse.json({ result: 'An error occurred' });
    }



    }

    const { error } = await roomState
    .update({ actual_state: new_state })
    .eq('state', 'state');
    
    if (error) {

      console.error(error);
      return NextResponse.json({'API Error' :'An error occurred'}, { status: 500 });

    } else {

      return NextResponse.json({'State updated': `New State ${new_state}`}, { status: 200 });

/*       console.log("Common-AI-VERSE: API POST OK")

      return NextResponse.json({ "Common-AI-Verse": 'API POST OK' }); */
    }

  } catch (error) {

    return NextResponse.json({ result: 'An error occurred' });

  }
}
