// src/hooks/useProducts.js
import { useState, useEffect } from "react";
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "products"), snap => {
      setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return unsub;
  }, []);

  const addProduct = (data) => addDoc(collection(db, "products"), { ...data, createdAt: serverTimestamp() });
  const updateProduct = (id, data) => updateDoc(doc(db, "products", id), data);
  const deleteProduct = (id) => deleteDoc(doc(db, "products", id));

  return { products, loading, addProduct, updateProduct, deleteProduct };
}

export function useOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "orders"), snap => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      data.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      setOrders(data);
      setLoading(false);
    });
    return unsub;
  }, []);

  const addOrder = (data) => addDoc(collection(db, "orders"), { ...data, createdAt: serverTimestamp() });
  const updateOrder = (id, data) => updateDoc(doc(db, "orders", id), data);

  return { orders, loading, addOrder, updateOrder };
}
