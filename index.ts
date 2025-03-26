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
  const transcript = call.transcript;
  const callId = call.call_id;

  console.log(`Received webhook for call ${callId}`);
  console.log('Transcript:', transcript);
  console.log('request body:', req.body);
  
  // Default response if we can't determine intent
  let responseToUser = {
    response: "I'm not sure I understand. I can help with tennis court availability, pricing, or hours of operation. What would you like to know?",
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
    
    // Handle court availability request
    const courtInfo = tennisCourts.map(court => 
      `${court.name} (${court.surface}) is available at: ${court.availability.join(', ')}`
    ).join('. ');
    
    responseToUser = {
      response: `Here's our current tennis court availability: ${courtInfo}. Would you like to book a court?`,
    };
  } 
  else if (userMessageLower.includes('price') || 
           userMessageLower.includes('cost') || 
           userMessageLower.includes('fee') || 
           userMessageLower.includes('how much')) {
    
    // Handle pricing request
    responseToUser = {
      response: `Our standard rate is ${pricing.hourlyRate}. Clay courts are ${pricing.courtTypes.clay} and hard courts are ${pricing.courtTypes.hard}. ${pricing.discounts}. Would you like to know about our membership options?`,
    };
  } 
  else if (userMessageLower.includes('hour') || 
           userMessageLower.includes('open') || 
           userMessageLower.includes('close') || 
           userMessageLower.includes('time')) {
    
    // Handle hours of operation request
    responseToUser = {
      response: `We're open weekdays from ${hoursOfOperation.weekdays}, weekends from ${hoursOfOperation.weekends}, and holidays from ${hoursOfOperation.holidays}. Is there a specific day you're interested in?`,
    };
  }
  else if (userMessageLower.includes('court 1') || userMessageLower.includes('court one')) {
    const court = tennisCourts.find(c => c.id === 1);
    if (court) {
      responseToUser = {
        response: `${court.name} is a ${court.surface} court and is available at: ${court.availability.join(', ')}. Would you like to book this court?`,
      };
    } else {
      responseToUser = {
        response: "I'm sorry, I couldn't find information about Court 1.",
      };
    }
  }
  else if (userMessageLower.includes('court 2') || userMessageLower.includes('court two')) {
    const court = tennisCourts.find(c => c.id === 2);
    if (court) {
      responseToUser = {
        response: `${court.name} is a ${court.surface} court and is available at: ${court.availability.join(', ')}. Would you like to book this court?`,
      };
    } else {
      responseToUser = {
        response: "I'm sorry, I couldn't find information about Court 2.",
      };
    }
  }
  else if (userMessageLower.includes('court 3') || userMessageLower.includes('court three')) {
    const court = tennisCourts.find(c => c.id === 3);
    if (court) {
      responseToUser = {
        response: `${court.name} is a ${court.surface} court and is available at: ${court.availability.join(', ')}. Would you like to book this court?`,
      };
    } else {
      responseToUser = {
        response: "I'm sorry, I couldn't find information about Court 3.",
      };
    }
  }
  else if (userMessageLower.includes('court 4') || userMessageLower.includes('court four')) {
    const court = tennisCourts.find(c => c.id === 4);
    if (court) {
      responseToUser = {
        response: `${court.name} is a ${court.surface} court and is available at: ${court.availability.join(', ')}. Would you like to book this court?`,
      };
    } else {
      responseToUser = {
        response: "I'm sorry, I couldn't find information about Court 4.",
      };
    }
  }
  else if (userMessageLower.includes('clay') || userMessageLower.includes('clay court')) {
    const clayCourts = tennisCourts.filter(c => c.surface.toLowerCase() === 'clay');
    const clayCourtInfo = clayCourts.map(court => 
      `${court.name} is available at: ${court.availability.join(', ')}`
    ).join('. ');
    
    responseToUser = {
      response: `We have ${clayCourts.length} clay courts. ${clayCourtInfo}. Clay courts cost ${pricing.courtTypes.clay}. Would you like to book one?`,
    };
  }
  else if (userMessageLower.includes('hard') || userMessageLower.includes('hard court')) {
    const hardCourts = tennisCourts.filter(c => c.surface.toLowerCase() === 'hard');
    const hardCourtInfo = hardCourts.map(court => 
      `${court.name} is available at: ${court.availability.join(', ')}`
    ).join('. ');
    
    responseToUser = {
      response: `We have ${hardCourts.length} hard courts. ${hardCourtInfo}. Hard courts cost ${pricing.courtTypes.hard}. Would you like to book one?`,
    };
  }

  res.json(responseToUser);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
