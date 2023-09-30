import { API_STATUS, RESPONSE_APIREST } from '@/lib/res_definitions';
import {
  createServerRouteClient,
} from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { get } from 'lodash';

function handleError(error: any): RESPONSE_APIREST {
  return {
    data: null,
    status: API_STATUS.SERVER_ERROR,
    error: get(error, 'message', 'server error'),
  };
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
    

  try {
    
    console.log("Common-AI-VERSE: API POST OK")

    return NextResponse.json({ "Common-AI-Verse": 'API POST OK' });

  } catch (error) {

    return NextResponse.json({ result: 'An error occurred' });

  }
}
