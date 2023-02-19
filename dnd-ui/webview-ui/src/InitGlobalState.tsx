import { useEffect } from 'react';
import { useStore } from './context/store';
import { Router } from './router';
import { DataLoader } from './dataLoader';
import { vscode } from './utilities/vscode';

export default function InitGlobalState({ children }: { children: any }) {
  const [store, setStore] = useStore((store) => store);
  useEffect(() => {
    const router = new Router();
    const dataLoader = new DataLoader();

    dataLoader.subscribe(router);
    window.router = router;
    window.dataLoader = dataLoader;

    // TODO: Fix this hack
    // After router & dataLoader are loaded, request the document data again
    vscode.postMessage({ type: 'fetchDocumentData' });

    setStore({ router, dataLoader });
  }, []);

  return <div>{children}</div>;
}
