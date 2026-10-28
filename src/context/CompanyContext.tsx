import React, { createContext, useContext, useState } from 'react';
import { SubCompany } from '../types';
import { initialSubCompanies } from '../data/mockData';

interface CompanyContextType {
  subCompanies: SubCompany[];
  selectedCompanyId: string; // 'all' or sub-company id
  setSelectedCompanyId: (id: string) => void;
  selectedCompany: SubCompany | undefined;
  addNewSubCompany: (company: Omit<SubCompany, 'id'>) => void;
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export const CompanyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [subCompanies, setSubCompanies] = useState<SubCompany[]>(initialSubCompanies);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('all');

  const selectedCompany = selectedCompanyId === 'all' 
    ? undefined 
    : subCompanies.find(c => c.id === selectedCompanyId);

  const addNewSubCompany = (newComp: Omit<SubCompany, 'id'>) => {
    const id = `sub-comp-${Date.now()}`;
    setSubCompanies(prev => [...prev, { ...newComp, id }]);
  };

  return (
    <CompanyContext.Provider value={{
      subCompanies,
      selectedCompanyId,
      setSelectedCompanyId,
      selectedCompany,
      addNewSubCompany
    }}>
      {children}
    </CompanyContext.Provider>
  );
};

export const useCompany = () => {
  const context = useContext(CompanyContext);
  if (!context) throw new Error('useCompany must be used within a CompanyProvider');
  return context;
};

