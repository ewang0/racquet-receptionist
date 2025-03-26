# Goodland Pickleball Club Voice Agent

A minimal prototype for a voice agent that provides information about Goodland Pickleball Club's court availability and pricing using the Retell SDK.

## Setup Instructions

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file based on `.env.example` and add your Retell API credentials:
   ```
   PORT=3000
   RETELL_API_KEY=your_retell_api_key
   RETELL_AGENT_ID=your_existing_agent_id
   RETELL_PHONE_NUMBER=your_phone_number
   WEBHOOK_URL=your_webhook_url
   ```
4. Start the server:
   ```
   npm start
   ```

## Connecting to Retell

1. After starting the server, you can automatically update your agent's webhook URL by making a POST request to:

   ```
   POST /update-agent
   ```

2. This will set your agent's webhook URL to the current server URL + `/webhook`

## Making Test Calls

You can initiate a test call to a phone number by making a POST request to:

```
POST /make-call
Content-Type: application/json

{
  "to_number": "+1234567890"
}
```

## Testing the Agent

Call your agent's phone number. The agent can answer questions about:

- Court availability
- Pricing information
- Hours of operation

## Mock Data

This prototype uses mock data for demonstration purposes:

- 4 courts with varying availability
- Standard pricing structure
- Regular business hours

No actual database or external API calls are made in this prototype.
