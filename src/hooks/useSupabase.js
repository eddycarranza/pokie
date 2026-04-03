// src/hooks/useSupabase.js
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

// ============ LÓGICA DE SEGURIDAD GLOBAL ============
// Esta función revisa si Supabase nos bloquea porque el pase VIP (JWT) caducó.
const handleFetchResponse = (error, data, setState) => {
  // 1. Si el token expiró, limpiamos la memoria y recargamos para usar la llave pública
  if (error && error.message === "JWT expired") {
    console.warn("El token de administrador expiró. Limpiando sesión...");
    localStorage.removeItem("admin_token");
    window.location.reload();
    return;
  }

  // 2. Si no hay error y los datos son válidos, actualizamos la lista
  if (!error && Array.isArray(data)) {
    setState(data);
  } else {
    // 3. Si hay otro tipo de error, lo mostramos en consola y evitamos que la app colapse
    console.error("Error DETALLADO Supabase:", JSON.stringify(error || data, null, 2));
    setState([]); 
  }
};
// ====================================================

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("products").select("*");
    handleFetchResponse(error, data, setProducts);
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, []);

  const addProduct = async (data) => {
    const { error } = await supabase.from("products").insert(data);
    if (error) alert("Error al agregar producto: " + JSON.stringify(error));
    fetchProducts();
  };

  const updateProduct = async (id, data) => {
    const { error } = await supabase.from("products").update(data, "id", id);
    if (error) alert("Error al actualizar producto: " + JSON.stringify(error));
    fetchProducts();
  };

  const deleteProduct = async (id) => {
    const { error } = await supabase.from("products").delete("id", id);
    if (error) alert("Error al eliminar producto: " + JSON.stringify(error));
    fetchProducts();
  };

  return { products, loading, addProduct, updateProduct, deleteProduct };
}

export function useOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("orders").select("*");
    handleFetchResponse(error, data, setOrders);
    setLoading(false);
  };

  useEffect(() => { fetchOrders(); }, []);

  const addOrder = async (data) => {
    const { error } = await supabase.from("orders").insert(data);
    if (error) alert("Error al crear pedido: " + JSON.stringify(error));
    fetchOrders();
  };

  const updateOrder = async (id, data) => {
    const { error } = await supabase.from("orders").update(data, "id", id);
    if (error) alert("Error al actualizar pedido: " + JSON.stringify(error));
    fetchOrders();
  };

  const deleteOrder = async (id) => {
    const { error } = await supabase.from("orders").delete("id", id);
    if (error) alert("Error al eliminar pedido: " + JSON.stringify(error));
    fetchOrders();
  };

  return { orders, loading, addOrder, updateOrder, deleteOrder };
}

export function useExpenses() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchExpenses = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("expenses").select("*");
    handleFetchResponse(error, data, setExpenses);
    setLoading(false);
  };

  useEffect(() => { fetchExpenses(); }, []);

  const addExpense = async (data) => {
    const { error } = await supabase.from("expenses").insert(data);
    if (error) alert("Error al agregar egreso: " + JSON.stringify(error));
    fetchExpenses();
  };

  const deleteExpense = async (id) => {
    const { error } = await supabase.from("expenses").delete("id", id);
    if (error) alert("Error al eliminar egreso: " + JSON.stringify(error));
    fetchExpenses();
  };

  return { expenses, loading, addExpense, deleteExpense };
}