export class Router {
  subscribers: any;

  constructor() {
    this.subscribers = {
      // Event when .ctflow file is update/load. Origin mostly from ctflowEditor
      fileUpdate: [],
      // When global state of nodes/edges are changed because of reactFlow Editting
      flowUpdate: [],
    };
    this.register();
  }

  // register all events that we listen from VS editor
  register() {
    window.addEventListener('message', (event) => {
      if (!this.subscribers[event.data.type]) {
        return true;
      }
      this.dispatch(event.data.type, event);
    });
  }

  // trigger when VScode Editor push a new message
  subscribe(eventType: string, callbackFunc: any) {
    this.subscribers[eventType] = [
      ...(this.subscribers?.[eventType] || []),
      callbackFunc,
    ];
  }

  // when a new message come in, dispatch the message to subscribers
  dispatch(eventType: string, event: any) {
    this.subscribers[eventType]?.forEach((subscriber: CallableFunction) => {
      subscriber(event);
    });
  }
}
