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
  deleteGameFromFirestore
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
  const [activeTab, setActiveTab] = useState<"games" | "frames" | "logs">("games");
  const [logs, setLogs] = useState<Array<{ action: string; timestamp: string; details: string }>>([]);
  const [framesFolders, setFramesFolders] = useState<Array<{ name: string; position: "none" | "first" | "second" }>>([
    { name: "frames", position: "second" },
    { name: "frames2", position: "first" }
  ]);
  const [newFolderName, setNewFolderName] = useState("");

  useEffect(() => {
    const savedFolders = localStorage.getItem("framesFoldersOrder");
    if (savedFolders) {
      try {
        const parsed = JSON.parse(savedFolders);
        setFramesFolders(parsed);
      } catch (error) {
        console.error("Error loading frames folders:", error);
      }
    }
  }, []);

  const handlePositionChange = (folderName: string, newPosition: "none" | "first" | "second") => {
    setFramesFolders(prev => {
      // If setting to first or second, clear that position from other folders
      const updated: Array<{ name: string; position: "none" | "first" | "second" }> = prev.map(folder => {
        if (folder.name === folderName) {
          return { ...folder, position: newPosition };
        }
        if (newPosition !== "none" && folder.position === newPosition) {
          return { ...folder, position: "none" };
        }
        return folder;
      });
      localStorage.setItem("framesFoldersOrder", JSON.stringify(updated));
      addLog("Frames Position Changed", `Changed ${folderName} position to ${newPosition}`);
      return updated;
    });
  };

  const handleAddFolder = () => {
    if (newFolderName.trim() && !framesFolders.find(f => f.name === newFolderName.trim())) {
      setFramesFolders(prev => {
        const updated: Array<{ name: string; position: "none" | "first" | "second" }> = [...prev, { name: newFolderName.trim(), position: "none" }];
        localStorage.setItem("framesFoldersOrder", JSON.stringify(updated));
        addLog("Folder Added", `Added new folder: ${newFolderName.trim()}`);
        return updated;
      });
      setNewFolderName("");
    }
  };

  const handleRemoveFolder = (folderName: string) => {
    setFramesFolders(prev => {
      const updated = prev.filter(f => f.name !== folderName);
      localStorage.setItem("framesFoldersOrder", JSON.stringify(updated));
      addLog("Folder Removed", `Removed folder: ${folderName}`);
      return updated;
    });
  };

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
      const gamesData = await getGamesFromFirestore();
      setGames(gamesData);
    } catch (error) {
      console.error("Error loading games:", error);
    } finally {
      setLoading(false);
    }
  };

  const addLog = (action: string, details: string) => {
    const newLog = {
      action,
      timestamp: new Date().toLocaleString(),
      details
    };
    setLogs(prev => [newLog, ...prev].slice(0, 50));
  };

  const handleSaveGame = async () => {
    if (!formData.title || !formData.price || !formData.category) {
      alert("Please fill in required fields");
      return;
    }

    try {
      if (editingGame) {
        await updateGameInFirestore(editingGame.id, formData);
        addLog("Game Updated", `Updated game: ${formData.title}`);
      } else {
        const newId = await addGameToFirestore(formData as Omit<Game, "id">);
        formData.id = newId;
        addLog("Game Created", `Created new game: ${formData.title}`);
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
    addLog("Game Edit Started", `Editing game: ${game.title}`);
  };

  const handleDeleteGame = async (gameId: string) => {
    const game = games.find(g => g.id === gameId);
    if (confirm("Are you sure you want to delete this game?")) {
      try {
        await deleteGameFromFirestore(gameId);
        addLog("Game Deleted", `Deleted game: ${game?.title}`);
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
      <Navbar />
      
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
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setActiveTab("games")}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                activeTab === "games"
                  ? "bg-accent text-black"
                  : "bg-white/[0.05] text-zinc-400 hover:bg-white/[0.1]"
              }`}
            >
              Games
            </button>
            <button
              onClick={() => setActiveTab("frames")}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                activeTab === "frames"
                  ? "bg-accent text-black"
                  : "bg-white/[0.05] text-zinc-400 hover:bg-white/[0.1]"
              }`}
            >
              Frames
            </button>
            <button
              onClick={() => setActiveTab("logs")}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                activeTab === "logs"
                  ? "bg-accent text-black"
                  : "bg-white/[0.05] text-zinc-400 hover:bg-white/[0.1]"
              }`}
            >
              Activity Logs
            </button>
          </div>

          {activeTab === "games" && (
            <button
              onClick={handleAddNew}
              className="px-6 py-3 bg-accent hover:bg-accent/90 text-black font-semibold rounded-lg transition-colors"
            >
              + Add New Game
            </button>
          )}
        </div>

        {activeTab === "games" && (
          <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-zinc-800/50 border-b border-white/10">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-zinc-300">Image</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-zinc-300">Title</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-zinc-300">Category</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-zinc-300">Price</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-zinc-300">Rating</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-zinc-300">Status</th>
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
                      onClick={() => {
                        const newStatus = game.status === "live" ? "hidden" : "live";
                        updateGameInFirestore(game.id, { status: newStatus });
                        addLog("Status Changed", `${game.title} status changed to ${newStatus}`);
                        loadGames();
                      }}
                      className={`px-3 py-1 rounded text-sm font-medium ${
                        game.status === "live"
                          ? "bg-green-600/90 hover:bg-green-600 text-white"
                          : "bg-gray-600/90 hover:bg-gray-600 text-white"
                      }`}
                    >
                      {game.status === "live" ? "Live" : "Hidden"}
                    </button>
                  </td>
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
        )}

        {activeTab === "frames" && (
          <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Frame Management</h2>
            <p className="text-zinc-400 mb-6">Manage cinematic frames for the website. Add folders and set their position (none, first, or second).</p>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Add New Folder</h3>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="Enter folder name (e.g., frames3)"
                  className="flex-1 px-4 py-3 bg-zinc-800/50 border border-white/10 rounded-lg focus:outline-none focus:border-accent transition-colors"
                />
                <button
                  onClick={handleAddFolder}
                  className="px-6 py-3 bg-accent hover:bg-accent/90 text-black font-semibold rounded-lg transition-colors"
                >
                  Add Folder
                </button>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Frames Folders</h3>
              {framesFolders.map((folder) => (
                <div key={folder.name} className="bg-zinc-800/50 rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold ${
                      folder.position === "first" ? "bg-accent text-black" :
                      folder.position === "second" ? "bg-blue-500 text-white" :
                      "bg-zinc-600 text-zinc-300"
                    }`}>
                      {folder.position === "first" ? "1st" : 
                       folder.position === "second" ? "2nd" : "—"}
                    </div>
                    <div>
                      <div className="font-semibold text-white">{folder.name}</div>
                      <div className="text-sm text-zinc-400">
                        {folder.position === "none" ? "Not in use" : 
                         folder.position === "first" ? "First position" : "Second position"}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={folder.position}
                      onChange={(e) => handlePositionChange(folder.name, e.target.value as "none" | "first" | "second")}
                      className="px-3 py-1 bg-zinc-700/50 border border-white/10 rounded text-sm focus:outline-none focus:border-accent transition-colors"
                    >
                      <option value="none">None</option>
                      <option value="first">First</option>
                      <option value="second">Second</option>
                    </select>
                    <button
                      onClick={() => handleRemoveFolder(folder.name)}
                      className="px-3 py-1 bg-red-600/90 hover:bg-red-600 rounded text-sm transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-white/10">
              <h3 className="text-lg font-semibold mb-3">Actions</h3>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    addLog("Frames Refreshed", "Frame configuration refreshed");
                    alert("Frames configuration refreshed");
                  }}
                  className="px-4 py-3 bg-accent hover:bg-accent/90 text-black font-semibold rounded-lg transition-colors"
                >
                  Refresh Frames
                </button>
                <button
                  onClick={() => {
                    setFramesFolders([
                      { name: "frames", position: "second" },
                      { name: "frames2", position: "first" }
                    ]);
                    localStorage.setItem("framesFoldersOrder", JSON.stringify([
                      { name: "frames", position: "second" },
                      { name: "frames2", position: "first" }
                    ]));
                    addLog("Frames Reset", "Reset to default frames configuration");
                    alert("Reset to default frames configuration");
                  }}
                  className="px-4 py-3 border border-white/15 bg-white/[0.05] hover:bg-white/[0.1] rounded-lg font-medium transition-colors"
                >
                  Reset to Default
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "logs" && (
          <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Activity Logs</h2>
            
            <div className="space-y-3">
              {logs.length === 0 ? (
                <p className="text-zinc-400">No activity logs yet.</p>
              ) : (
                logs.map((log, index) => (
                  <div key={index} className="bg-zinc-800/50 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-semibold text-accent">{log.action}</span>
                      <span className="text-xs text-zinc-500">{log.timestamp}</span>
                    </div>
                    <p className="text-zinc-400 text-sm">{log.details}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

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

                <div>
                  <label className="block text-sm font-medium mb-2 text-zinc-300">Status</label>
                  <select
                    value={formData.status || "live"}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as "live" | "hidden" })}
                    className="w-full px-4 py-3 bg-zinc-800/50 border border-white/10 rounded-lg focus:outline-none focus:border-accent transition-colors"
                  >
                    <option value="live">Live</option>
                    <option value="hidden">Hidden</option>
                  </select>
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
