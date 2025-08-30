exports.handler = async (event, context) => {
  // Add CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: 'Method Not Allowed' };
  }

 const { name, phone, timestamp, source, deviceType, os, timezone } = JSON.parse(event.body);

const data = {
  parent: { database_id: process.env.NOTION_DATABASE_ID },
  properties: {
    "Name": { title: [{ text: { content: name } }] },
    "Phone": { rich_text: [{ text: { content: phone } }] },
    "Timestamp": { rich_text: [{ text: { content: timestamp } }] },
    "Source": { rich_text: [{ text: { content: source } }] },
    "Device Type": { rich_text: [{ text: { content: deviceType } }] },
    "OS": { rich_text: [{ text: { content: os } }] },
    "Timezone": { rich_text: [{ text: { content: timezone } }] }
  }
};

  try {
    const response = await fetch('https://api.notion.com/v1/pages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.NOTION_TOKEN}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28'
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(result)
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
};