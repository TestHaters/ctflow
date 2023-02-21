import { useEffect } from 'react';
import { vscode } from './utilities/vscode';

export default function InitGlobalState({ children }: { children: any }) {
  useEffect(() => {
    vscode.postMessage({ type: 'fetchDocumentData' });
  }, []);

  return <div>{children}</div>;
}
