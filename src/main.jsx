import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { DarkModeProvider } from "./context/darkModeContext";
import { AuthContextProvider } from "./context/authContext";
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { FirebaseProvider } from "./context/FirebaseContext";
import { CartProvider } from "./context/cartContext";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
  // queryCache: new QueryCache({
  //   onError: async (error, query) => {
  //     if (error.request.status === 401) {
  //       console.log("Refreshing Token");
  //       localStorage.removeItem("user");
  //       window.location.reload();
  //     }
  //   },
  // }),
});
ReactDOM.createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <CartProvider>
      <FirebaseProvider>
        <AuthContextProvider>
          <DarkModeProvider>
            <App />
          </DarkModeProvider>
        </AuthContextProvider>
      </FirebaseProvider>
    </CartProvider>
  </QueryClientProvider>
);
