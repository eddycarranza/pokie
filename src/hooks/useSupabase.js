// src/hooks/useSupabase.js
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    setLoading(true);
    const { data } = await supabase.from("products").select("*");
    if (data) setProducts(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const addProduct = async (data) => {
    await supabase.from("products").insert(data);
    fetchProducts();
  };

  const updateProduct = async (id, data) => {
    await supabase.from("products").update(data, "id", id);
    fetchProducts();
  };

  const deleteProduct = async (id) => {
    await supabase.from("products").delete("id", id);
    fetchProducts();
  };

  return { products, loading, addProduct, updateProduct, deleteProduct };
}

export function useOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    const { data } = await supabase.from("orders").select("*");
    if (data) setOrders(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const addOrder = async (data) => {
    await supabase.from("orders").insert(data);
    fetchOrders();
  };

  const updateOrder = async (id, data) => {
    await supabase.from("orders").update(data, "id", id);
    fetchOrders();
  };

  return { orders, loading, addOrder, updateOrder };
}