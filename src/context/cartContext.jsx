import { createContext, useContext, useState } from "react";
import { getCart } from "../api";
import { useQuery } from "@tanstack/react-query";
import { message } from "antd";

export const CartContext = createContext(null);

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const { data , isFetching } = useQuery({
    queryKey: ["cart"],
    queryFn: getCart,
    onSuccess: (data) => {
      setCart(data);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  return (
    <CartContext.Provider value={{ cart , cartFetching: isFetching }}>
      {children}
    </CartContext.Provider>
  );
};
