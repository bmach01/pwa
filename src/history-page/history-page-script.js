const jokesList = document.getElementById("jokes-list");

const itemColors = ["#e7826d", "#37c543", "#45c0eb"];
let itemColorIndex = -1;

const goToMainPage = () => {
    window.location.href = "/main-page/main-page.html";
}

const loadAllJokes = async () => {
    try {
        await dbReady;
        const jokes = await getAllJokes();
        
        if (jokes.length <= 0) {
            console.log("No jokes found");
            return;
        }
        jokes.sort((a, b) => b.insertDate - a.insertDate);

        jokesList.innerHTML = jokes.map(formatJoke).join('');
    } catch (error) {
        console.error("Error loading jokes:", error);
    }
}

const getItemColor = () => {
    itemColorIndex = (itemColorIndex + 1) % itemColors.length;
    return itemColors[itemColorIndex];
}

const formatJoke = (jokeRecord) => {
    const color = getItemColor();
    const jokeDate = new Date(jokeRecord.insertDate);
    const now = new Date();
    
    let dateText;
    if (jokeDate.toDateString() === now.toDateString()) {
        // (HH:MM)
        dateText = `${String(jokeDate.getHours()).padStart(2, '0')}:${String(jokeDate.getMinutes()).padStart(2, '0')}`;
    } else if (jokeDate.getFullYear() === now.getFullYear()) {
        // (DD.MM)
        dateText = `${String(jokeDate.getDate()).padStart(2, '0')}.${String(jokeDate.getMonth() + 1).padStart(2, '0')}`;
    } else {
        // (DD.MM.YYYY)
        dateText = `${String(jokeDate.getDate()).padStart(2, '0')}.${String(jokeDate.getMonth() + 1).padStart(2, '0')}.${jokeDate.getFullYear()}`;
    }
    
    return `<li>${dateText}<span style="color: ${color}">${jokeRecord.joke}</span></li>`;
};
document.addEventListener("DOMContentLoaded", loadAllJokes);