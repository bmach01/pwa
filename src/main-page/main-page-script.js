document.getElementById("joke-searcher").addEventListener('submit', (e) => {
    e.preventDefault();
});

const set = new Set();
let lastSearchTerm = null;
let cachedFetch = null;
const container = document.getElementById("output");

const getMyJoke = async () => {
    const searchTerm = document.getElementById("term-input").value;
    let data = null;

    if (lastSearchTerm === searchTerm) {
        data = cachedFetch;
    }
    else {
        try {
            data = await fetchJokes(searchTerm);
            cachedFetch = data;
        }
        catch (error) {
            presentError(error);
        }
    }

    for (const joke of data.results) {
        if (!set.has(joke.id)) {
            presentJoke(joke.joke);
            set.add(joke.id);
            addJoke(joke);
            return;
        }
    }
    presentWarn("Run out of jokes with this phrase!")
}

const fetchJokes = async (searchTerm) => {
    const response = await fetch(`https://icanhazdadjoke.com/search?term=${searchTerm}`, {
        headers: {
        'Accept': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response}`);
    }
    return response.json();
}

const presentJoke = (joke) => {
    container.innerText = joke;
    container.style.color = "green";
}

const presentError = (error) => {
    container.innerText = error;
    container.style.color = "red";
}

const presentWarn = (warn) => {
    container.innerText = warn;
    container.style.color = "orange";
}

const goToHistoryPage = () => {
    window.location.href = "/history-page/history-page.html";
}