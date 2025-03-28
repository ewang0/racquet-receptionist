import express from 'express';
import dotenv from 'dotenv';
// import Retell from 'retell-sdk';
import bodyParser from 'body-parser';
import { scrapeCourtAvailability } from './scrapeGoodland';
import { Twilio } from "twilio";

dotenv.config();

const app = express();
app.use(bodyParser.json());

const port = process.env.PORT || 3000;
const retellApiKey = process.env.RETELL_API_KEY;

if (!retellApiKey) {
  throw new Error('RETELL_API_KEY is required');
}

// Add a new route for testing court availability scraping
app.post('/goodland/court-availability', async (req, res) => {
  try {
    console.log('Testing court availability scraping...');
    const liveAvailability = await scrapeCourtAvailability();
    
    // Structured response data
    const responseData: {
      intent: string;
      data: any;
      context: string;
    } = {
      intent: "court_availability_test",
      data: {
        liveAvailability: liveAvailability
      },
      context: "This is a test endpoint for court availability scraping."
    };
   
    console.log("responseData:", responseData);
    res.json(responseData);
  } catch (error: unknown) {
    console.error('Error fetching live court availability:', error);
    
    // Error response with structured data
    const responseData: {
      intent: string;
      data: any;
      context: string;
    } = {
      intent: "error",
      data: {
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      context: "An error occurred while testing court availability scraping."
    };
    
    res.status(500).json(responseData);
  }
});

app.post('/goodland/send-sms', async (req, res) => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID!;
  const authToken = process.env.TWILIO_AUTH_TOKEN!;
  const whatsappFrom = process.env.TWILIO_WHATSAPP_NUMBER!;
  const whatsappTo = process.env.TWILIO_WHATSAPP_TO_NUMBER!;
  const { courtNumber, time } = req.body;
  const message = `Thanks for sending a booking request for court ${courtNumber} at ${time}. Please follow this link to book and confirm your reservation: https://goodland.podplay.app/book`;

  const client = new Twilio(accountSid, authToken);

  try {
    const response = await client.messages.create({
      from: `whatsapp:${whatsappFrom}`,
      to: `whatsapp:${whatsappTo}`,
      body: message,
    });

    console.log(`twilioResponse:`, response)

    return res.status(200).json({ success: true, response });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
