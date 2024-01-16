import { createContext, useContext } from 'react';

interface IGroupNodeContext {
  groupNodes: Record<string, any>;
  setGroupNodes: (prev: any) => void;
}

const GroupNodeContext = createContext<IGroupNodeContext>({
  groupNodes: {},
  setGroupNodes: () => {},
});

const GroupNodeProvider = (props: { children: React.ReactNode }) => {
  const { children } = props;
  const value = {
    groupNodes: {},
    setGroupNodes,
  };

  function setGroupNodes(callback: (prev: any) => any) {
    const newValue = callback(value.groupNodes);
    console.log('newValue:', newValue);
    value.groupNodes = newValue;
  }

  return (
    <GroupNodeContext.Provider value={value}>
      {children}
    </GroupNodeContext.Provider>
  );
};

export const useCollapsibleNodes = () => {
  const context = useContext(GroupNodeContext);

  if (!context) {
    throw new Error(
      'useCollapsibleNodes must be used within GroupNodeProvider'
    );
  }

  return context;
};

export default GroupNodeProvider;
