// Check if the favorites list exists in local storage. If not, initialize it as an empty array.
if (localStorage.getItem("favouritesList") == null) {
  localStorage.setItem("favouritesList", JSON.stringify([]));
}

// Asynchronously fetch meals from the MealDB API based on the provided URL and value.
// Returns a Promise containing the fetched meals.
async function fetchMealsFromApi(url, value) {
  const response = await fetch(`${url + value}`);
  const meals = await response.json();
  return meals;
}

// Display a list of meals in the "main" section based on the search input value.
function showMealList() {
  // Get the search input value
  let inputValue = document.getElementById("my-search").value;

  // Retrieve the favorites list from local storage
  let arr = JSON.parse(localStorage.getItem("favouritesList"));

  // Define the URL for fetching meals from the MealDB API
  let url = "https://www.themealdb.com/api/json/v1/1/search.php?s=";

  // Initialize an empty HTML string
  let html = "";

  // Fetch meals from the API based on the search value
  let meals = fetchMealsFromApi(url, inputValue);

  // Process the fetched meals
  meals.then((data) => {
    if (data.meals) {
      // Iterate over each meal in the data
      data.meals.forEach((element) => {
        let isFav = false;

        // Check if the current meal is in the favorites list
        for (let index = 0; index < arr.length; index++) {
          if (arr[index] == element.idMeal) {
            isFav = true;
          }
        }

        // Generate HTML card for the meal based on whether it's a favorite or not
        if (isFav) {
          html += `
            <div id="card" class="card mb-3" style="width: 20rem;">
              <!-- Meal image -->
              <img src="${element.strMealThumb}" class="card-img-top" alt="...">
              <div class="card-body">
                <!-- Meal name -->
                <h5 class="card-title">${element.strMeal}</h5>
                <div class="d-flex justify-content-between mt-5">
                  <!-- Button to show more details -->
                  <button type="button" class="btn btn-outline-dark" onclick="showMealDetails(${element.idMeal})">More Details</button>
                  <!-- Button to add/remove from favorites -->
                  <button id="main${element.idMeal}" class="btn btn-outline-dark active" onclick="addRemoveToFavList(${element.idMeal})" style="border-radius:50%"><i class="fa-solid fa-heart"></i></button>
                </div>
              </div>
            </div>
          `;
        } else {
          html += `
            <div id="card" class="card mb-3" style="width: 20rem;">
              <!-- Meal image -->
              <img src="${element.strMealThumb}" class="card-img-top" alt="...">
              <div class="card-body">
                <!-- Meal name -->
                <h5 class="card-title">${element.strMeal}</h5>
                <div class="d-flex justify-content-between mt-5">
                  <!-- Button to show more details -->
                  <button type="button" class="btn btn-outline-dark" onclick="showMealDetails(${element.idMeal})">More Details</button>
                  <!-- Button to add/remove from favorites -->
                  <button id="main${element.idMeal}" class="btn btn-outline-dark" onclick="addRemoveToFavList(${element.idMeal})" style="border-radius:50%"><i class="fa-solid fa-heart"></i></button>
                </div>
              </div>
            </div>
          `;
        }
      });
    } else {
      // Display a 404 message if no meals were found
      html += `
        <div class="page-wrap d-flex flex-row align-items-center">
          <div class="container">
            <div class="row justify-content-center">
              <div class="col-md-12 text-center">
                <span class="display-1 d-block">404</span>
                <div class="mb-4 lead">
                  The meal you are looking for was not found.
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    // Update the "main" section in the DOM with the generated HTML
    document.getElementById("main").innerHTML = html;
  });
}

// Show the full details of a meal in the "main" section
async function showMealDetails(id) {
  // Define the URL for fetching meal details from the MealDB API
  let url = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";

  // Initialize an empty HTML string
  let html = "";

  // Fetch meal details from the API based on the meal ID
  await fetchMealsFromApi(url, id).then((data) => {
    html += `
      <div id="meal-details" class="mb-5">
        <div id="meal-header" class="d-flex justify-content-around flex-wrap">
          <div id="meal-thumbail">
            <!-- Meal image -->
            <img class="mb-2" src="${data.meals[0].strMealThumb}" alt="" srcset="">
          </div>
          <div id="details">
            <!-- Meal name, category, and area -->
            <h3>${data.meals[0].strMeal}</h3>
            <h6>Category: ${data.meals[0].strCategory}</h6>
            <h6>Area: ${data.meals[0].strArea}</h6>
          </div>
        </div>
        <div id="meal-instruction" class="mt-3">
          <h5 class="text-center">Instruction:</h5>
          <!-- Meal instructions -->
          <p>${data.meals[0].strInstructions}</p>
        </div>
        <div class="text-center">
          <!-- Link to watch a video related to the meal -->
          <a href="${data.meals[0].strYoutube}" target="_blank" class="btn btn-outline-light mt-3">Watch Video</a>
        </div>
      </div>
    `;
  });

  // Update the "main" section in the DOM with the generated HTML
  document.getElementById("main").innerHTML = html;
}

// Show all favorite meals in the "favourites-body" section
async function showFavMealList() {
  // Retrieve the favorites list from local storage
  let arr = JSON.parse(localStorage.getItem("favouritesList"));

  // Define the URL for fetching meal details from the MealDB API
  let url = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";

  // Initialize an empty HTML string
  let html = "";

  if (arr.length == 0) {
    // Display a message if there are no favorite meals
    html += `
      <div class="page-wrap d-flex flex-row align-items-center">
        <div class="container">
          <div class="row justify-content-center">
            <div class="col-md-12 text-center">
              <span class="display-1 d-block">404</span>
              <div class="mb-4 lead">
                No meal added to your favorites list.
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  } else {
    // Iterate over each favorite meal and fetch its details
    for (let index = 0; index < arr.length; index++) {
      await fetchMealsFromApi(url, arr[index]).then((data) => {
        html += `
          <div id="card" class="card mb-3" style="width: 20rem;">
            <!-- Meal image -->
            <img src="${data.meals[0].strMealThumb}" class="card-img-top" alt="...">
            <div class="card-body">
              <!-- Meal name -->
              <h5 class="card-title">${data.meals[0].strMeal}</h5>
              <div class="d-flex justify-content-between mt-5">
                <!-- Button to show more details -->
                <button type="button" class="btn btn-outline-light" onclick="showMealDetails(${data.meals[0].idMeal})">More Details</button>
                <!-- Button to add/remove from favorites -->
                <button id="main${data.meals[0].idMeal}" class="btn btn-outline-dark active" onclick="addRemoveToFavList(${data.meals[0].idMeal})" style="border-radius:50%"><i class="fa-solid fa-heart"></i></button>
              </div>
            </div>
          </div>
        `;
      });
    }
  }

  // Update the "favourites-body" section in the DOM with the generated HTML
  document.getElementById("favourites-body").innerHTML = html;
}

// Add or remove a meal from the favorites list
function addRemoveToFavList(id) {
  // Retrieve the favorites list from local storage
  let arr = JSON.parse(localStorage.getItem("favouritesList"));

  // Check if the meal ID is already in the favorites list
  let contain = false;
  for (let index = 0; index < arr.length; index++) {
    if (id == arr[index]) {
      contain = true;
    }
  }

  if (contain) {
    // Remove the meal from the favorites list
    let number = arr.indexOf(id);
    arr.splice(number, 1);
    alert("Your meal has been removed from favorites");
  } else {
    // Add the meal to the favorites list
    arr.push(id);
    alert("Your meal has been added to favorites");
  }

  // Update the favorites list in local storage
  localStorage.setItem("favouritesList", JSON.stringify(arr));

  // Update the meal list and favorites list in the DOM
  showMealList();
  showFavMealList();
}
