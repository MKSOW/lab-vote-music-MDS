import { useAuth } from "../hooks/useAuth";

export default function Profile() {
  const { user } = useAuth();

  if (!user)
    return <p className="text-center mt-10">⏳ Chargement...</p>;

  return (
    <section className="page-section">
      <h1 className="page-title">👤 Mon Profil</h1>

      <div
        style={{
          backgroundColor: "#1a1a1a",
          borderRadius: "8px",
          padding: "1.5rem",
          boxShadow: "0 0 10px rgba(0,0,0,0.6)",
        }}
      >
        <p>
          <strong style={{ color: "var(--accent)" }}>Nom :</strong> {user.lastname}
        </p>
        <p>
          <strong style={{ color: "var(--accent)" }}>Prénom :</strong> {user.firstname}
        </p>
        <p>
          <strong style={{ color: "var(--accent)" }}>Email :</strong> {user.email}
        </p>
        <p>
          <strong style={{ color: "var(--accent)" }}>Promotion :</strong>{" "}
          {user.promotion}
        </p>
        <p>
          <strong style={{ color: "var(--accent)" }}>Dernière connexion :</strong>{" "}
          {new Date(user.lastLogin).toLocaleString()}
        </p>
      </div>
    </section>
  );
}
