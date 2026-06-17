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

export function subscribeToGames(
  onUpdate: (games: Game[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
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
