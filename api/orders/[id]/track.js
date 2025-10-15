export default function handler(req, res) {
  const { id } = req.query;
  
  // Return mock tracking information
 const trackingInfo = {
    orderId: parseInt(id),
    status: 'in_transit',
    estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 1000).toISOString(), // 2 days from now
    location: 'Distribution Center'
  };
  
  res.status(200).json(trackingInfo);
}

export const config = {
  runtime: 'edge',
}