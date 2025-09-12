import { useState } from "react";
import api from "../api/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  async function handleLoginRequest() {
    try {
      const res = await api.post("/auth/request-login", { email });
      setMessage(res.data.message);
    } catch (err: any) {
      setMessage(err.response?.data?.error || "Erreur lors de la connexion");
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Connexion</h1>
      <input
        type="email"
        placeholder="Votre email"
        className="border p-2 rounded mb-2"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={handleLoginRequest}
      >
        Recevoir le lien
      </button>
      {message && <p className="mt-2 text-sm">{message}</p>}
    </div>
  );
}
