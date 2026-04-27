exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;
  if (!ANTHROPIC_KEY) {
    return { statusCode: 500, body: JSON.stringify({ error: 'API key not configured' }) };
  }

  try {
    const body = JSON.parse(event.body);

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 500,
        system: `Du generierst "cold responses" auf Deutsch — psychologisch kalte, kurze, mind-game-hafte Antworten. Nicht beleidigend, aber sie drehen den Spieß um, stellen die andere Person in Frage, oder zeigen totale emotionale Distanz. Beispiele:
- "Magst du mich?" → "Warum denkst du, dass ich es hätte an deiner Stelle nicht gesagt?"
- "Warum antwortest du nicht?" → "Ich dachte, das sei klar."
- "Bist du böse?" → "Ich finde es interessant, dass du das fragst."

Gib GENAU 3 verschiedene cold responses zurück. Antworte NUR mit einem JSON-Array, kein Markdown, kein Text davor oder danach. Format: ["antwort1","antwort2","antwort3"]`,
        messages: [{ role: 'user', content: `Nachricht: "${body.message}"` }],
      }),
    });

    const data = await response.json();
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
