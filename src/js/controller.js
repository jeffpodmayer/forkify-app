import * as model from "./model.js";
import { MODAL_CLOSE_SEC } from "./config.js";
import recipeView from "./views/recipeView.js";
import searchView from "./views/searchView.js";
import resultsView from "./views/resultsView.js";
import paginationView from "./views/paginationView.js";
import bookmarksView from "./views/bookmarksView.js";
import addRecipeView from "./views/addRecipeView.js";

import "core-js/stable";
import "regenerator-runtime";

const recipeContainer = document.querySelector(".recipe");

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

// if (module.hot) {
//   module.hot.accept();
// }

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();

    //3. UPdating Bookmarks view
    bookmarksView.update(model.state.bookmarks);
    // 0. Update results view to Mar selected searh result
    resultsView.update(model.getSearchResultsPage());

    //1. LOADING RECIPE
    await model.loadRecipe(id);

    // 2. RENDERING RECIPE
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
    console.error(err);
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    //1. GET SEARCH QUERY
    const query = searchView.getQuery();
    if (!query) return;

    // 2. LOAD SEARCH RESULTS
    await model.loadSearchResults(query);

    // 3. RENDER RESULTS
    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPage());

    //4. Render initial pagination
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  //1. RENDER NEW RESULTS
  resultsView.render(model.getSearchResultsPage(goToPage));

  //2. Render new pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  //1. Update the recipe servings (in state)
  model.updateServings(newServings);

  //2. Update the view as well.
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // 1. ADD OR REMOVE BOOKMARK
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  //2. UPDATE RECIPE VIEW
  recipeView.update(model.state.recipe);

  //3. RENDER BOOKMARKS
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // SPINNER LOADING
    addRecipeView.renderSpinner();

    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    //RENDER RECIPE
    recipeView.render(model.state.recipe);

    // DISPLY A SUCCESS MESSAGE
    addRecipeView.renderMessage();

    // render bookmarkView
    bookmarksView.render(model.state.bookmarks);

    //CHANGE ID in URL
    window.history.pushState(null, ``, `#${model.state.recipe.id}`);

    //CLOSE FORM WINDOW
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error(`EMOJI`, err);
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
