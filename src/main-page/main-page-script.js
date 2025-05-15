document.getElementById("joke-searcher").addEventListener("submit", (e) => {
    e.preventDefault();
});

const container = document.getElementById("output");

const getMyJoke = async () => {
    const searchTerm = document.getElementById("term-input").value;

    let searchTermRecord = await getSearchTermRecord(searchTerm);
    if (searchTermRecord === undefined)
        searchTermRecord = { term: searchTerm, page: 1 };
    console.log(searchTermRecord);

    try {
        data = await fetchJokes(searchTerm, searchTermRecord.page);
    }
    catch (error) {
        presentError(error);
        return;
    }

    for (const joke of data.results) {
        const savedJoke = await getJokeById(joke.id);
        if (!savedJoke) {
            if (searchTerm)
                underlineSearchTerm(joke, searchTerm);
            addJoke(joke);
            presentJoke(joke.joke);
            return;
        }
    }
    if (data.current_page < data.next_page) {
        ++searchTermRecord.page
        await updateSearchTerm(searchTermRecord);
        getMyJoke();
        return;
    }

    presentWarn("Run out of jokes with this phrase!");
}

const fetchJokes = async (searchTerm, page) => {
    const response = await fetch(`https://icanhazdadjoke.com/search?term=${searchTerm}&page=${page}`, {
        headers: {
            "Accept": "application/json",
        },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(`HTTP error! ${await data.message}`);
    }
    return data;
}

const underlineSearchTerm = (joke, searchTerm) => {
    joke.joke = joke.joke.replace(searchTerm, `<u>${searchTerm}</u>`);
}

const presentJoke = (joke) => {
    container.innerHTML = joke;
    container.style.color = "green";
}

const presentError = (error) => {
    console.log(JSON.stringify(error));
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