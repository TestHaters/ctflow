import * as vscode from "vscode";
import { getNonce } from "../utilities/nonce";
import { Disposable, Webview, WebviewPanel, window, Uri, ViewColumn } from "vscode";
import { getUri } from "../utilities/getUri";
import flow from "lodash.flow";
import { ICustomNodePayload } from "../types";
import {
  addCustomNodeCollection,
  convertUint8ArrayToString,
  createCustomNodeCollection,
  fetchCustomNodeList,
  isCustomNodeExisted,
  parseJSON,
  writeDataToCustomNodesCollection,
} from "../utilities/customNodes";

interface CtflowEdit {
  readonly nodes: ReadonlyArray<any>;
  readonly edges: ReadonlyArray<any>;
}

/**
 * Provider for cat scratch editors.
 *
 * Cat scratch editors are used for `.cscratch` files, which are just json files.
 * To get started, run this extension and open an empty `.cscratch` file in VS Code.
 *
 * This provider demonstrates:
 *
 * - Setting up the initial webview for a custom editor.
 * - Loading scripts and styles in a custom editor.
 * - Synchronizing changes between a text document and a custom editor.
 */
export class CtFlowEditorProvider implements vscode.CustomTextEditorProvider {
  public static register(context: vscode.ExtensionContext): vscode.Disposable {
    const provider = new CtFlowEditorProvider(context);
    const providerRegistration = vscode.window.registerCustomEditorProvider(
      CtFlowEditorProvider.viewType,
      provider
    );

    return providerRegistration;
  }

  private static readonly viewType = "codelessTesting.ctflow";

  constructor(private readonly context: vscode.ExtensionContext) {}

  // this variable will be use in writeCompiledFile
  private textDocument: vscode.TextDocument | undefined;
  /**
   * Called when our custom editor is opened.
   *
   *
   */
  public async resolveCustomTextEditor(
    document: vscode.TextDocument,
    webviewPanel: vscode.WebviewPanel,
    _token: vscode.CancellationToken
  ): Promise<void> {
    // Setup initial content for the webview
    webviewPanel.webview.options = {
      enableScripts: true,
    };

    webviewPanel.webview.html = this.getHtmlForWebview(
      webviewPanel.webview,
      this.context.extensionUri
    );

    function updateWebview() {
      webviewPanel.webview.postMessage({
        type: "fileUpdate",
        text: document.getText(),
      });
    }

    // this variable will be use in writeCompiledFile
    this.textDocument = document;
    // Hook up event handlers so that we can synchronize the webview with the text document.
    //
    // The text document acts as our model, so we have to sync change in the document to our
    // editor and sync changes in the editor back to the document.
    //
    // Remember that a single text document can also be shared between multiple custom
    // editors (this happens for example when you split a custom editor)

    const changeDocumentSubscription = vscode.workspace.onDidChangeTextDocument((e) => {
      if (e.document.uri.toString() === document.uri.toString()) {
        updateWebview();
      }
    });

    // Make sure we get rid of the listener when our editor is closed.
    webviewPanel.onDidDispose(() => {
      changeDocumentSubscription.dispose();
    });

    // Receive message from the webview.
    webviewPanel.webview.onDidReceiveMessage((e) => {
      switch (e.type) {
        case "changed":
          // this.makeEdit(message as CtflowEdit);
          return;

        case "fireEventFromEditor":
          webviewPanel.webview.postMessage({
            type: e.data.eventType,
            text: document.getText(),
          });
          return;

        // Push document text to web app
        case "fetchDocumentData":
          updateWebview();
          return;

        case "importCustomNodes":
          console.log("HIT importCustomNodes");

          this.appendMoreCustomNodes(e.data);
          return;

        // When Flow is changed, but not yet saved
        case "addEdit":
          // TODO: rewrite all file, perhaps only append to file
          // and then create a separate event for deletion
          this.writeYamlFile(e.data.yamlData, e.data.fileExtension);
          this._savedEdits.push(e.data.yamlData);
          return;

        case "createCustomNode":
          this.writeCustomNodeFile(e.data);
          return;

        case "fetchCustomNodes":
          fetchCustomNodeList(webviewPanel);
          return;

        case "writeCompiledFile":
          this.writeCompiledFile(e.data.compiledText, e.data.fileExtension);
          return;
      }
    });

    updateWebview();
  }

  private getHtmlForWebview(webview: vscode.Webview, extensionUri: Uri): string {
    // The CSS file from the React build output
    const stylesUri = getUri(webview, extensionUri, ["webview-ui", "build", "assets", "index.css"]);
    // The JS file from the React build output
    const scriptUri = getUri(webview, extensionUri, ["webview-ui", "build", "assets", "index.js"]);

    // Tip: Install the es6-string-html VS Code extension to enable code highlighting below
    return /*html*/ `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <link rel="stylesheet" type="text/css" href="${stylesUri}">
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.1/css/all.min.css" integrity="sha512-MV7K8+y+gLIBoVD59lQIYicR65iaqukzvf/nwasF0nqhPay5w/9lJmVM2hMDcnK1OnMGCdVK+iQrJ7lzPJQd1w==" crossorigin="anonymous" referrerpolicy="no-referrer" />
          <title>Hello World</title>
        </head>
        <body>
          <div id="root"></div>
          <script type="module" src="${scriptUri}"></script>
          <script src="https://cdn.tailwindcss.com"></script>

        </body>
      </html>
    `;
  }

  private writeCompiledFile(compiledText: string, fileExtension: string) {
    const writeData = Buffer.from(compiledText, "utf8");
    let compiledFilePath = this.textDocument?.uri.fsPath + "." + fileExtension;
    vscode.workspace.fs.writeFile(vscode.Uri.file(compiledFilePath), writeData);
  }

  private writeYamlFile(fileText: string, ext: string) {
    const writeData = Buffer.from(fileText, "utf8");
    let yamlFilePath = this.textDocument?.uri.fsPath.includes(".")
      ? this.textDocument?.uri.fsPath
      : "";
    console.log("vscode.Uri.file(yamlFilePath)", vscode.Uri.file(yamlFilePath));
    vscode.workspace.fs.writeFile(vscode.Uri.file(yamlFilePath), writeData);
  }

  private async writeCustomNodeFile({ payload, compiler }: ICustomNodePayload) {
    const path = vscode.workspace.workspaceFolders?.[0].uri.fsPath;

    const customNodeJsonFile = await vscode.workspace.findFiles(
      ".customNodes.json",
      "**/node_modules/**",
      1
    );
    let fileText = createCustomNodeCollection(payload, compiler);

    if (await isCustomNodeExisted()) {
      const fileData = await vscode.workspace.fs.readFile(
        vscode.Uri.file(path + "/.customNodes.json")
      );
      const curNodes = flow([convertUint8ArrayToString, parseJSON])(fileData);
      fileText = addCustomNodeCollection(curNodes, payload, compiler);
    }
    writeDataToCustomNodesCollection(fileText, path);
  }

  private async appendMoreCustomNodes(text: Record<string, any>) {
    const path = vscode.workspace.workspaceFolders?.[0].uri.fsPath;
    if (await isCustomNodeExisted()) {
      const fileData = await vscode.workspace.fs.readFile(
        vscode.Uri.file(path + "/.customNodes.json")
      );
      const curNodes = flow([convertUint8ArrayToString, parseJSON])(fileData);
      const incomingNodes = parseJSON(text.payload);
      if (curNodes.compiler === incomingNodes.compiler) {
        const newFileData = {
          ...incomingNodes,
          customNodes: [...curNodes.customNodes, ...incomingNodes.customNodes],
        };
        writeDataToCustomNodesCollection(JSON.stringify(newFileData), path);
      } else {
        console.error(
          "Different compiler version, current .customNode.json file compiler is " +
            curNodes.compiler +
            " while the imported file has " +
            incomingNodes.compiler
        );
      }
    } else {
      writeDataToCustomNodesCollection(text.payload, path);
    }
  }

  /**
   * Try to get a current document as json text.
   */
  private getDocumentAsJson(document: vscode.TextDocument): any {
    const text = document.getText();
    if (text.trim().length === 0) {
      return {};
    }

    try {
      return JSON.parse(text);
    } catch {
      throw new Error("Could not get document as json. Content is not valid json");
    }
  }

  /**
   * Write out the json to a given document.
   */
  private updateTextDocument(document: vscode.TextDocument, json: any) {
    const edit = new vscode.WorkspaceEdit();

    // Just replace the entire document every time for this example extension.
    // A more complete extension should compute minimal edits instead.
    edit.replace(
      document.uri,
      new vscode.Range(0, 0, document.lineCount, 0),
      JSON.stringify(json, null, 2)
    );

    return vscode.workspace.applyEdit(edit);
  }

  private _documentData: Uint8Array | undefined;
  private _edits: Array<CtflowEdit> = [];
  private _savedEdits: Array<CtflowEdit> = [];

  // When flow is changed, we will update the current text_data.
  private makeEdit(edit: CtflowEdit) {
    this._edits.push(edit);

    // Support redo/undo - later

    // this._onDidChange.fire({
    // 	label: 'Stroke',
    // 	undo: async () => {
    // 		this._edits.pop();
    // 		this._onDidChangeDocument.fire({
    // 			edits: this._edits,
    // 		});
    // 	},
    // 	redo: async () => {
    // 		this._edits.push(edit);
    // 		this._onDidChangeDocument.fire({
    // 			edits: this._edits,
    // 		});
    // 	}
    // });
  }

  /**
   * Called by VS Code when the user saves the document.
   */
  async save(cancellation: vscode.CancellationToken): Promise<void> {
  	// await this.saveAs(this.uri, cancellation);
  	// this._savedEdits = Array.from(this._edits);
  }

  /**
   * Called by VS Code when the user saves the document to a new location.
   */
  async saveAs(targetResource: vscode.Uri, cancellation: vscode.CancellationToken): Promise<void> {
  	// const fileData = await this._delegate.getFileData();
  	// if (cancellation.isCancellationRequested) {
  	// 	return;
  	// }
  	// await vscode.workspace.fs.writeFile(targetResource, fileData);
  }
}
