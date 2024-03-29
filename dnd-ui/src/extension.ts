import { commands, ExtensionContext } from "vscode";
import { HelloWorldPanel } from "./panels/HelloWorldPanel";
import { CtFlowEditorProvider } from "./editors/ctflowEditor"

export function activate(context: ExtensionContext) {
  // Create the show hello world command
  // const showHelloWorldCommand = commands.registerCommand("hello-world.showHelloWorld", () => {
  //   HelloWorldPanel.render(context.extensionUri);
  // });

  // Add command to the extension context
  // context.subscriptions.push(showHelloWorldCommand);
  // Register our custom editor providers
  context.subscriptions.push(CtFlowEditorProvider.register(context))
}
