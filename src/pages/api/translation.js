export default function handler(req, res) {
  if (req.method === 'POST') {
    const { text, targetLanguage } = req.body;

    // Placeholder logic for translation
    const translatedText = `Translated "${text}" to ${targetLanguage}`;
    res.status(200).json({ translatedText });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
