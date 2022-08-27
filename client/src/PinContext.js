import React, { useContext, useState } from "react";

const PinContext = React.createContext();
const PinUpdateContext = React.createContext();

export function usePin() {
  return useContext(PinContext);
}

export function usePinUpdate() {
  return useContext(PinUpdateContext);
}

export function PinProvider({ children }) {
  const [pinnedEvent, setPinnedEvent] = useState(0); //Should be a uuid
  const [testNum, setTestNum] = useState(0); //Should be a uuid

  function toggleNum() {
    setTestNum((prevNum) => prevNum++);
  }

  return (
    <PinContext.Provider value={pinnedEvent}>
      <PinUpdateContext.Provider value={setPinnedEvent}>
        {children}
      </PinUpdateContext.Provider>
    </PinContext.Provider>
  );
}
