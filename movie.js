const apiKey = import.meta.env.VITE_API_KEY;

const IMG_URL = "https://image.tmdb.org/t/p/w500/";
const IMG_URL_org = "https://image.tmdb.org/t/p/original/";

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${apiKey}`,
  },
};

export async function FetchData() {
  try {
    const response = await fetch(
      "https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc",
      options
    );
    const data = await response.json();
    const result = document.getElementById("result");

    // Clear previous content
    result.innerHTML = "";

    // Display only the first 7 movies
    const moviesToShow = data.results.slice(0, 6);

    result.innerHTML += `
 
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        ${moviesToShow
          .slice(2)
          .map(
            (movie) => `
            <div>
                <img class="h-auto max-w-full rounded-lg" src="${
                  IMG_URL + movie.backdrop_path
                }" alt="${movie.title}">
              <div>
          <div>2024 &bullet; Movie</div>
          <h1 class="text-lg font-medium mt-[0]">${movie.title}</h1>
        </div>
            </div> 
        `
          )
          .join("")}
     
    </div>
        <div class="grid grid-cols-1  md:grid-cols-2 gap-4 mt-4">
    <div>
        <div class="relative overflow-hidden rounded-lg">
            <div class="absolute inset-0 bg-gradient-to-b from-transparent to-black/70"></div>
            <img class="h-auto max-w-full " src="${
              IMG_URL + moviesToShow[0].backdrop_path
            }" alt="${moviesToShow[0].title}">
            <header class="absolute bottom-0 left-0 w-full p-5">
                <div>
                    <div class="text-gray-300 text-sm">${
                      moviesToShow[0].release_date.split("-")[0]
                    } &bullet; Movie</div>
                    <h1 class="text-white text-xl font-bold shadow-lg">${
                      moviesToShow[0].title
                    }</h1>
                </div>
        </div>

        </header>
    </div>
        <div class="relative overflow-hidden rounded-lg">
            <div class="absolute inset-0 bg-gradient-to-b from-transparent to-black/70"></div>
            <img class="h-auto max-w-full " src="${
              IMG_URL + moviesToShow[1].backdrop_path
            }" alt="${moviesToShow[1].title}">
            <header class="absolute bottom-0 left-0 w-full p-5">
                <div>
                    <div class="text-gray-300 text-sm">${
                      moviesToShow[1].release_date.split("-")[0]
                    } &bullet; Movie</div>
                    <h1 class="text-white text-xl font-bold shadow-lg">${
                      moviesToShow[1].title
                    }</h1>
                </div>
        </div>

        </header>
    </div>
    </div>




      
    </div>
    `;
  } catch (error) {
    console.error(error);
    document.getElementById("result").innerHTML =
      "<p>Failed to load movies. Please try again later.</p>";
  }
}

FetchData();
