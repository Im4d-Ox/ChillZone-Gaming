import { 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy,
  onSnapshot,
  Unsubscribe
} from "firebase/firestore";
import { db, isFirebaseInitialized } from "./firebase";
import { Game } from "./games";

const GAMES_COLLECTION = "games";

export async function getGamesFromFirestore(): Promise<Game[]> {
  if (!isFirebaseInitialized || !db) {
    console.warn("Firebase not initialized. Returning empty games list.");
    return [];
  }
  
  const gamesRef = collection(db, GAMES_COLLECTION);
  const q = query(gamesRef, orderBy("title"));
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Game));
}

export async function addGameToFirestore(game: Omit<Game, "id">): Promise<string> {
  if (!isFirebaseInitialized || !db) {
    throw new Error("Firebase not initialized. Cannot add game.");
  }
  const docRef = await addDoc(collection(db, GAMES_COLLECTION), game);
  return docRef.id;
}

export async function updateGameInFirestore(id: string, game: Partial<Game>): Promise<void> {
  if (!isFirebaseInitialized || !db) {
    throw new Error("Firebase not initialized. Cannot update game.");
  }
  const gameRef = doc(db, GAMES_COLLECTION, id);
  await updateDoc(gameRef, game);
}

export async function deleteGameFromFirestore(id: string): Promise<void> {
  if (!isFirebaseInitialized || !db) {
    throw new Error("Firebase not initialized. Cannot delete game.");
  }
  const gameRef = doc(db, GAMES_COLLECTION, id);
  await deleteDoc(gameRef);
}

export function subscribeToGames(
  onUpdate: (games: Game[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  if (!isFirebaseInitialized || !db) {
    console.warn("Firebase not initialized. Returning empty games list.");
    onUpdate([]);
    return () => {}; // Return empty unsubscribe function
  }
  
  const gamesRef = collection(db, GAMES_COLLECTION);
  const q = query(gamesRef, orderBy("title"));
  
  return onSnapshot(
    q,
    (snapshot) => {
      const games = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Game));
      onUpdate(games);
    },
    (error) => {
      console.error("Error listening to games:", error);
      if (onError) onError(error);
    }
  );
}
