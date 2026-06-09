import { 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy 
} from "firebase/firestore";
import { db } from "./firebase";
import { Game } from "./games";

const GAMES_COLLECTION = "games";

export async function getGamesFromFirestore(): Promise<Game[]> {
  const gamesRef = collection(db, GAMES_COLLECTION);
  const q = query(gamesRef, orderBy("title"));
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Game));
}

export async function addGameToFirestore(game: Omit<Game, "id">): Promise<string> {
  const docRef = await addDoc(collection(db, GAMES_COLLECTION), game);
  return docRef.id;
}

export async function updateGameInFirestore(id: string, game: Partial<Game>): Promise<void> {
  const gameRef = doc(db, GAMES_COLLECTION, id);
  await updateDoc(gameRef, game);
}

export async function deleteGameFromFirestore(id: string): Promise<void> {
  const gameRef = doc(db, GAMES_COLLECTION, id);
  await deleteDoc(gameRef);
}

export async function initializeDefaultGames(): Promise<void> {
  const existingGames = await getGamesFromFirestore();
  
  if (existingGames.length === 0) {
    const { defaultGames } = await import("./games");
    
    for (const game of defaultGames) {
      const { id, ...gameData } = game;
      await addDoc(collection(db, GAMES_COLLECTION), gameData);
    }
  }
}
