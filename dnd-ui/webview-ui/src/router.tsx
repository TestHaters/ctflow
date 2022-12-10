import { stringify } from "querystring";
import { DocumentSymbol } from "vscode";
import { vscode } from "./utilities/vscode";
export class Router {
	subscribers: any

	constructor() {
		this.subscribers = {}
		this.register()
	}

	// register all events that we listen from VS editor
	register() {
		window.addEventListener('message', event => {
			if (!this.subscribers[event.type]) { return true }
			console.log("EVENT", event)
			this.dispatch(event.type, event);
		});
	}

	// trigger when VScode Editor push a new message
	subscribe(eventType: string, callbackFunc: any) {
		this.subscribers[eventType] = [...(this.subscribers?.[eventType] || []), callbackFunc]

	}

	// when a new message come in, dispatch the message to subscribers
	dispatch(eventType: string, event: any) {
		this.subscribers[eventType]?.forEach((subscriber: CallableFunction) => {
			subscriber(event)
		});
	}
}
