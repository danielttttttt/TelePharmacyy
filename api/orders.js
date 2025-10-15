export default function handler(req, res) {
  if (req.method === 'POST') {
    // Return a mock order confirmation
    const orderConfirmation = {
      id: Math.floor(Math.random() * 10000),
      createdAt: new Date().toISOString(),
      status: 'confirmed'
    };
    
    res.status(200).json(orderConfirmation);
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

export const config = {
  runtime: 'edge',
}