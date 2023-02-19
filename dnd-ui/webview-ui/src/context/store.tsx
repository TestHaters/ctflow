import createFastContext from './createFastContext';

const { Provider, useStore } = createFastContext({
  nodes: {},
  edges: {},
  router: {},
  dataLoader: {},
});

export { Provider, useStore };
