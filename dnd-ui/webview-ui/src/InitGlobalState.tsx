import { ReactNode, useEffect } from 'react';
import { vscode } from './utilities/vscode';

export default function InitGlobalState({ children }: { children: ReactNode }) {
  useEffect(() => {
    vscode.postMessage({ type: 'fetchDocumentData' });
  }, []);

  return <div>{children}</div>;
}
