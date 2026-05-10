import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiUrl } from "../apiBase";

const TOKEN_KEY = "wedding_admin_token";

function authHeaders(token) {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

const AdminPanel = () => {
  const [token, setToken] = useState(() => sessionStorage.getItem(TOKEN_KEY));
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState(null);
  const [loggingIn, setLoggingIn] = useState(false);

  const [messages, setMessages] = useState([]);
  const [listLoading, setListLoading] = useState(false);
  const [listError, setListError] = useState(null);

  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editMessage, setEditMessage] = useState("");
  const [savingId, setSavingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const loadMessages = useCallback(async () => {
    setListLoading(true);
    setListError(null);
    try {
      const res = await fetch(apiUrl("/api/messages"));
      if (!res.ok) throw new Error();
      const data = await res.json();
      setMessages(Array.isArray(data) ? data : []);
    } catch {
      setListError("Mesajlar yüklənmədi.");
      setMessages([]);
    } finally {
      setListLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token) loadMessages();
  }, [token, loadMessages]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError(null);
    setLoggingIn(true);
    try {
      const res = await fetch(apiUrl("/api/admin/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.token) {
        throw new Error(data.error || "login failed");
      }
      sessionStorage.setItem(TOKEN_KEY, data.token);
      setToken(data.token);
      setPassword("");
    } catch {
      setLoginError("İstifadəçi adı və ya şifrə yanlışdır.");
    } finally {
      setLoggingIn(false);
    }
  };

  const logout = () => {
    sessionStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setMessages([]);
    setEditingId(null);
  };

  const startEdit = (row) => {
    setEditingId(row.id);
    setEditName(row.name);
    setEditMessage(row.message);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setEditMessage("");
  };

  const saveEdit = async () => {
    if (!token || editingId == null) return;
    const name = editName.trim();
    const message = editMessage.trim();
    if (!name || !message) return;
    setSavingId(editingId);
    setListError(null);
    try {
      const res = await fetch(apiUrl(`/api/admin/messages/${editingId}`), {
        method: "PUT",
        headers: authHeaders(token),
        body: JSON.stringify({ name, message }),
      });
      if (res.status === 401) {
        logout();
        setLoginError("Sessiya bitdi — yenidən daxil olun.");
        return;
      }
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "save failed");
      setMessages((prev) =>
        prev.map((m) => (m.id === editingId ? data : m)).sort((a, b) => b.id - a.id)
      );
      cancelEdit();
    } catch {
      setListError("Yadda saxlanılmadı.");
    } finally {
      setSavingId(null);
    }
  };

  const remove = async (id) => {
    if (!token || !window.confirm("Bu təbriki silmək istəyirsiniz?")) return;
    setDeletingId(id);
    setListError(null);
    try {
      const res = await fetch(apiUrl(`/api/admin/messages/${id}`), {
        method: "DELETE",
        headers: authHeaders(token),
      });
      if (res.status === 401) {
        logout();
        setLoginError("Sessiya bitdi — yenidən daxil olun.");
        return;
      }
      if (!res.ok && res.status !== 204) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "delete failed");
      }
      setMessages((prev) => prev.filter((m) => m.id !== id));
      if (editingId === id) cancelEdit();
    } catch {
      setListError("Silinmədi.");
    } finally {
      setDeletingId(null);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-[#f4f2ef] flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
          <h1
            className="text-center text-[#2c2418] mb-6"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(24px, 4vw, 32px)",
              fontWeight: 400,
            }}
          >
            Admin
          </h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label
                htmlFor="admin-user"
                className="block text-sm text-[#5c554d] mb-1"
              >
                İstifadəçi adı
              </label>
              <input
                id="admin-user"
                type="text"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-md border border-gray-200 px-3 py-2 text-[#2a2622] focus:border-[#958c83] focus:outline-none focus:ring-1 focus:ring-[#958c83]"
              />
            </div>
            <div>
              <label
                htmlFor="admin-pass"
                className="block text-sm text-[#5c554d] mb-1"
              >
                Şifrə
              </label>
              <input
                id="admin-pass"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md border border-gray-200 px-3 py-2 text-[#2a2622] focus:border-[#958c83] focus:outline-none focus:ring-1 focus:ring-[#958c83]"
              />
            </div>
            {loginError && (
              <p className="text-sm text-red-700">{loginError}</p>
            )}
            <button
              type="submit"
              disabled={loggingIn}
              className="w-full rounded-md bg-[#2c2418] py-2.5 text-sm font-medium text-[#faf7f4] hover:bg-[#3d3428] disabled:opacity-50"
            >
              {loggingIn ? "…" : "Daxil ol"}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-[#958c83]">
            <Link to="/" className="underline hover:text-[#2c2418]">
              Ana səhifəyə qayıt
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f2ef] text-[#2a2622]">
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-3">
          <h1
            className="text-[#2c2418]"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(22px, 3vw, 28px)",
              fontWeight: 400,
            }}
          >
            Təbriklər — idarəetmə
          </h1>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => loadMessages()}
              className="text-sm text-[#5c554d] underline hover:text-[#2c2418]"
            >
              Yenilə
            </button>
            <button
              type="button"
              onClick={logout}
              className="text-sm rounded-md border border-gray-300 px-3 py-1.5 hover:bg-gray-50"
            >
              Çıxış
            </button>
            <Link
              to="/"
              className="text-sm rounded-md bg-[#2c2418] px-3 py-1.5 text-[#faf7f4] hover:bg-[#3d3428]"
            >
              Sayt
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {listError && (
          <p className="mb-4 text-sm text-red-700">{listError}</p>
        )}
        {listLoading ? (
          <p className="text-[#958c83]">Yüklənir…</p>
        ) : (
          <ul className="space-y-4">
            {messages.map((row) => (
              <li
                key={row.id}
                className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
              >
                {editingId === row.id ? (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-[#5c554d] mb-1">
                        Ad
                      </label>
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        maxLength={120}
                        className="w-full rounded border border-gray-200 px-3 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-[#5c554d] mb-1">
                        Mesaj
                      </label>
                      <textarea
                        value={editMessage}
                        onChange={(e) => setEditMessage(e.target.value)}
                        rows={5}
                        maxLength={4000}
                        className="w-full rounded border border-gray-200 px-3 py-2 text-sm resize-y min-h-[120px]"
                      />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={saveEdit}
                        disabled={
                          savingId === row.id ||
                          !editName.trim() ||
                          !editMessage.trim()
                        }
                        className="rounded-md bg-[#2c2418] px-4 py-2 text-sm text-[#faf7f4] disabled:opacity-50"
                      >
                        {savingId === row.id ? "Saxlanır…" : "Saxla"}
                      </button>
                      <button
                        type="button"
                        onClick={cancelEdit}
                        disabled={savingId === row.id}
                        className="rounded-md border border-gray-300 px-4 py-2 text-sm"
                      >
                        Ləğv et
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-[#2a2622]">
                          {row.name}
                        </p>
                        <p className="text-xs text-[#958c83] mt-1">
                          #{row.id} · {row.created_at}
                        </p>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => startEdit(row)}
                          className="text-sm text-[#5c554d] underline hover:text-[#2c2418]"
                        >
                          Redaktə
                        </button>
                        <button
                          type="button"
                          onClick={() => remove(row.id)}
                          disabled={deletingId === row.id}
                          className="text-sm text-red-700 underline hover:text-red-900 disabled:opacity-50"
                        >
                          {deletingId === row.id ? "…" : "Sil"}
                        </button>
                      </div>
                    </div>
                    <p className="mt-3 text-sm text-[#5c554d] whitespace-pre-wrap break-words">
                      {row.message}
                    </p>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
        {!listLoading && messages.length === 0 && !listError && (
          <p className="text-[#958c83]">Hələ təbrik yoxdur.</p>
        )}
      </main>
    </div>
  );
};

export default AdminPanel;
