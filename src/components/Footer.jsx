import React from 'react';
import { Footer as FlowbiteFooter } from 'flowbite-react';
import useTranslation from '../hooks/useTranslation';

const CustomFooter = () => {
  const { t } = useTranslation();

  return (
    <FlowbiteFooter bg="dark" className="bg-gray-800 text-white">
      <div className="w-full py-6">
        <div className="grid w-full grid-cols-1 gap-8 lg:grid-cols-2">
          <div>
            <h3 className="text-xl font-bold text-white">Tele-Pharmacy</h3>
            <p className="mt-2 text-gray-400">{t('footer.trustedPartner')}</p>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
            <div>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-primary">{t('footer.about')}</a></li>
                <li><a href="#" className="text-gray-400 hover:text-primary">{t('footer.privacyPolicy')}</a></li>
              </ul>
            </div>
            <div>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-primary">{t('footer.contact')}</a></li>
                <li><a href="#" className="text-gray-400 hover:text-primary">{t('footer.termsOfService')}</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="my-6 border-t border-gray-700" />
        <div className="w-full text-center sm:flex sm:items-center sm:justify-center">
          <p className="text-gray-400">
            © {new Date().getFullYear()} Tele-Pharmacy™. {t('footer.allRightsReserved')}
          </p>
        </div>
      </div>
    </FlowbiteFooter>
  )
}

export default CustomFooter;