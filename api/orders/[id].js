export default function handler(req, res) {
  const { id } = req.query;
  
  // Mock medications data
 const medications = [
    {
      id: 1,
      name: "Paracetamol",
      genericName: "Acetaminophen",
      description: "Pain reliever and fever reducer",
      price: 5.99,
      expiryDate: "2025-12-31",
      stockStatus: "in_stock",
      image: "/api/placeholder/100/100"
    },
    {
      id: 2,
      name: "Ibuprofen",
      genericName: "Ibuprofen",
      description: "Nonsteroidal anti-inflammatory drug",
      price: 7.49,
      expiryDate: "2025-11-30",
      stockStatus: "in_stock",
      image: "/api/placeholder/100/100"
    },
    {
      id: 3,
      name: "Amoxicillin",
      genericName: "Amoxicillin",
      description: "Antibiotic used to treat bacterial infections",
      price: 12.99,
      expiryDate: "2025-10-15",
      stockStatus: "in_stock",
      image: "/api/placeholder/100/100"
    }
  ];

  // Return a mock order
  const order = {
    id: parseInt(id),
    createdAt: new Date().toISOString(),
    items: medications.slice(0, 3).map((med, index) => ({
      ...med,
      quantity: index + 1
    }))
  };
  
  res.status(200).json(order);
}

export const config = {
  runtime: 'edge',
}