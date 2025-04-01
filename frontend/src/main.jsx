import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { ClerkProvider } from "@clerk/clerk-react";
import { BrowserRouter as Router } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import store from "./store/store.js";

createRoot(document.getElementById("root")).render(
  <ClerkProvider
    publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}
    signUpUrl="/sign-up"
    signInUrl="/login"
  >
    <Router>
      <Provider store={store}>
        <Toaster />
        <App />
      </Provider>
    </Router>
  </ClerkProvider>
);
