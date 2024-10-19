import { FetchData } from "./movie.js";



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
// Base URL for image paths

const apiUrl = "https://api.themoviedb.org/3/trending/all/week?language=en-US";
const carouselInner = document.querySelector("#default-carousel .relative");
const prevButton = document.querySelector("[data-carousel-prev]");
const nextButton = document.querySelector("[data-carousel-next]");
const dotContainer = document.querySelector(".absolute.z-30.flex"); // Select the container for the dots

let currentIndex = 0;
let items = [];
let autoSlideInterval;

// Fetch data from the API for the carousel
fetch(apiUrl, options)
  .then((response) => response.json())
  .then((data) => {
    items = data.results;
    populateCarousel(items);
  })
  .catch((err) => console.error(err));

// Your populateCarousel function
function populateCarousel(items) {
  items.forEach((item) => {
    if (item.backdrop_path) {
      const titlename = item.name || item.original_title;
      const carouselItem = document.createElement("div");
      carouselItem.setAttribute("data-carousel-item", "");
      carouselItem.className = "hidden duration-700 ease-in-out";
      carouselItem.innerHTML = `



      
        <img src="https://image.tmdb.org/t/p/w500${item.backdrop_path}" alt="${titlename}" class="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" />
      `;

      carouselInner.appendChild(carouselItem);
    }
  });

  // Create dot buttons
  createDotButtons(items.length);

  // Only update carousel if there are items
  if (carouselInner.children.length > 0) {
    updateCarousel();
    startAutoSlide(); // Auto slide starts after populating
  }
}

// Function to create dot buttons
function createDotButtons(count) {
  // Clear existing dots
  dotContainer.innerHTML = "";

  for (let i = 0; i < count; i++) {
    const dotButton = document.createElement("button");
    dotButton.type = "button";
    dotButton.className = "w-3 h-3 rounded-full";
    dotButton.setAttribute("aria-current", i === 0);
    dotButton.setAttribute("aria-label", `Slide ${i + 1}`);
    dotButton.setAttribute("data-carousel-slide-to", i);

    // Add event listener to handle dot button clicks
    dotButton.addEventListener("click", () => {
      stopAutoSlide();
      currentIndex = i;
      updateCarousel();
    });

    dotContainer.appendChild(dotButton);
  }
}

// Function to update the carousel display
function updateCarousel() {
  const totalItems = carouselInner.children.length;

  // Hide all items
  Array.from(carouselInner.children).forEach((item, index) => {
    item.classList.add("hidden");
    // Update the dot button states
    const dotButton = dotContainer.children[index];
    dotButton.setAttribute("aria-current", index === currentIndex);
  });

  // Show the current item
  carouselInner.children[currentIndex].classList.remove("hidden");
}

// Start auto sliding
function startAutoSlide() {
  autoSlideInterval = setInterval(() => {
    currentIndex = (currentIndex + 1) % items.length;
    updateCarousel();
  }, 3000); // Change every 3 seconds
}

// Stop auto sliding when user interacts
function stopAutoSlide() {
  clearInterval(autoSlideInterval);
}

// Event listeners for previous and next buttons
prevButton.addEventListener("click", () => {
  stopAutoSlide();
  currentIndex = (currentIndex - 1 + items.length) % items.length;
  updateCarousel();
});

nextButton.addEventListener("click", () => {
  stopAutoSlide();
  currentIndex = (currentIndex + 1) % items.length;
  updateCarousel();
});

document.getElementById("search-form").addEventListener("submit", function (e) {
  e.preventDefault();
  const query = document.getElementById("default-search").value;
  searchMovies(query);
});

// Function to search for movies
async function searchMovies(query) {
  try {
    const searchResponse = await fetch(
      `https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US&page=1`,
      options
    );
    const searchData = await searchResponse.json();
    displaySearchResults(searchData.results);
  } catch (error) {
    console.error("Error searching movies:", error);
  }
}

// Function to display search results
function displaySearchResults(movies) {
  const result = document.getElementById("searchres");
  result.innerHTML = movies
    .map(
      (movie) => `

   
                <div>
                  <img class="h-auto max-w-full rounded-lg" src="${
                    IMG_URL + movie.poster_path
                  }" alt="${movie.title}">
                </div>

      
   `
    )
    .join("");
}
