//db.js
let db = null;
const DB_NAME = "jokes_app_db";
const DB_VERSION = 1;
const JOKE_STORE_NAME = "jokes";
const SEARCH_STORE_NAME = "searches"

const dbReady = new Promise((resolve, reject) => {
  const request = indexedDB.open(DB_NAME, DB_VERSION);

  request.onerror = (error) => {
    console.error("IndexedDB error: ", error);
    reject(error);
  };

  request.onupgradeneeded = (event) => {
    db = event.target.result;
    if (!db.objectStoreNames.contains(JOKE_STORE_NAME)) {
      db.createObjectStore(JOKE_STORE_NAME, { keyPath: "id" });
    }
    if (!db.objectStoreNames.contains(SEARCH_STORE_NAME)) {
      db.createObjectStore(SEARCH_STORE_NAME, { keyPath: "term" });
    }
  };

  request.onsuccess = (event) => {
    db = event.target.result;
    resolve(db);
  };
});

const addJoke = (joke, searchTerm) => {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([JOKE_STORE_NAME], "readwrite");
        const store = transaction.objectStore(JOKE_STORE_NAME);

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
                console.error("Error saving joke: ", error);
                reject(error);
            }
        }

        getRequest.onerror = (error) => {
            console.error("Error checking joke: ", error);
            reject(error);
        }
    });
};

const getJokeById = (id) => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([JOKE_STORE_NAME], "readonly");
    const store = transaction.objectStore(JOKE_STORE_NAME);
    const request = store.get(id);

    request.onsuccess = () => resolve(request.result);
    request.onerror = (error) => {
      console.error("Error reading joke: ", error);
      reject(error);
    }
  });
}

const getAllJokes = () => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([JOKE_STORE_NAME], "readonly");
    const store = transaction.objectStore(JOKE_STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = (error) => {
      console.error("Error reading all jokes: ", error);
      reject(error);
    }
  });
}

const updateSearchTerm = (searchTermRecord) => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([SEARCH_STORE_NAME], "readwrite");
    const store = transaction.objectStore(SEARCH_STORE_NAME);

    const updateRequest = store.put({
      term: searchTermRecord.term, 
      page: searchTermRecord.page
    });

    updateRequest.onsuccess = () => resolve(true);
    updateRequest.onerror = (error) => {
        console.error("Error saving searchTermRecord: ", error);
        reject(error);
    }
  });
}

const getSearchTermRecord = (term) => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([SEARCH_STORE_NAME], "readonly");
    const store = transaction.objectStore(SEARCH_STORE_NAME);
    const request = store.get(term);

    request.onsuccess = () => resolve(request.result);
    request.onerror = (error) => {
      console.error("Error reading searchTermRecord: ", error);
      reject(error);
    }
  });
}