export default function handler(req, res) {
  // Import mock data
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
    },
    {
      id: 4,
      name: "Lisinopril",
      genericName: "Lisinopril",
      description: "ACE inhibitor used to treat high blood pressure",
      price: 15.99,
      expiryDate: "2026-01-20",
      stockStatus: "low_stock",
      image: "/api/placeholder/100/100"
    },
    {
      id: 5,
      name: "Metformin",
      genericName: "Metformin",
      description: "Medication for type 2 diabetes",
      price: 8.99,
      expiryDate: "2025-09-30",
      stockStatus: "out_of_stock",
      image: "/api/placeholder/100/100"
    },
    {
      id: 6,
      name: "Atorvastatin",
      genericName: "Atorvastatin",
      description: "Statin used to prevent cardiovascular disease",
      price: 18.99,
      expiryDate: "2025-08-31",
      stockStatus: "in_stock",
      image: "/api/placeholder/100/100"
    },
    {
      id: 7,
      name: "Omeprazole",
      genericName: "Omeprazole",
      description: "Proton pump inhibitor used to treat gastric acid",
      price: 14.99,
      expiryDate: "2026-03-15",
      stockStatus: "in_stock",
      image: "/api/placeholder/100/100"
    },
    {
      id: 8,
      name: "Levothyroxine",
      genericName: "Levothyroxine",
      description: "Thyroid hormone replacement",
      price: 11.99,
      expiryDate: "2026-02-28",
      stockStatus: "in_stock",
      image: "/api/placeholder/100/100"
    }
  ];

  const { query } = req.query;
  
  // Filter medications based on query if provided
  let filteredMedications = medications;
  if (query) {
    filteredMedications = medications.filter(medication => 
      medication.name.toLowerCase().includes(query.toLowerCase()) ||
      medication.genericName.toLowerCase().includes(query.toLowerCase())
    );
  }
  
  res.status(200).json(filteredMedications);
}

export const config = {
  runtime: 'edge',
}