import { Router } from "../router";
import createFastContext from "./createFastContext";

const { Provider, useStore } = createFastContext({
  nodes: {},
  edges: {},
  router: new Router(),
});

export { Provider, useStore }