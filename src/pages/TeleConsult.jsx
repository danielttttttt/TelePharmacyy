import React, { useState } from 'react';
import VideoCall from '../components/VideoCall';
import ChatBox from '../components/ChatBox';
import useTranslation from '../hooks/useTranslation';

const TeleConsult = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('video'); // 'video' or 'chat'
  const [isCalling, setIsCalling] = useState(false);

  const startCall = () => {
    setIsCalling(true);
  };

  const endCall = () => {
    setIsCalling(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">{t('teleConsult.title')}</h1>
      
      <div className="max-w-4xl mx-auto">
        {isCalling ? (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex border-b border-gray-200 mb-6">
              <button
                className={`py-2 px-4 font-medium text-sm ${activeTab === 'video' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('video')}
              >
                {t('teleConsult.videoCall')}
              </button>
              <button
                className={`py-2 px-4 font-medium text-sm ${activeTab === 'chat' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('chat')}
              >
                {t('teleConsult.chat')}
              </button>
            </div>
            
            {activeTab === 'video' ? (
              <VideoCall onEndCall={endCall} />
            ) : (
              <ChatBox />
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">{t('teleConsult.connectWithPharmacist')}</h2>
            <p className="text-gray-600 mb-6">
              {t('teleConsult.pharmacistDescription')}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div 
                className="border-2 border-gray-200 rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors"
                onClick={() => setActiveTab('video')}
              >
                <div className="bg-primary text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 0 00-2 2v8a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">{t('teleConsult.videoConsultation')}</h3>
                <p className="text-gray-600">{t('teleConsult.videoConsultationDescription')}</p>
              </div>
              
              <div 
                className="border-2 border-gray-200 rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors"
                onClick={() => setActiveTab('chat')}
              >
                <div className="bg-primary text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">{t('teleConsult.chatConsultation')}</h3>
                <p className="text-gray-600">{t('teleConsult.chatConsultationDescription')}</p>
              </div>
            </div>
            
            <div className="text-center">
              <button 
                onClick={startCall}
                className="bg-primary text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-primary-dark transition-colors flex items-center mx-auto"
              >
                {activeTab === 'video' ? (
                  <>
                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 0 00-2 2v8a2 2 0 002 2z"></path>
                    </svg>
                    {t('teleConsult.startVideoConsultation')}
                  </>
                ) : (
                  <>
                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                    </svg>
                    {t('teleConsult.startChatConsultation')}
                  </>
                )}
              </button>
              <p className="text-gray-500 mt-4">{t('teleConsult.availability')}</p>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.95 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.32 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">{t('teleConsult.licensedProfessionals')}</h3>
            <p className="text-gray-600">{t('teleConsult.licensedProfessionalsDescription')}</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 0 00-2-2H6a2 0 00-2 2v6a2 0 2 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">{t('teleConsult.securePrivate')}</h3>
            <p className="text-gray-600">{t('teleConsult.securePrivateDescription')}</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 1 -1 8 0 9 0 1 8 0z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">{t('teleConsult.availability247')}</h3>
            <p className="text-gray-600">{t('teleConsult.availability247Description')}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TeleConsult;