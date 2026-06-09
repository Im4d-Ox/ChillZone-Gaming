"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Game } from "@/lib/games";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/sections/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { isAdminUser, ADMIN_EMAIL } from "@/lib/firebase";
import { 
  getGamesFromFirestore, 
  addGameToFirestore, 
  updateGameInFirestore, 
  deleteGameFromFirestore,
  initializeDefaultGames 
} from "@/lib/firestore";

export default function AdminDashboard() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(true);
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGame, setEditingGame] = useState<Game | null>(null);
  const [formData, setFormData] = useState<Partial<Game>>({});

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!authLoading) {
        if (!user) {
          router.push("/");
          return;
        }

        const adminStatus = await isAdminUser(user);
        setIsAdmin(adminStatus);
        setCheckingAdmin(false);

        if (adminStatus) {
          loadGames();
        } else {
          router.push("/");
        }
      }
    };

    checkAdminStatus();
  }, [user, authLoading, router]);

  const loadGames = async () => {
    try {
      setLoading(true);
      await initializeDefaultGames();
      const gamesData = await getGamesFromFirestore();
      setGames(gamesData);
    } catch (error) {
      console.error("Error loading games:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveGame = async () => {
    if (!formData.title || !formData.price || !formData.category) {
      alert("Please fill in required fields");
      return;
    }

    try {
      if (editingGame) {
        await updateGameInFirestore(editingGame.id, formData);
      } else {
        const newId = await addGameToFirestore(formData as Omit<Game, "id">);
        formData.id = newId;
      }
      await loadGames();
      setIsModalOpen(false);
      setEditingGame(null);
      setFormData({});
    } catch (error) {
      console.error("Error saving game:", error);
      alert("Error saving game");
    }
  };

  const handleEditGame = (game: Game) => {
    setEditingGame(game);
    setFormData(game);
    setIsModalOpen(true);
  };

  const handleDeleteGame = async (gameId: string) => {
    if (confirm("Are you sure you want to delete this game?")) {
      try {
        await deleteGameFromFirestore(gameId);
        await loadGames();
      } catch (error) {
        console.error("Error deleting game:", error);
        alert("Error deleting game");
      }
    }
  };

  const handleAddNew = () => {
    setEditingGame(null);
    setFormData({});
    setIsModalOpen(true);
  };

  if (authLoading || checkingAdmin) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-zinc-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Access Denied</h1>
          <p className="text-zinc-400 mb-6">You don't have permission to access this page.</p>
          <a
            href="/"
            className="px-6 py-3 bg-accent hover:bg-accent/90 text-black font-semibold rounded-lg transition-colors inline-block"
          >
            Return to Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar cartCount={0} onCartClick={() => {}} />
      
      <main className="container mx-auto px-6 py-12 md:px-10">
        <div className="mb-12 flex flex-col md:flex-row md:justify-between md:items-start gap-6">
          <div>
            <h1 className="text-5xl font-bold mb-3 tracking-tight">Admin Dashboard</h1>
            <p className="text-zinc-400 text-lg">Manage your games inventory</p>
          </div>
          <div className="flex gap-4">
            <a
              href="/"
              className="px-6 py-3 border border-white/15 bg-white/[0.05] hover:bg-white/[0.1] rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              ← Back to Home
            </a>
          </div>
        </div>

        <div className="mb-8">
          <button
            onClick={handleAddNew}
            className="px-6 py-3 bg-accent hover:bg-accent/90 text-black font-semibold rounded-lg transition-colors"
          >
            + Add New Game
          </button>
        </div>

        <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-zinc-800/50 border-b border-white/10">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-zinc-300">Image</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-zinc-300">Title</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-zinc-300">Category</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-zinc-300">Price</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-zinc-300">Rating</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-zinc-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {games.map((game) => (
                <tr key={game.id} className="hover:bg-zinc-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <img
                      src={game.image}
                      alt={game.title}
                      className="w-16 h-12 object-cover rounded"
                    />
                  </td>
                  <td className="px-6 py-4 font-medium">{game.title}</td>
                  <td className="px-6 py-4 text-zinc-400">{game.category}</td>
                  <td className="px-6 py-4">
                    ${game.price}
                    {game.discount && (
                      <span className="ml-2 text-green-400 text-sm">
                        -{game.discount}%
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-yellow-400">{game.rating} ★</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleEditGame(game)}
                      className="px-4 py-2 bg-blue-600/90 hover:bg-blue-600 rounded text-sm mr-2 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteGame(game.id)}
                      className="px-4 py-2 bg-red-600/90 hover:bg-red-600 rounded text-sm transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8">
              <h2 className="text-3xl font-bold mb-6">
                {editingGame ? "Edit Game" : "Add New Game"}
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-2 text-zinc-300">Title *</label>
                  <input
                    type="text"
                    value={formData.title || ""}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 bg-zinc-800/50 border border-white/10 rounded-lg focus:outline-none focus:border-accent transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-zinc-300">Developer</label>
                  <input
                    type="text"
                    value={formData.developer || ""}
                    onChange={(e) => setFormData({ ...formData, developer: e.target.value })}
                    className="w-full px-4 py-3 bg-zinc-800/50 border border-white/10 rounded-lg focus:outline-none focus:border-accent transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-zinc-300">Category *</label>
                  <select
                    value={formData.category || ""}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 bg-zinc-800/50 border border-white/10 rounded-lg focus:outline-none focus:border-accent transition-colors"
                  >
                    <option value="">Select category</option>
                    <option value="Action">Action</option>
                    <option value="Adventure">Adventure</option>
                    <option value="RPG">RPG</option>
                    <option value="Strategy">Strategy</option>
                    <option value="Sports">Sports</option>
                    <option value="Racing">Racing</option>
                    <option value="Puzzle">Puzzle</option>
                    <option value="Sci-Fi">Sci-Fi</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-zinc-300">Price *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price || ""}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                    className="w-full px-4 py-3 bg-zinc-800/50 border border-white/10 rounded-lg focus:outline-none focus:border-accent transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-zinc-300">Original Price</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.originalPrice || ""}
                    onChange={(e) => setFormData({ ...formData, originalPrice: parseFloat(e.target.value) })}
                    className="w-full px-4 py-3 bg-zinc-800/50 border border-white/10 rounded-lg focus:outline-none focus:border-accent transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-zinc-300">Discount (%)</label>
                  <input
                    type="number"
                    value={formData.discount || ""}
                    onChange={(e) => setFormData({ ...formData, discount: parseFloat(e.target.value) })}
                    className="w-full px-4 py-3 bg-zinc-800/50 border border-white/10 rounded-lg focus:outline-none focus:border-accent transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-zinc-300">Rating</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={formData.rating || ""}
                    onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) })}
                    className="w-full px-4 py-3 bg-zinc-800/50 border border-white/10 rounded-lg focus:outline-none focus:border-accent transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-zinc-300">Release Date</label>
                  <input
                    type="date"
                    value={formData.releaseDate || ""}
                    onChange={(e) => setFormData({ ...formData, releaseDate: e.target.value })}
                    className="w-full px-4 py-3 bg-zinc-800/50 border border-white/10 rounded-lg focus:outline-none focus:border-accent transition-colors"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-2 text-zinc-300">Image URL</label>
                  <input
                    type="url"
                    value={formData.image || ""}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full px-4 py-3 bg-zinc-800/50 border border-white/10 rounded-lg focus:outline-none focus:border-accent transition-colors"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-2 text-zinc-300">Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={formData.tags?.join(", ") || ""}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value.split(", ").map(t => t.trim()) })}
                    className="w-full px-4 py-3 bg-zinc-800/50 border border-white/10 rounded-lg focus:outline-none focus:border-accent transition-colors"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-2 text-zinc-300">Description</label>
                  <textarea
                    value={formData.description || ""}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 bg-zinc-800/50 border border-white/10 rounded-lg focus:outline-none focus:border-accent transition-colors"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 border border-white/15 bg-white/[0.05] hover:bg-white/[0.1] rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveGame}
                  className="px-6 py-3 bg-accent hover:bg-accent/90 text-black font-semibold rounded-lg transition-colors"
                >
                  {editingGame ? "Update Game" : "Add Game"}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
