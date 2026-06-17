import { db, isFirebaseInitialized } from "./firebase";
import { Game } from "./games";

export const dynamic = 'force-dynamic';

const GAMES_COLLECTION = "games";

export async function getGamesFromFirestore(): Promise<Game[]> {
  if (!isFirebaseInitialized || !db) {
    console.warn("Firebase not initialized. Returning empty games list.");
    return [];
  }
  
  try {
    const { collection, query, orderBy, getDocs } = require("firebase/firestore");
    const gamesRef = collection(db, GAMES_COLLECTION);
    const q = query(gamesRef, orderBy("title"));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data()
    } as Game));
  } catch (error) {
    console.error("Error getting games from Firestore:", error);
    return [];
  }
}

export async function addGameToFirestore(game: Omit<Game, "id">): Promise<string> {
  if (!isFirebaseInitialized || !db) {
    throw new Error("Firebase not initialized. Cannot add game.");
  }
  try {
    const { collection, addDoc } = require("firebase/firestore");
    const docRef = await addDoc(collection(db, GAMES_COLLECTION), game);
    return docRef.id;
  } catch (error) {
    console.error("Error adding game to Firestore:", error);
    throw error;
  }
}

export async function updateGameInFirestore(id: string, game: Partial<Game>): Promise<void> {
  if (!isFirebaseInitialized || !db) {
    throw new Error("Firebase not initialized. Cannot update game.");
  }
  try {
    const { doc, updateDoc } = require("firebase/firestore");
    const gameRef = doc(db, GAMES_COLLECTION, id);
    await updateDoc(gameRef, game);
  } catch (error) {
    console.error("Error updating game in Firestore:", error);
    throw error;
  }
}

export async function deleteGameFromFirestore(id: string): Promise<void> {
  if (!isFirebaseInitialized || !db) {
    throw new Error("Firebase not initialized. Cannot delete game.");
  }
  try {
    const { doc, deleteDoc } = require("firebase/firestore");
    const gameRef = doc(db, GAMES_COLLECTION, id);
    await deleteDoc(gameRef);
  } catch (error) {
    console.error("Error deleting game from Firestore:", error);
    throw error;
  }
}

export function subscribeToGames(
  onUpdate: (games: Game[]) => void,
  onError?: (error: Error) => void
): any {
  if (!isFirebaseInitialized || !db) {
    console.warn("Firebase not initialized. Returning empty games list.");
    onUpdate([]);
    return () => {}; // Return empty unsubscribe function
  }
  
  try {
    const { collection, query, orderBy, onSnapshot } = require("firebase/firestore");
    const gamesRef = collection(db, GAMES_COLLECTION);
    const q = query(gamesRef, orderBy("title"));
    
    return onSnapshot(
      q,
      (snapshot: any) => {
        const games = snapshot.docs.map((doc: any) => ({
          id: doc.id,
          ...doc.data()
        } as Game));
        onUpdate(games);
      },
      (error: any) => {
        console.error("Error listening to games:", error);
        if (onError) onError(error);
      }
    );
  } catch (error) {
    console.error("Error subscribing to games:", error);
    if (onError) onError(error as Error);
    return () => {};
  }
}
