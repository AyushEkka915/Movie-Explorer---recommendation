const API_KEY = "56630d3e"; // use OMDb API key
const moviesContainer = document.querySelector(".movies-container");
const searchBtn = document.getElementById("searchBtn");
const movieInput = document.getElementById("movieInput");
const errorMsg = document.getElementById("errorMsg");

let currentPage = 1;
let currentQuery = "stranger";
let isLoading = false;

/* ---------------- FETCH MOVIES ---------------- */
async function fetchMovies(query, page) {
    isLoading = true;

    try {
        const response = await fetch(
            `https://www.omdbapi.com/?apikey=${API_KEY}&s=${query}&page=${page}`
        );

        const data = await response.json();

        if (data.Response === "True") {
            errorMsg.style.display = "none";
            displayMovies(data.Search);
        } else {
            if (page === 1) {
                moviesContainer.innerHTML = "";
                errorMsg.style.display = "block";
            }
        }
    } catch (error) {
        console.error("Error fetching movies:", error);
    }

    isLoading = false;
}

/* ---------------- DISPLAY MOVIES ---------------- */
async function displayMovies(movies) {
    for (const movie of movies) {
        const rating = await getMovieRating(movie.imdbID);

        const card = document.createElement("div");
        card.className = "movie-card";

        card.innerHTML = `
            <img class="movie-poster"
                 src="${movie.Poster !== "N/A" ? movie.Poster : 'https://via.placeholder.com/300x450'}"
                 alt="${movie.Title}">

            <div class="movie-info">
                <h3 class="movie-title">
                    ${movie.Title}
                    <span class="rating-badge">⭐ ${rating}</span>
                </h3>

                <div class="movie-meta">
                    <span>${movie.Year}</span>
                </div>
            </div>
        `;

        // Open IMDb on click
        card.addEventListener("click", () => {
            window.open(`https://www.imdb.com/title/${movie.imdbID}`, "_blank");
        });

        moviesContainer.appendChild(card);
    }
}

async function getMovieRating(imdbID) {
    try {
        const response = await fetch(
            `https://www.omdbapi.com/?apikey=${API_KEY}&i=${imdbID}`
        );
        const data = await response.json();
        return data.imdbRating !== "N/A" ? data.imdbRating : "NA";
    } catch {
        return "NA";
    }
}


/* ---------------- SEARCH BUTTON ---------------- */
searchBtn.addEventListener("click", () => {
    const query = movieInput.value.trim();

    if (!query) return;

    currentQuery = query;
    currentPage = 1;
    moviesContainer.innerHTML = "";

    fetchMovies(currentQuery, currentPage);
});

/* ---------------- INFINITE SCROLL ---------------- */
window.addEventListener("scroll", () => {
    const nearBottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 200;

    if (nearBottom && !isLoading) {
        currentPage++;
        fetchMovies(currentQuery, currentPage);
    }
});

/* ---------------- INITIAL LOAD ---------------- */
fetchMovies(currentQuery, currentPage);
