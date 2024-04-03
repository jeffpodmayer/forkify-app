import * as model from "./model.js";
import recipeView from "./views/recipeView.js";

// import icons from `../img/icons.svg` //Parcel 1

import "core-js/stable";
import "regenerator-runtime";

const recipeContainer = document.querySelector(".recipe");

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////
const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    console.log(id);

    if (!id) return;
    recipeView.renderSpinner();

    //1. LOADING RECIPE
    await model.loadRecipe(id);

    // 2. RENDERING RECIPE
    recipeView.render(model.state.recipe);
  } catch (err) {
    alert(err);
  }
};

[`hashchange`, `load`].forEach((e) =>
  window.addEventListener(e, controlRecipes)
);

// window.addEventListener(`hashchange`, controlRecipes);
// window.addEventListener(`load`, controlRecipes);
