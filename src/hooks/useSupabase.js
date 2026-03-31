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

  useEffect(() => { fetchProducts(); }, []);

  const addProduct = async (data) => {
    const { error } = await supabase.from("products").insert(data);
    if (error) alert("Error: " + JSON.stringify(error));
    fetchProducts();
  };

  const updateProduct = async (id, data) => {
    const { error } = await supabase.from("products").update(data, "id", id);
    if (error) alert("Error: " + JSON.stringify(error));
    fetchProducts();
  };

  const deleteProduct = async (id) => {
    const { error } = await supabase.from("products").delete("id", id);
    if (error) alert("Error: " + JSON.stringify(error));
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
    const { data } = await supabase.from("expenses").select("*");
    if (data) setExpenses(data);
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