// *****************************************************************************
//                 Fetching Movie Data from TMDB using API's
// *****************************************************************************
let movieData = [];
let nameData = [];
let tvShowData = [];
let genres = [];
let genreData = [];

//  API Key
const apiKey = "PLEASE ENTER YOUR TMDB API KEY HERE";

// *****************************************************************************
//  API Path Snippets (URLs)
// *****************************************************************************
const discoverMovieURL = `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=${apiKey}&page=1`;

const trendingMovieURL = `https://api.themoviedb.org/3/trending/movie/week?sort_by=popularity.desc&api_key=${apiKey}&page=1`;

// Get Genres
const GenreUrl = `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=en-US`;

// Search End-Points
const searchMovie = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=`;
const searchPerson = `https://api.themoviedb.org/3/search/person?api_key=${apiKey}&query=`;
const searchTvShow = `https://api.themoviedb.org/3/search/tv?api_key=${apiKey}&language=en-US&include_adult=false&query=`;
const searchGenre = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=`;

// Get Movie Image
const imgURL = "https://image.tmdb.org/t/p/w200";

// *****************************************************************************
// Populate Data
// *****************************************************************************

function processData(type, item) {
  if (type === "movie") {
    return {
      title: item.title,
      img: item.backdrop_path
        ? `${imgURL}${item.backdrop_path}`
        : "./img/placeholder_movies.png",
      // Modified image, taken from https://www.istockphoto.com/
      genre: item.genre_ids
        .reduce((acc, x) => {
          let movieGenre = genres.find((g) => g.id === x);
          if (movieGenre) {
            acc.push(movieGenre.name);
          }
          return acc;
        }, [])
        .join(", "),
      release_date: item.release_date,
      overview: item.overview,
      vote_average: item.vote_average,
    };
  } else if (type === "celeb") {
    return {
      title: item.name,
      img: item.profile_path
        ? `${imgURL}${item.profile_path}`
        : "./img/placeholder_person.png",
      // Modified image, taken from https://www.vhv.rs/
      movies: item.known_for,
      moviesList: item.known_for
        .map((x) => x.original_title || x.original_name)
        .join(", "),
    };
  } else if (type === "tvshow") {
    return {
      title: item.name,
      img: item.poster_path
        ? `${imgURL}${item.poster_path}`
        : "./img/placeholder_tvShows.png",
      // Modified image, taken from http://lexingtonvenue.com/
      genre: item.genre_ids
        .reduce((acc, x) => {
          let movieGenre = genres.find((g) => g.id === x);
          if (movieGenre) {
            acc.push(movieGenre.name);
          }
          return acc;
        }, [])
        .join(", "),
      release_date: item.first_air_date,
      overview: item.overview,
      vote_average: item.vote_average,
    };
  }
}

function getMovieDetail(type, item) {
  movieDetailContainer.innerHTML = "";
  const element = processData(type, item);
  const img = document.createElement("img");
  img.setAttribute("src", `${element.img}`);
  img.setAttribute("alt", element.title);
  movieDetailContainer.appendChild(img);

  const div = document.createElement("div");
  div.setAttribute("class", "detailContainer");

  const title = document.createElement("p");
  title.innerHTML = `<b>Name:</b> ${element.title}`;
  div.appendChild(title);

  if (element.genre) {
    const genre = document.createElement("p");
    genre.innerHTML = `<b>Genre: </b> ${element.genre}`;
    div.appendChild(genre);
  }

  if (element.release_date) {
    const release_date = document.createElement("p");
    release_date.innerHTML = `<b>Release Date:</b> ${element.release_date}`;
    div.appendChild(release_date);
  }

  if (element.vote_average) {
    const vote_average = document.createElement("p");
    vote_average.innerHTML = `<b>Rating: </b> ${element.vote_average}`;
    div.appendChild(vote_average);
  }

  if (element.overview) {
    const description = document.createElement("p");
    description.innerHTML = `<b>Description:</b> ${element.overview}`;
    div.appendChild(description);
  }

  if (element.movies) {
    const label = document.createElement("p");
    label.innerHTML = `<br/><b>Known for: </b>`;
    div.appendChild(label);
    const movieContainer = document.createElement("div");
    movieContainer.setAttribute("id", "flexContainer");
    element.movies.forEach((item) => {
      const element = processData("movie", item);

      const movieDiv = document.createElement("div");
      movieDiv.setAttribute("class", "card");

      const movieImg = document.createElement("img");
      movieImg.setAttribute("src", element.img);
      movieImg.setAttribute("class", "card-img");
      movieImg.setAttribute("alt", element.title);

      const movieTitle = document.createElement("p");
      movieTitle.setAttribute("class", "card-title");
      movieTitle.innerText = element.title;

      const movieGenre = document.createElement("p");
      movieGenre.setAttribute("class", "card-subtitle");
      movieGenre.innerText = element.genre;
      movieDiv.appendChild(movieImg);
      movieDiv.appendChild(movieTitle);
      movieDiv.appendChild(movieGenre);
      movieContainer.appendChild(movieDiv);
    });
    div.appendChild(movieContainer);
  }
  movieDetailContainer.appendChild(div);
}

function renderCardList(type) {
  cardContainer.innerHTML = "";
  if (!movieData.length) {
    showDataNotFound();
  } else {
    movieData.forEach((item) => {
      const element = processData(type, item);
      const div = document.createElement("div");
      div.setAttribute("class", "card");

      div.addEventListener("click", () => {
        movieDetailModal.style.display = "block";
        getMovieDetail(type, item);
      });

      const img = document.createElement("img");
      img.setAttribute("src", element.img);
      let movieClass = "card-img ";
      movieClass += type === "movie" ? "movie-img" : "";
      movieClass += type === "celeb" ? "celeb-img" : "";
      img.setAttribute("class", movieClass);
      img.setAttribute("alt", element.title);
      div.appendChild(img);

      const title = document.createElement("p");
      title.setAttribute("class", "card-title");
      title.innerText = element.title;
      div.appendChild(title);

      if (element.genre) {
        const genre = document.createElement("p");
        genre.setAttribute("class", "card-subtitle");
        genre.innerText = element.genre;
        div.appendChild(genre);
      }

      if (element.moviesList) {
        const moviesList = document.createElement("p");
        moviesList.setAttribute("class", "card-subtitle");
        moviesList.innerText = element.moviesList;
        div.appendChild(moviesList);
      }
      cardContainer.appendChild(div);
    });
  }
}

function showDataNotFound() {
  const div = document.createElement("div");
  div.setAttribute("class", "notFound");

  const img = document.createElement("img");
  img.setAttribute("src", "./img/placeholder_not_found.png");
  // Modified image, taken from https://www.istockphoto.com/
  div.appendChild(img);
  cardContainer.appendChild(div);
}

async function getMovies(url) {
  const res = await fetch(url);
  const data = await res.json();

  movieData = data.results;
  renderCardList("movie");
}

async function getPeople(url) {
  const res = await fetch(url);
  const data = await res.json();
  movieData = data.results;
  renderCardList("celeb");
}

async function getTvShows(url) {
  const res = await fetch(url);
  const data = await res.json();
  movieData = data.results;
  renderCardList("tvshow");
}

async function getMoviesBasedOnGenre(url) {
  const res = await fetch(url);
  const data = await res.json();
  movieData = data.results;
  renderCardList("movie");
}

getGenres(GenreUrl);

// Get Genres
async function getGenres(url) {
  genreList.style.display = "none";
  const res = await fetch(url);
  const data = await res.json();
  genres = data.genres;
  getMovies(discoverMovieURL);

  genres.forEach((element) => {
    let option = document.createElement("option");
    option.value = element.id;
    option.innerHTML = element.name;
    genreList.appendChild(option);
  });
}

pickTrending.addEventListener("change", () => {
  let apiPath;
  if (pickTrending.checked) {
    apiPath = trendingMovieURL;
    currentCategory.innerHTML = `Trending Movies of the Week`;
  } else {
    apiPath = discoverMovieURL;
    currentCategory.innerHTML = `Current Popular Movies`;
  }
  getMovies(apiPath);
});

searchItemButton.addEventListener("click", () => {
  movieData = [];
  if (searchItem.value !== "") {
    if (filterMovies.value === "movieTitles") {
      getMovies(searchMovie + `'${encodeURI(searchItem.value)}'`);
    } else if (filterMovies.value === "celebNames") {
      getPeople(searchPerson + `'${encodeURI(searchItem.value)}'`);
    } else if (filterMovies.value === "tvShows") {
      getTvShows(searchTvShow + `'${encodeURI(searchItem.value)}'`);
    } else {
      genreList.style.display = "block";
    }
  }
});

// Select Category filter
filterMovies.addEventListener("change", () => {
  if (filterMovies.value == "genres") {
    currentCategory.innerHTML = `Search by Genres`;
    genreList.style.display = "inline";
    searchItem.style.display = "none";
    searchItemButton.style.display = "none";
    getMoviesBasedOnGenre(`${searchGenre}${genres[0].id}`);
  } else {
    currentCategory.innerHTML = `Current Popular Movies`;
    genreList.style.display = "none";
    searchItemButton.style.display = "inline";
    searchItem.style.display = "inline";
    searchItem.value = "";
    searchItem.focus();
    if (filterMovies.value === "movieTitles") {
      currentCategory.innerHTML = `Search by Movies`;
    } else if (filterMovies.value === "celebNames") {
      currentCategory.innerHTML = `Search by Celebrities`;
    } else {
      currentCategory.innerHTML = `Search by TV Shows`;
    }
  }
});

// Genre filter
genreList.addEventListener("change", () => {
  getMoviesBasedOnGenre(`${searchGenre}${genreList.value}`);
});

closeMovieDetailModal.addEventListener("click", () => {
  movieDetailModal.style.display = "none";
});
