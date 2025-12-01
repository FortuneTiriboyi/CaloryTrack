const data = {
  users: [],
  lastReset: Date.now()
};

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod === 'POST') {
    try {
      const body = JSON.parse(event.body);
      const { name, calories, proof, date } = body;

      if (!name || !calories) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Name and calories required' })
        };
      }

      const today = new Date().toDateString();
      const existingIndex = data.users.findIndex(
        u => u.name === name && new Date(u.date).toDateString() === today
      );

      if (existingIndex >= 0) {
        // Update existing entry
        data.users[existingIndex] = {
          name,
          calories,
          proof,
          date: date || new Date().toLocaleString(),
          timestamp: Date.now()
        };
      } else {
        // Add new entry
        data.users.push({
          name,
          calories,
          proof,
          date: date || new Date().toLocaleString(),
          timestamp: Date.now()
        });
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ message: 'Entry saved' })
      };
    } catch (err) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: err.message })
      };
    }
  }

  return { statusCode: 405, headers, body: 'Method not allowed' };
};
