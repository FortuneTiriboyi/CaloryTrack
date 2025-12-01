// Netlify Function - uses environment variables for storage
// For production, consider using Netlify Blobs or external DB

const data = {
  users: [],
  lastReset: Date.now()
};

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod === 'GET') {
    // Aggregate logs into users
    const usersMap = {};
    data.users.forEach(user => {
      if (!usersMap[user.name]) {
        usersMap[user.name] = {
          name: user.name,
          totalCalories: 0,
          logs: []
        };
      }
      usersMap[user.name].totalCalories += user.calories;
      usersMap[user.name].logs.push({
        date: user.date,
        calories: user.calories,
        proof: user.proof
      });
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        users: Object.values(usersMap),
        lastReset: data.lastReset
      })
    };
  }

  return { statusCode: 405, headers, body: 'Method not allowed' };
};
