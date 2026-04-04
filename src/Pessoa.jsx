import { useAuth0 } from "@auth0/auth0-react";
import React, { useEffect, useState } from "react";
import LoginButton from "./LoginButton";
import LogoutButton from "./LogoutButton";

const BASE_URL = "http://18.228.48.67:8080";


export default function PessoasApp() {
  const [pessoas, setPessoas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [token, setToken] = useState("")

  const {
    user,
    isAuthenticated,
    getAccessTokenSilently
  } = useAuth0();

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const accessToken = await getAccessTokenSilently();
        console.log(accessToken)
        setToken(accessToken);
      } catch (e) {
        console.error('Erro ao buscar token:', e);
      }
    };

    if (isAuthenticated) {
      fetchToken();
    }
  }, [isAuthenticated, getAccessTokenSilently]);


  if (!isAuthenticated) {
    return <LoginButton />;
  }

  async function fetchConnections() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BASE_URL}/connections/c579b481-c395-4498-bf19-6f2247e0b80d`,{
        headers: {
          // Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error(`Erro ao carregar: ${res.status}`);
      const data = await res.json();
      setPessoas(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50 font-sans">

      <div>
        <img src={user.picture} alt={user.name} />
        <h2>{user.name}</h2>
        <p>{user.email}</p>
        <LogoutButton />
      </div>


      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow p-6">
        <h1 className="text-2xl font-bold mb-4">Conexões</h1>

        {error && <div className="mb-4 text-red-600">{error}</div>}

        <div>
          <h2 className="text-xl font-semibold mb-2">Lista de Pessoas</h2>

          <button onClick={fetchConnections}>
            Carregar
          </button>
          {loading ? (
            <div>Carregando...</div>
          ) : pessoas.length === 0 ? (
            <div>Nenhuma conexão encontrada.</div>
          ) : (
            <ul className="space-y-3">
              {pessoas.map((s) => (
                <li key={s.id} className="p-3 border rounded">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-semibold">{s.fromUserId}</div>
                      {s.email && <div className="text-sm text-gray-600">{s.email}</div>}
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{s.toUserId ?? "-"}</div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

    </div>
  );
}