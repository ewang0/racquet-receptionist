import express from 'express';
import dotenv from 'dotenv';
import Retell from 'retell-sdk';
import bodyParser from 'body-parser';

dotenv.config();

const app = express();
app.use(bodyParser.json());

const port = process.env.PORT || 3000;
const retellApiKey = process.env.RETELL_API_KEY;

if (!retellApiKey) {
  throw new Error('RETELL_API_KEY is required');
}

const retellClient = new Retell({
  apiKey: retellApiKey,
});

// Mock tennis court data
const tennisCourts = [
  { id: 1, name: 'Court 1', surface: 'Hard', availability: ['9:00 AM - 11:00 AM', '3:00 PM - 5:00 PM'] },
  { id: 2, name: 'Court 2', surface: 'Hard', availability: ['11:00 AM - 1:00 PM', '5:00 PM - 7:00 PM'] },
  { id: 3, name: 'Court 3', surface: 'Clay', availability: ['10:00 AM - 12:00 PM', '2:00 PM - 4:00 PM'] },
  { id: 4, name: 'Court 4', surface: 'Clay', availability: ['8:00 AM - 10:00 AM', '4:00 PM - 6:00 PM'] },
];

// Mock pricing data
const pricing = {
  hourlyRate: '$20 per hour',
  membershipFee: '$100 per month',
  courtTypes: {
    hard: '$20 per hour',
    clay: '$25 per hour',
  },
  discounts: 'Members receive 20% off court bookings',
};

// Mock hours of operation
const hoursOfOperation = {
  weekdays: '8:00 AM - 8:00 PM',
  weekends: '9:00 AM - 6:00 PM',
  holidays: '10:00 AM - 4:00 PM',
};

// Webhook endpoint for Retell
app.post('/webhook', (req, res) => {
  const { call } = req.body;
  const transcript = call.transcript_object;
  const callId = call.call_id;

  console.log(`Received webhook for call ${callId}`);
  console.log('Transcript:', transcript);
  console.log('request body:', req.body);
  
  // Default response with structured data
  let responseData: {
    intent: string;
    data: any;
    context: string;
  } = {
    intent: "unknown",
    data: null,
    context: "I can help with tennis court availability, pricing, or hours of operation."
  };

  // Extract the latest user message
  const latestUserMessage = transcript && transcript.length > 0 
    ? transcript[transcript.length - 1].content 
    : '';

  // Simple intent detection based on keywords
  const userMessageLower = latestUserMessage.toLowerCase();

  if (userMessageLower.includes('availability') || 
      userMessageLower.includes('available') || 
      userMessageLower.includes('book') || 
      userMessageLower.includes('reserve')) {
    
    // Return structured court availability data
    responseData = {
      intent: "court_availability",
      data: tennisCourts,
      context: "User asked about general court availability"
    };
  } 
  else if (userMessageLower.includes('price') || 
           userMessageLower.includes('cost') || 
           userMessageLower.includes('fee') || 
           userMessageLower.includes('how much')) {
    
    // Return structured pricing data
    responseData = {
      intent: "pricing",
      data: pricing,
      context: "User asked about pricing information"
    };
  } 
  else if (userMessageLower.includes('hour') || 
           userMessageLower.includes('open') || 
           userMessageLower.includes('close') || 
           userMessageLower.includes('time')) {
    
    // Return structured hours data
    responseData = {
      intent: "hours",
      data: hoursOfOperation,
      context: "User asked about hours of operation"
    };
  }
  else if (userMessageLower.includes('court 1') || userMessageLower.includes('court one')) {
    const court = tennisCourts.find(c => c.id === 1);
    if (court) {
      responseData = {
        intent: "specific_court",
        data: court,
        context: "User asked about Court 1"
      };
    }
  }
  else if (userMessageLower.includes('court 2') || userMessageLower.includes('court two')) {
    const court = tennisCourts.find(c => c.id === 2);
    if (court) {
      responseData = {
        intent: "specific_court",
        data: court,
        context: "User asked about Court 2"
      };
    }
  }
  else if (userMessageLower.includes('court 3') || userMessageLower.includes('court three')) {
    const court = tennisCourts.find(c => c.id === 3);
    if (court) {
      responseData = {
        intent: "specific_court",
        data: court,
        context: "User asked about Court 3"
      };
    }
  }
  else if (userMessageLower.includes('court 4') || userMessageLower.includes('court four')) {
    const court = tennisCourts.find(c => c.id === 4);
    if (court) {
      responseData = {
        intent: "specific_court",
        data: court,
        context: "User asked about Court 4"
      };
    }
  }
  else if (userMessageLower.includes('clay') || userMessageLower.includes('clay court')) {
    const clayCourts = tennisCourts.filter(c => c.surface.toLowerCase() === 'clay');
    responseData = {
      intent: "surface_courts",
      data: {
        surface: "clay",
        courts: clayCourts,
        pricing: pricing.courtTypes.clay
      },
      context: "User asked about clay courts"
    };
  }
  else if (userMessageLower.includes('hard') || userMessageLower.includes('hard court')) {
    const hardCourts = tennisCourts.filter(c => c.surface.toLowerCase() === 'hard');
    responseData = {
      intent: "surface_courts",
      data: {
        surface: "hard",
        courts: hardCourts,
        pricing: pricing.courtTypes.hard
      },
      context: "User asked about hard courts"
    };
  }

  res.json(responseData);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
