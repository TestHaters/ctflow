import { ButtonNodeCompiler } from './cypress/buttonNodeCompiler';
import { VisitPageNodeCompiler } from './cypress/VisitPageNodeCompiler';
import { TextInputNodeCompiler } from './cypress/TextInputNodeCompiler';
import { CheckboxNodeCompiler } from './cypress/CheckboxNodeCompiler';
import { ContainsNodeCompiler } from './cypress/ContainsNodeCompiler';
import { WaitNodeCompiler } from './cypress/WaitNodeCompiler';
import { Graph } from './helpers/graph';
import { CodeInjectionNodeCompiler } from './cypress/CodeInjectionNodeCompiler';
import { CTFlowRecorderCompiler } from './cypress/CTFlowRecorderCompiler';
import { CustomNodeCompiler } from './cypress/CustomNodeCompiler';

export class Compiler {
  // support multiple flow paths in a file
  static compile(store: any): string {
    const graph = new Graph(store.nodes, store.edges);
    const paths = graph.buildPaths();

    const compiledFlows = paths.map((path) => {
      let compiledText = '';

      // path is a list of node ids
      path.forEach((nodeId) => {
        const node = store.nodes[nodeId];
        const compiler = this.findCompiler(node);
        compiledText += compiler.compile(node) + '\n';
      });

      return compiledText;
    });

    return this.buildCypressJsFile(compiledFlows);
  }

  static buildCypressJsFile(compiledFlows: string[]): string {
    return `
		/// <reference types="cypress" />

		context('Generated By Ctflow', () => {
      ${compiledFlows.map((compiledText, index) => {
        return `it('Demo CtFlow ${index}', () => {
            ${compiledText}
          })`;
      })}
		})
		`;
  }

  static findCompiler(node: any): typeof ButtonNodeCompiler {
    switch (node.type) {
      case 'anyNode': {
        if (node.data.componentType === 'buttonNode') {
          return ButtonNodeCompiler;
        } else if (node.data.componentType === 'visitNode') {
          return VisitPageNodeCompiler;
        } else if (node.data.componentType === 'waitNode') {
          return WaitNodeCompiler;
        } else if (node.data.componentType === 'textInputNode') {
          return TextInputNodeCompiler;
        } else if (node.data.componentType === 'checkboxNode') {
          return CheckboxNodeCompiler;
        } else if (node.data.componentType === 'containsNode') {
          return ContainsNodeCompiler;
        } else if (node.data.componentType === 'codeInjectionNode') {
          return CodeInjectionNodeCompiler;
        }
        return ButtonNodeCompiler;
      }
      // case 'ButtonNode': {
      //   return ButtonNodeCompiler;
      // }
      // case 'visitNode': {
      //   return VisitPageNodeCompiler;
      // }
      // case
      //   return TextInputNodeCompiler;
      // }
      // case 'checkboxNode': {
      //   return CheckboxNodeCompiler;
      // }
      // case 'containsNode': {
      //   return ContainsNodeCompiler;
      // }
      // case 'waitNode': {
      //   return WaitNodeCompiler;
      // }
      // case 'codeInjectionNode': {
      //   return CodeInjectionNodeCompiler;
      // }
      case 'customNode': {
        return CustomNodeCompiler;
      }
      case 'CTFlowRecorderNode': {
        return CTFlowRecorderCompiler;
      }
      default: {
        console.log(node, node.type);
        return ButtonNodeCompiler;
      }
    }
  }
}
