import dayjs from "dayjs";
import flow from "lodash.flow";
import * as vscode from "vscode";

import { ICustomNode, ICustomNodeCollection } from "../types";

// group operations on CustomNode to a class
export class CustomNodes {
  static add(collection: ICustomNodeCollection, node: ICustomNode, compiler: string): string {
    return JSON.stringify({
      ...collection,
      updatedAt: dayjs().toISOString(),
      compiler,
      customNodes: [...collection.customNodes, { ...node }],
    });
  }

  static async readJSON(fileName: string): Promise<ICustomNodeCollection> {
    const path = vscode.workspace.workspaceFolders?.[0].uri.fsPath;

    const fileData = await vscode.workspace.fs.readFile(vscode.Uri.file(path + fileName));
    return flow([convertUint8ArrayToString, parseJSON])(fileData);
  }

  static create(node: ICustomNode, compiler: string): string {
    return JSON.stringify({
      collectionName: "Custom Nodes",
      createdAt: dayjs().toISOString(),
      updatedAt: dayjs().toISOString(),
      compiler,
      customNodes: [{ ...node }],
    });
  }

  static write(fileText: string): void {
    const path = vscode.workspace.workspaceFolders?.[0].uri.fsPath;
    const filePath = vscode.Uri.file(path + "/.customNodes.json");
    const writeData = Buffer.from(fileText, "utf8");

    vscode.workspace.fs.writeFile(filePath, writeData);
  }

  static async isExisted(): Promise<boolean> {
    const customNodeJsonFile = await vscode.workspace.findFiles(
      ".customNodes.json",
      "**/node_modules/**",
      1
    );

    return customNodeJsonFile.length > 0;
  }
}

export function parseJSON(text: string) {
  try {
    return JSON.parse(text);
  } catch (error) {
    console.error(error);
    return {};
  }
}

export function convertUint8ArrayToString(fileData: Uint8Array): string {
  const decoder = new TextDecoder("utf-8");
  return decoder.decode(fileData);
}

export async function fetchCustomNodeList(webviewPanel: vscode.WebviewPanel) {
  const path = vscode.workspace.workspaceFolders?.[0].uri.fsPath;
  const fileData = await vscode.workspace.fs.readFile(vscode.Uri.file(path + "/.customNodes.json"));
  const nodeList = flow([convertUint8ArrayToString, parseJSON])(fileData);

  webviewPanel.webview.postMessage({
    type: "customNodeList",
    payload: nodeList,
  });
}
