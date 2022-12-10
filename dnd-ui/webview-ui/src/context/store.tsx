import createFastContext from "./createFastContext";

const { Provider, useStore } = createFastContext({
  nodes: {},
  edges: {},
});

export { Provider, useStore }