import React from 'react';

const StoreContext = React.createContext();

const useStore = () => React.useContext(StoreContext);

export { StoreContext, useStore };
