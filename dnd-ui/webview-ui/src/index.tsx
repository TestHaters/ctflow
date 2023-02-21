import App from './App';
import { createRoot } from 'react-dom/client';

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(<App />);

// import React from "react";
// import ReactDOM from "react-dom";

// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById("root")
// );
