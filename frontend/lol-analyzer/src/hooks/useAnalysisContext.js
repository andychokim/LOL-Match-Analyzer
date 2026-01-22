import { useContext } from 'react';
import { AnalysisContext } from '../contexts/AnalysisContext';


export const useAnalysisContext = () => {
    const context = useContext(AnalysisContext);

    if (!context) {
        throw new Error('useAnalysisContext must be used within an AnalysisContextProvider');
    }
    return context;
};