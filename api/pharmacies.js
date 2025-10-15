export default function handler(req, res) {
  // Mock pharmacy data
  const pharmacies = [
    {
      id: 1,
      name: "HealthPlus Pharmacy",
      address: "123 Main Street, Nairobi",
      phone: "+254 700 123 456",
      latitude: -1.286389,
      longitude: 36.817223,
      rating: 4.5,
      distance: 1.2,
      image: "/api/placeholder/100/100"
    },
    {
      id: 2,
      name: "MediCare Pharmacy",
      address: "456 Park Road, Nairobi",
      phone: "+254 711 234 567",
      latitude: -1.276389,
      longitude: 36.827223,
      rating: 4.2,
      distance: 2.5,
      image: "/api/placeholder/100/100"
    },
    {
      id: 3,
      name: "Wellness Hub Pharmacy",
      address: "789 Hospital Lane, Nairobi",
      phone: "+254 722 345 678",
      latitude: -1.296389,
      longitude: 36.807223,
      rating: 4.7,
      distance: 0.8,
      image: "/api/placeholder/100/100"
    },
    {
      id: 4,
      name: "QuickMed Pharmacy",
      address: "321 Market Street, Nairobi",
      phone: "+254 733 456 789",
      latitude: -1.266389,
      longitude: 36.837223,
      rating: 4.0,
      distance: 3.1,
      image: "/api/placeholder/100/100"
    },
    {
      id: 5,
      name: "Family Care Pharmacy",
      address: "654 University Avenue, Nairobi",
      phone: "+254 744 567 890",
      latitude: -1.256389,
      longitude: 36.797223,
      rating: 4.3,
      distance: 4.2,
      image: "/api/placeholder/100/100"
    }
  ];

  const { query } = req.query;
  
  // Filter pharmacies based on query if provided
  let filteredPharmacies = pharmacies;
 if (query) {
    filteredPharmacies = pharmacies.filter(pharmacy => 
      pharmacy.name.toLowerCase().includes(query.toLowerCase())
    );
  }
  
  res.status(200).json(filteredPharmacies);
}

export const config = {
  runtime: 'edge',
}