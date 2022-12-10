import { vscode } from "./utilities/vscode";

// Handle messages sent from the extension to the webview
window.addEventListener('message', event => {
	const message = event.data; // The json data that the extension sent
	switch (message.type) {
		case 'update':
			const text = message.text;

			// Update our webview's content
			// updateContent(text);

			// Then persist state information.
			// This state is returned in the call to `vscode.getState` below when a webview is reloaded.
			vscode.setState({ text });

			return;
	}
});

// // Webviews are normally torn down when not visible and re-created when they become visible again.
// // State lets us save information across these re-loads
// const state = vscode.getState();
// if (state) {
// 	// updateContent(state.text);
// 	console.log("UPDATE STATE FROM GET STATE")
// }

// Data Loader will load YAML string to App Nodes (which located in src/models)

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
			this.dispatch(event.type, event);
		});
	}

	// trigger when VScode Editor push a new message
	subscribe(eventType: any, callbackFunc: (event: any) => {}) {
		this.subscribers[eventType] = (this.subscribers[eventType] || []).push(callbackFunc)
	}

	// when a new message come in, dispatch the message to subscribers
	dispatch(eventType: any, event: any) {
		this.subscribers[eventType].forEach((subscriber: CallableFunction) => {
			subscriber(event)
		});
	}
}
