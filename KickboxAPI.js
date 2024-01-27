//Email Verification using Kickbox API

// Import libraries
const hubspot = require('@hubspot/api-client');
const axios = require('axios');

exports.main = async (event, callback) => {
    // Connect to HubSpot API:
    const hubspotClient = new hubspot.Client({ accessToken: process.env.PrivateAppKey});
    
    // Retrieve the email from inputFields:
    const email = event.inputFields['email'];

    try {
        // Verify the email using Kickbox API:
        const response = await axios.get(`https://api.kickbox.com/v2/verify?email=${email}&apikey=${process.env.KickboxKey}`);
        const data = response.data; // we could deconstruct this in the line above by changing response to { data }

        await hubspotClient.crm.contacts.basicApi.update(event.object.objectId, {
            "properties": {
                "email_verification": data.result
            }
        });

        // Send response back with the sendex score:
        callback({
            outputFields: {
                email_status: data.result
            }
        });
	} catch (err) {
      console.error(err);
      // We will automatically retry when the code fails because of a rate limiting error from the HubSpot API.
      throw err;
    }
}