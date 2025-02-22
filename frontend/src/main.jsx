import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { ClerkProvider } from "@clerk/clerk-react";
import { BrowserRouter as Router } from "react-router";
import { Toaster } from "@/components/ui/sonner";
createRoot(document.getElementById("root")).render(
  <ClerkProvider publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY} signUpUrl="/sign-up" signInUrl="/login">
    <Router>
    <Toaster />
      <App />
    </Router>
  </ClerkProvider>
);
