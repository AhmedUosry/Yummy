/// <reference types="../@types/jquery" />
"use strict";

//=========================================== Variables ===========================////
const meals = document.getElementById("meals");
const searchPage = document.getElementById("search");
const searchContainer = document.getElementById("searchContainer");
const searchByFName = document.getElementById("searchByName");
const searchByFirstLitter = document.getElementById("searchByFirstLitter");
const categories = document.getElementById("categories");
const categoryContainer = document.getElementById("categoryContainer");
const area = document.getElementById("area");
const areasContainer = document.getElementById("areasContainer");
const ingredients = document.getElementById("ingredients");
const ingredientsContainer = document.getElementById("ingredientsContainer");
const contactUs = document.getElementById("contactUs");
const ContactUsContainer = document.getElementById("ContactUsContainer");
const formData = document.querySelector("form");
const inputs = document.querySelectorAll("form input");
const submitBtn = document.getElementById("submitBtn");
let apiStorage = 0;
let isValid = 0;
//=================================== Loaing ===================================//
$(function () {
  $("#loading").fadeOut(500, () => {
    $("#loading").css("display", "none");
    $("body").css("overflow", "auto");
    $("#loading").remove();
  });
});
//=================================== SideNav ===================================//
$(".Bars").click(() => {
  if (
    $(".side-nav").css("left") == "-258px" ||
    $(".links ul li").css("top") == "300px"
  ) {
    for (let i = 0; i < 5; i++) {
      $(".links li")
        .eq(i)
        .animate({ top: 0 }, (i + 5) * 100);
    }
    $(".side-nav").animate({ left: "0px" });
    $(".Bars").removeClass("fa-align-justify");
    $(".Bars").addClass("fa-x");
  } else {
    for (let i = 0; i < 5; i++) {
      $(".links li")
        .eq(i)
        .animate({ top: 300 }, (i + 5) * 100);
    }
    $(".side-nav").animate({ left: "-258px" });
    $(".Bars").removeClass("fa-x");
    $(".Bars").addClass("fa-align-justify");
  }
});

function closeNav() {
  for (let i = 0; i < 5; i++) {
    $(".links li")
      .eq(i)
      .animate({ top: 300 }, (i + 5) * 100);
  }
  $(".side-nav").animate({ left: "-258px" });
  $(".Bars").removeClass("fa-x");
  $(".Bars").addClass("fa-align-justify");
}
//=========================================== Main API ===========================//
async function mealsApi() {
  const getApi = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s`
  );
  apiStorage = await getApi.json();
  displayMeals(apiStorage.meals);
}

function displayMeals(mealsArray) {
  let mealsContainer = ``;
  for (let i = 0; i < mealsArray?.length; i++) {
    mealsContainer += `
        <div class="col-md-3">
        <div onclick="getMealDetails('${mealsArray[i].idMeal}')"  class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
            <img class="w-100" src="${mealsArray[i].strMealThumb}">
            <div class="meal-layer position-absolute d-flex align-items-center text-black p-2">
                <h3>${mealsArray[i].strMeal}</h3>
            </div>
        </div>
</div>
        `;
  }
  meals.innerHTML = mealsContainer;
}
mealsApi();
//=========================================== Search API ===========================////
searchPage.addEventListener("click", () => {
  closeNav();
  searchByFName.value=''
  searchByFirstLitter.value=''
  searchContainer.classList.remove("d-none");
  meals.innerHTML = "";
  categoryContainer.classList.add("d-none");
  areasContainer.classList.add("d-none");
  ingredientsContainer.classList.add("d-none");
  ContactUsContainer.classList.add("d-none");
});


async function searchByName(word) {
  const getSearchApi = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${word}`
  );
  apiStorage = await getSearchApi.json();
  displayMeals(apiStorage.meals);
}

searchByFName.addEventListener("keyup", (search) => {
  searchByName(search.target.value);
});

async function searchByFirst(word) {
  word == "" ? (word = "t") : "";
  const searchByFirstL = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?f=${word}`
  );
  apiStorage = await searchByFirstL.json();
  displayMeals(apiStorage.meals);
}
searchByFirstLitter.addEventListener("keyup", (search) => {
  searchByFirst(search.target.value);
});
//=========================================== Categories API ===========================//
categories.addEventListener("click", () => {
  closeNav();
  searchContainer.classList.add("d-none");
  meals.innerHTML = "";
  categoryContainer.classList.remove("d-none");
  areasContainer.classList.add("d-none");
  ingredientsContainer.classList.add("d-none");
  ContactUsContainer.classList.add("d-none");
  getCategories();
});

async function getCategories() {
  const getApiCategories = await fetch(
    `https://www.themealdb.com/api/json/v1/1/categories.php`
  );
  apiStorage = await getApiCategories.json();
  displayCategories(apiStorage.categories);
}

function displayCategories(categoryArray) {
  let category = ``;
  for (let i = 0; i < categoryArray.length; i++) {
    category += `
      <div class="col-md-3">
              <div onclick="getCategoryMeals('${
                categoryArray[i].strCategory
              }')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
                  <img class="w-100" src="${categoryArray[i].strCategoryThumb}">
                  <div class="meal-layer position-absolute text-center text-black p-2">
                      <h3>${categoryArray[i].strCategory}</h3>
                      <p class='font-small'>${categoryArray[
                        i
                      ].strCategoryDescription
                        .split(" ")
                        .slice(0, 30)
                        .join(" ")}</p>
                  </div>
              </div>
      </div>
      `;
  }

  categoryContainer.innerHTML = category;
}

async function getCategoryMeals(category) {
  let categoriesApi = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`
  );
  apiStorage = await categoriesApi.json();
  displayMeals(apiStorage.meals);
  categoryContainer.innerHTML = "";
}
//=========================================== Details API ===========================//

async function getMealDetails(mealId) {
 const detailsApi = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`
  );
  apiStorage = await detailsApi.json();
  displayMealDetails(apiStorage.meals[0]);
}

function displayMealDetails(meal) {
  searchContainer.classList.add("d-none");
  let ingredients = ``;
  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients += `<li class="alert alert-info m-2 p-1">${
        meal[`strMeasure${i}`]
      } ${meal[`strIngredient${i}`]}</li>`;
    }
  }
  let tags = meal.strTags?.split(",");
  if (!tags) tags = [];
  let tagsWord = "";
  for (let i = 0; i < tags.length; i++) {
    tagsWord += `
      <li class="alert alert-danger m-2 p-1">${tags[i]}</li>`;
  }
  let details = `
  <div class="col-md-4">
              <img class="w-100 rounded-3" src="${meal.strMealThumb}"
                  alt="">
                  <h2>${meal.strMeal}</h2>
          </div>
          <div class="col-md-8">
              <h2>Instructions</h2>
              <p>${meal.strInstructions}</p>
              <h3><span class="fw-bolder">Area : </span>${meal.strArea}</h3>
              <h3><span class="fw-bolder">Category : </span>${meal.strCategory}</h3>
              <h3>Recipes :</h3>
              <ul class="list-unstyled d-flex g-3 flex-wrap">
                  ${ingredients}
              </ul>
              <h3>Tags :</h3>
              <ul class="list-unstyled d-flex g-3 flex-wrap">
                  ${tagsWord}
              </ul>
              <a target="_blank" href="${meal.strSource}" class="btn btn-success">Source</a>
              <a target="_blank" href="${meal.strYoutube}" class="btn btn-danger">Youtube</a>
          </div>`;
  meals.innerHTML = details;
}

//=========================================== Area API ===========================//

area.addEventListener("click", () => {
  closeNav();
  searchContainer.classList.add("d-none");
  meals.innerHTML = "";
  categoryContainer.classList.add("d-none");
  areasContainer.classList.remove("d-none");
  ingredientsContainer.classList.add("d-none");
  ContactUsContainer.classList.add("d-none");
  getAreaApi();
});
async function getAreaApi() {
  const areaApi = await fetch(
    `https://www.themealdb.com/api/json/v1/1/list.php?a=list`
  );
  apiStorage = await areaApi.json();
  displayArea(apiStorage.meals);
}

function displayArea(area) {
  let areaContainer = ``;
  for (let i = 0; i < area.length; i++) {
    areaContainer += `
      <div class="col-md-3">
              <div onclick="getAreaMeals('${area[i].strArea}')" class="rounded-2 text-center cursor-pointer">
                       <i class="fa-solid fa-earth-americas fa-4x"></i>
                      <h3>${area[i].strArea}</h3>
              </div>
      </div>
      `;
  }
  meals.innerHTML = areaContainer;
}

async function getAreaMeals(area) {
  const areaMeals = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`
  );
  apiStorage = await areaMeals.json();
  displayMeals(apiStorage.meals.slice(0, 20));
}

//=========================================== Ingredients API ===========================//

ingredients.addEventListener("click", () => {
  closeNav();
  searchContainer.classList.add("d-none");
  meals.innerHTML = "";
  categoryContainer.classList.add("d-none");
  areasContainer.classList.add("d-none");
  ingredientsContainer.classList.remove("d-none");
  ContactUsContainer.classList.add("d-none");
  getIngredients();
});

async function getIngredients() {
  const ingredientsApi = await fetch(
    `https://www.themealdb.com/api/json/v1/1/list.php?i=list`
  );
  apiStorage = await ingredientsApi.json();
  displayIngredients(apiStorage.meals.slice(0, 20));
}


function displayIngredients(ingredient) {
  let ingredients = ``;
  for (let i = 0; i < ingredient.length; i++) {
    ingredients += `
      <div class="col-md-3">
              <div onclick="getIngredientsMeals('${
                ingredient[i].strIngredient
              }')" class="rounded-2 text-center cursor-pointer">
                       <i class="fa-solid fa-bowl-rice fa-4x"></i>
                      <h3>${ingredient[i].strIngredient}</h3>
                      <p>${ingredient[i].strDescription
                        .split(" ")
                        .slice(0, 20)
                        .join(" ")}</p>
              </div>
      </div>
      `;
  }
  meals.innerHTML = ingredients;
}

async function getIngredientsMeals(ingredients) {
  const ingredientsMeals = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredients}`
  );
  apiStorage = await ingredientsMeals.json();
  displayMeals(apiStorage.meals.slice(0, 20));
}
//=========================================== Contact US ===========================//
contactUs.addEventListener("click", () => {
  closeNav();
  searchContainer.classList.add("d-none");
  meals.innerHTML = "";
  categoryContainer.classList.add("d-none");
  areasContainer.classList.add("d-none");
  ingredientsContainer.classList.add("d-none");
  ContactUsContainer.classList.remove("d-none");
});

formData.addEventListener("submit", (e) => {
  e.preventDefault;
});

//=========================================== Validation ===========================//

formData.addEventListener("input", () => {
  if (
    validationName(inputs[0]) &&
    validationEmail(inputs[1]) &&
    validationPhoneNumber(inputs[2]) &&
    validationAge(inputs[3]) &&
    validationPassword(inputs[4]) &&
    PasswordConfermation(inputs[5])
  ) {
    isValid = true;
    submitBtn.removeAttribute("disabled");
  } else {
    isValid = false;
    submitBtn.setAttribute("disabled", true);
  }
});

function validationName(input) {
  const regexStyle =
    /^(?:[a-zA-Z0-9\s@,=%$#&_\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDCF\uFDF0-\uFDFF\uFE70-\uFEFF]|(?:\uD802[\uDE60-\uDE9F]|\uD83B[\uDE00-\uDEFF])){2,20}$/;
  if (regexStyle.test(input.value)) {
    input.classList.add("is-valid");
    input.classList.remove("is-invalid");
    return true;
  } else {
    input.classList.add("is-invalid");
    input.classList.remove("is-valid");
    return false;
  }
}

function validationEmail() {
  const regexStyle =
    /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
  if (regexStyle.test(inputs[1].value)) {
    inputs[1].classList.add("is-valid");
    inputs[1].classList.remove("is-invalid");
    return true;
  } else {
    inputs[1].classList.add("is-invalid");
    inputs[1].classList.remove("is-valid");
    return false;
  }
}

function validationPhoneNumber() {
  const regexStyle =
    /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
  if (regexStyle.test(inputs[2].value)) {
    inputs[2].classList.add("is-valid");
    inputs[2].classList.remove("is-invalid");
    return true;
  } else {
    inputs[2].classList.add("is-invalid");
    inputs[2].classList.remove("is-valid");
    return false;
  }
}

function validationAge() {
  const regexStyle = /^([1-7][0-9]|80)$/;
  if (regexStyle.test(inputs[3].value)) {
    inputs[3].classList.add("is-valid");
    inputs[3].classList.remove("is-invalid");
    return true;
  } else {
    inputs[3].classList.add("is-invalid");
    inputs[3].classList.remove("is-valid");
    return false;
  }
}

function validationPassword() {
  const regexStyle = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  if (regexStyle.test(inputs[4].value)) {
    inputs[4].classList.add("is-valid");
    inputs[4].classList.remove("is-invalid");
    return true;
  } else {
    inputs[4].classList.add("is-invalid");
    inputs[4].classList.remove("is-valid");
    return false;
  }
}

function PasswordConfermation() {
  if (inputs[4].value == inputs[5].value) {
    inputs[5].classList.add("is-valid");
    inputs[5].classList.remove("is-invalid");
    return true;
  } else {
    inputs[5].classList.add("is-invalid");
    inputs[5].classList.remove("is-valid");
    return false;
  }
}
