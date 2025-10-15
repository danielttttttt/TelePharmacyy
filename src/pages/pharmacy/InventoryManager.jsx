import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';
import useTranslation from '../../hooks/useTranslation';

const InventoryManager = () => {
  const { user } = useContext(AppContext);
  const { t } = useTranslation();
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingMedication, setEditingMedication] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    genericName: '',
    description: '',
    price: '',
    stock: '',
    expiryDate: ''
  });

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        // Mock inventory data
        const mockInventory = [
          { id: 1, name: 'Paracetamol', genericName: 'Acetaminophen', description: 'Pain reliever and fever reducer', price: 5.99, stock: 120, expiryDate: '2025-12-31', stockStatus: 'in_stock' },
          { id: 2, name: 'Ibuprofen', genericName: 'Ibuprofen', description: 'Nonsteroidal anti-inflammatory drug', price: 7.49, stock: 95, expiryDate: '2025-11-30', stockStatus: 'in_stock' },
          { id: 3, name: 'Amoxicillin', genericName: 'Amoxicillin', description: 'Antibiotic used to treat bacterial infections', price: 12.99, stock: 78, expiryDate: '2025-10-15', stockStatus: 'in_stock' },
          { id: 4, name: 'Lisinopril', genericName: 'Lisinopril', description: 'ACE inhibitor used to treat high blood pressure', price: 15.99, stock: 65, expiryDate: '2026-01-20', stockStatus: 'low_stock' },
          { id: 5, name: 'Metformin', genericName: 'Metformin', description: 'Medication for type 2 diabetes', price: 8.99, stock: 52, expiryDate: '2025-09-30', stockStatus: 'in_stock' },
          { id: 6, name: 'Atorvastatin', genericName: 'Atorvastatin', description: 'Statin used to prevent cardiovascular disease', price: 18.99, stock: 0, expiryDate: '2025-08-31', stockStatus: 'out_of_stock' }
        ];
        
        setMedications(mockInventory);
      } catch (error) {
        console.error('Error fetching inventory:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user && user.role === 'pharmacy') {
      fetchInventory();
    }
  }, [user]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingMedication) {
      // Update existing medication
      setMedications(medications.map(med => 
        med.id === editingMedication.id 
          ? { ...med, ...formData, price: parseFloat(formData.price), stock: parseInt(formData.stock) }
          : med
      ));
      setEditingMedication(null);
    } else {
      // Add new medication
      const newMedication = {
        id: medications.length + 1,
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        stockStatus: formData.stock > 10 ? 'in_stock' : formData.stock > 0 ? 'low_stock' : 'out_of_stock'
      };
      
      setMedications([...medications, newMedication]);
    }
    
    // Reset form
    setFormData({
      name: '',
      genericName: '',
      description: '',
      price: '',
      stock: '',
      expiryDate: ''
    });
    setShowAddForm(false);
  };

  const handleEdit = (medication) => {
    setEditingMedication(medication);
    setFormData({
      name: medication.name,
      genericName: medication.genericName,
      description: medication.description,
      price: medication.price.toString(),
      stock: medication.stock.toString(),
      expiryDate: medication.expiryDate
    });
    setShowAddForm(true);
  };

  const handleDelete = (id) => {
    setMedications(medications.filter(med => med.id !== id));
  };

  const getStockStatusColor = (stockStatus) => {
    switch (stockStatus) {
      case 'in_stock':
        return 'bg-green-100 text-green-800';
      case 'low_stock':
        return 'bg-yellow-100 text-yellow-800';
      case 'out_of_stock':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!user || user.role !== 'pharmacy') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('inventoryManager.accessDenied')}</h2>
          <p className="text-gray-600">{t('inventoryManager.noPermission')}</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{t('inventoryManager.title')}</h1>
        <button
          onClick={() => {
            setEditingMedication(null);
            setFormData({
              name: '',
              genericName: '',
              description: '',
              price: '',
              stock: '',
              expiryDate: ''
            });
            setShowAddForm(!showAddForm);
          }}
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          {showAddForm ? t('inventoryManager.cancel') : t('inventoryManager.addMedication')}
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            {editingMedication ? t('inventoryManager.editMedication') : t('inventoryManager.addNewMedication')}
          </h2>
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('inventoryManager.medicationName')}
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                />
              </div>
              
              <div>
                <label htmlFor="genericName" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('inventoryManager.genericName')}
                </label>
                <input
                  type="text"
                  id="genericName"
                  name="genericName"
                  value={formData.genericName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                />
              </div>
              
              <div className="md:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('inventoryManager.description')}
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                ></textarea>
              </div>
              
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('inventoryManager.price')}
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                />
              </div>
              
              <div>
                <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('inventoryManager.stock')}
                </label>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  required
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                />
              </div>
              
              <div>
                <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('inventoryManager.expiryDate')}
                </label>
                <input
                  type="date"
                  id="expiryDate"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setEditingMedication(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                {t('inventoryManager.cancel')}
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                {editingMedication ? t('inventoryManager.updateMedication') : t('inventoryManager.addMedication')}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">{t('inventoryManager.medicationInventory')}</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('inventoryManager.medication')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('inventoryManager.genericName')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('inventoryManager.price')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('inventoryManager.stock')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('inventoryManager.expiryDate')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('inventoryManager.actions')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {medications.map((medication) => (
                <tr key={medication.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{medication.name}</div>
                    <div className="text-sm text-gray-500">{medication.description.substring(0, 50)}...</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {medication.genericName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${medication.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStockStatusColor(medication.stockStatus)}`}>
                      {medication.stock} {t('inventoryManager.inStock')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {medication.expiryDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(medication)}
                      className="text-primary hover:text-primary-dark mr-3"
                    >
                      {t('inventoryManager.edit')}
                    </button>
                    <button
                      onClick={() => handleDelete(medication.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      {t('inventoryManager.delete')}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {medications.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">{t('inventoryManager.noMedications')}</h3>
            <p className="mt-1 text-sm text-gray-500">{t('inventoryManager.addMedicationToStart')}</p>
          </div>
        )}
      </div>
      
      {/* Implementation Notes */}
      <div className="mt-8 bg-yellow-50 rounded-lg p-6">
        <h3 className="text-lg font-medium text-yellow-800 mb-2">{t('inventoryManager.implementationNotes')}</h3>
        <p className="text-yellow-700">
          {t('inventoryManager.frontendSimulation')}
        </p>
        <ul className="mt-2 list-disc list-inside text-yellow-700 space-y-1">
          <li>{t('inventoryManager.note1')}</li>
          <li>{t('inventoryManager.note2')}</li>
          <li>{t('inventoryManager.note3')}</li>
          <li>{t('inventoryManager.note4')}</li>
        </ul>
      </div>
    </div>
  );
};

export default InventoryManager;