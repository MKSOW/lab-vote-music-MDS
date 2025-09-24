import { useAuth } from "../hooks/useAuth";

export default function Profile() {
  const { user } = useAuth();

  if (!user) return <p className="text-center mt-10">⏳ Chargement...</p>;

  return (
    <section className="p-4 max-w-xl mx-auto bg-black text-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4">👤 Mon Profil</h1>

      <div className="space-y-3">
        <p><strong>Nom :</strong> {user.lastname}</p>
        <p><strong>Prénom :</strong> {user.firstname}</p>
        <p><strong>Email :</strong> {user.email}</p>
        <p><strong>Promotion :</strong> {user.promotion}</p>
        <p><strong>Dernière connexion :</strong> {new Date(user.lastLogin).toLocaleString()}</p>
      </div>
    </section>
  );
}
