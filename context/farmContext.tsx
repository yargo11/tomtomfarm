'use client'

import { fetchCropTypesFromAPI } from '@/services/cropsService';
import { fetchFarmsFromAPI } from '@/services/farmsService';
import type { CropsProps, FarmsProps } from '@/types';
import { createContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';


interface ContextType {
  farms: FarmsProps[]
  setFarms: (farm: FarmsProps[]) => void
  cropsList: CropsProps[]
  setCropsList: (crops: CropsProps[]) => void
  fetchFarms: () => Promise<void>,
  fetchCrops: () => Promise<void>,
}

export const FarmContext = createContext<ContextType | undefined>(undefined);

export const FarmsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

  const [farms, setFarms] = useState<FarmsProps[]>([])
  const [cropsList, setCropsList] = useState<CropsProps[]>([])

  const fetchFarms = useCallback(async () => {
    try {
      const data = await fetchFarmsFromAPI()
      setFarms(data)
    } catch (error) {
      console.log('Error fetching farms: ', error)
    }
  }, [])

  const fetchCrops = useCallback(async () => {
    try {
      const data = await fetchCropTypesFromAPI()
      setCropsList(data)
    } catch (error) {
      console.log('Error fetching crops list: ', error)
    }
  }, [])

  useEffect(() => {
    fetchFarms()
    fetchCrops()
  }, [fetchFarms, fetchCrops])

  return (
    <FarmContext.Provider
      value={{
        farms,
        setFarms,
        cropsList,
        setCropsList,
        fetchFarms,
        fetchCrops
      }}
    >
      {children}
    </FarmContext.Provider>
  );
};
