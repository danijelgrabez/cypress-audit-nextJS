// visit http://localhost:3000/api/hello?text=yo
export default function handler(req, res) {
  res.status(200).json({ text: req.query.text || 'Hello' });
}
