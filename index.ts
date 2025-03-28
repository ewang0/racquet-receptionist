import express from 'express';
import dotenv from 'dotenv';
// import Retell from 'retell-sdk';
import bodyParser from 'body-parser';
import { scrapeCourtAvailability } from './scrapeGoodland';

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

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
