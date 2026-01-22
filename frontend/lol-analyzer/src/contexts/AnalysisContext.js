import { createContext, useReducer } from 'react';


export const AnalysisContext = createContext();

const initialState = {
    puuid: null,
    match: null,
};

export const analysisReducer = (state, action) => {
    switch (action.type) {
        case 'SET_PUUID':
            return { ...state, puuid: action.payload }
        case 'SET_MATCH':
            return { ...state, match: action.payload }
        case 'RESET':
            return initialState;
        default:
            return state;
    }
};

export const AnalysisContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(analysisReducer, initialState);

    return (
        <AnalysisContext.Provider value={{ ...state, dispatch }}>
            { children }
        </AnalysisContext.Provider> 
    )
}