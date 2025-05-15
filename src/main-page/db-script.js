//db.js
let db = null;
const DB_NAME = 'jokes';
const DB_VERSION = 1;
const STORE_NAME = 'jokes';

const request = indexedDB.open(DB_NAME, DB_VERSION);

request.onerror = (error) => {
  console.error('IndexedDB error:', error);
}

request.onupgradeneeded = (event) => {
  db = event.target.result;
  if (!db.objectStoreNames.contains(STORE_NAME)) {
    db.createObjectStore(STORE_NAME, { keyPath: "id" });
  }
}

request.onsuccess = (event) => {
  db = event.target.result;
}

const addJoke = async (joke) => {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);

        const getRequest = store.get(joke.id);

        getRequest.onsuccess = () => {
            // Joke already exists
            if (getRequest.result) {
                resolve(false);
                return;
            }
            
            // Else add new joke
            const addRequest = store.add({
            id: joke.id, 
            joke: joke.joke, 
            insertDate: Date.now()
            });

            addRequest.onsuccess = () => resolve(true);
            addRequest.onerror = (error) => {
                console.error('Error adding joke', error);
                reject(error);
            }
        }

        getRequest.onerror = (error) => {
            console.error('Error checking joke', error);
            reject(error);
        }
    });
};

const getJokeById = (id) => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(id);

    request.onsuccess = () => resolve(request.result);
    request.onerror = (error) => {
      console.error('Error reading joke', error);
      reject(error);
    }
  });
}

const getAllJokes = () => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = (error) => {
      console.error('Error reading all jokes', error);
      reject(error);
    }
  });
}