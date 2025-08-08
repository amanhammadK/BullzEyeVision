import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { ThemeProvider } from "@/components/theme-provider";

// EMERGENCY DOM TEST - BEFORE REACT
console.log('🚨 MAIN.TSX EXECUTING!');
console.log('🚨 DOM READY STATE:', document.readyState);
console.log('🚨 ROOT ELEMENT:', document.getElementById("root"));

// Add visible DOM element WITHOUT React
const emergencyDiv = document.createElement('div');
emergencyDiv.style.cssText = `
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: orange;
  color: black;
  font-size: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999999;
`;
emergencyDiv.textContent = '🚨 MAIN.TSX DOM TEST - ORANGE SCREEN';
document.body.appendChild(emergencyDiv);

console.log('🚨 EMERGENCY DIV ADDED TO DOM');

// Try React render
try {
  console.log('🚨 ATTEMPTING REACT RENDER...');
  createRoot(document.getElementById("root")!).render(
    <ThemeProvider defaultTheme="dark" storageKey="bullzeye-ui-theme">
      <App />
    </ThemeProvider>
  );
  console.log('🚨 REACT RENDER SUCCESS!');
} catch (error) {
  console.error('🚨 REACT RENDER FAILED:', error);
}
