import dayjs from "dayjs";
import flow from "lodash.flow";
import * as vscode from "vscode";

import { ICustomNode, ICustomNodeCollection } from "../types";

export function createCustomNodeCollection(node: ICustomNode, compiler: string) {
  return JSON.stringify({
    collectionName: "Custom Nodes",
    createdAt: dayjs().toISOString(),
    updatedAt: dayjs().toISOString(),
    compiler,
    customNodes: [{ ...node }],
  });
}

export function addCustomNodeCollection(
  collection: ICustomNodeCollection,
  node: ICustomNode,
  compiler: string
) {
  return JSON.stringify({
    ...collection,
    updatedAt: dayjs().toISOString(),
    compiler,
    customNodes: [...collection.customNodes, { ...node }],
  });
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

export function writeDataToCustomNodesCollection(fileText: string, path?: string) {
  const filePath = vscode.Uri.file(path + "/.customNodes.json");
  const writeData = Buffer.from(fileText, "utf8");

  vscode.workspace.fs.writeFile(filePath, writeData);
  vscode.workspace.fs.writeFile(
    vscode.Uri.file(path + "/.gitignore"),
    Buffer.from("/.customNode.json", "utf-8")
  );
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

export async function isCustomNodeExisted() {
  const customNodeJsonFile = await vscode.workspace.findFiles(
    ".customNodes.json",
    "**/node_modules/**",
    1
  );

  return customNodeJsonFile.length > 0;
}
