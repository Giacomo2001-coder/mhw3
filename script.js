const dishesType = document.querySelector('[data-type = dishes');
dishesType.addEventListener('click', onOptionClick);
const cocktailsType = document.querySelector('[data-type = cocktails');
cocktailsType.addEventListener('click', onOptionClick);
const flexContainer = document.querySelector('#FlexContainer');
const form = document.querySelector('form');
form.addEventListener('submit', onSubmit);

const bestResultContainer = document.querySelector('#FlexResultContainer');
const bestResultItem = bestResultContainer.lastElementChild;
//Inizialize the div in order to clean it later at the start of the function
const lessRelevantItem = document.createElement('div');
const arrowBack = bestResultContainer.firstElementChild;
arrowBack.addEventListener('click', onClickArrowBack);
const options = {
	method: 'GET',
	headers: {
		'content-type': 'application/octet-stream',
		'X-RapidAPI-Key': '8f1abb32a4msh9a5eeb13cee8759p1846b9jsn6b070b764739',
		'X-RapidAPI-Host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com'
	}
};

function onOptionClick(e) {
  if(e.currentTarget.dataset.type === 'dishes'){
    window.alert("Food recipes selected, you can now search for food recipes!");
    document.querySelector('#ricetta').dataset.type = 'dishes';
    document.querySelector('#ricetta').placeholder = 'Search a food recipe';
  }else if(e.currentTarget.dataset.type === 'cocktails'){
    window.alert("Cocktail recipes selected, you can now search for cocktail recipes!");
    document.querySelector('#ricetta').dataset.type = 'cocktails';
    document.querySelector('#ricetta').placeholder = 'Search a cocktail recipe'; 
  }
  console.log(document.querySelector('#ricetta').dataset.type);
}

function onSubmit(e){
  e.preventDefault();
  const searchValue = encodeURIComponent(document.querySelector('#ricetta').value);
  if(searchValue !== ''){
  
  if(document.querySelector('#ricetta').dataset.type === 'dishes'){
  const cousine = '';
  const popularity = '';
  const url = 'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/complexSearch?query='+searchValue+'&cuisine='+cousine+'&fillIngredients=true&addRecipeInformation=true&sort='+popularity+'&number=9&ranking=2';
  fetch(url, options).then(onResponse, onError).then(onRecipeSearch).catch(onError);
  }else if(document.querySelector('#ricetta').dataset.type === 'cocktails') {
    const url = 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s='+searchValue+'';
    fetch(url).then(onResponse, onError).then(onCocktailSearch).catch(onError);
  }
  bestResultContainer.style.display = 'flex';
  flexContainer.style.display = 'none';
 } else return;
}

function onResponse(response){
  return response.json();
}
function onError(error){
  console.log(error);
}
function onRecipeSearch(json){
  //remove all children on start
    while(bestResultItem.hasChildNodes()){
      bestResultItem.removeChild(bestResultItem.firstChild);
    }
    while(lessRelevantItem.hasChildNodes()){
      lessRelevantItem.removeChild(lessRelevantItem.firstChild);
    }
    const results = json.results;

    if(Object.keys(results).length === 0){
      const searchNotFound = document.createElement('h1');
      searchNotFound.textContent = 'Search has given 0 results';
      bestResultItem.appendChild(searchNotFound);
      return;
    }
    const mostRelevant = results[0];
    let title = mostRelevant.title;
    let image = mostRelevant.image;
    let ingredients = mostRelevant.missedIngredients;
    let ingredientsCount = mostRelevant.missedIngredientCount;
    let instructions = mostRelevant.analyzedInstructions[0].steps;

    const titleH1 = document.createElement('h1');
    titleH1.textContent = title;
    const img = document.createElement('img');
    img.src = image;
    const ingredientsCountH2 = document.createElement('h2');
    ingredientsCountH2.textContent = 'Total Ingredients: '+ingredientsCount+'';
    const ordinaryIngredientList = document.createElement('ol');
    ordinaryIngredientList.style.listStyleType = 'none';
    const divInstructionList = document.createElement('div');
    const instructionsH1 = document.createElement('h1');
    instructionsH1.textContent = 'Instructions: ';
    
    //Ingredients
    if(ingredients !== null){
    for(const ingredient of ingredients){
      const li = document.createElement('li');
      const ingredientInstruction = ingredient.original;
      ordinaryIngredientList.appendChild(li);
      const p = document.createElement('p');
      p.textContent = ingredientInstruction;
      li.appendChild(p);
    }  
  }
    //Instructions
    if(instructions !== null){
    for(const instruction of instructions){
      const br = document.createElement('br');
      const detailedInstruction = instruction.step;
      divInstructionList.appendChild(br);
      const p = document.createElement('p');
      p.textContent = detailedInstruction;
      divInstructionList.appendChild(p);
    }
  }
    bestResultItem.appendChild(titleH1);
    bestResultItem.appendChild(img);
    bestResultItem.appendChild(ingredientsCountH2);
    bestResultItem.appendChild(ordinaryIngredientList);
    bestResultItem.appendChild(instructionsH1);
    bestResultItem.appendChild(divInstructionList);

    //lessRelevant Recipes
    bestResultContainer.appendChild(lessRelevantItem);
    lessRelevantItem.classList.add('FlexItemImages');
    const lessRelevantH1 = document.createElement('h1');
    lessRelevantH1.textContent = 'Other Recipes: ';
    lessRelevantH1.style.flexBasis = '100%';
    lessRelevantH1.style.textAlign = 'center';
    lessRelevantItem.appendChild(lessRelevantH1);
    //meno rilevanti
    for(const result of results){
      if(result.id !== mostRelevant.id){
         image = result.image;
         let lessRelevantImg = document.createElement('img');
         lessRelevantImg.src = image;
         lessRelevantItem.appendChild(lessRelevantImg);
         lessRelevantImg.addEventListener('click', showSelectedRecipe);
         lessRelevantImg.myParam = result.id;
      }
    }
}

function onClickArrowBack(){
  flexContainer.style.display = 'flex';
  bestResultContainer.style.display = 'none';
}

function showSelectedRecipe(event){
  const recipeID = event.currentTarget.myParam;
  const url = 'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/'+recipeID+'/information?includeNutrition=false';
  fetch(url, options).then(onResponse, onError).then(onSelectedRecipe).catch(onError);
}

function onSelectedRecipe(json){
  //Reset the item container
  while(bestResultItem.hasChildNodes()){
    bestResultItem.removeChild(bestResultItem.firstChild);
  }
  const title = json.title;
  const image = json.image;
  const ingredients = json.extendedIngredients;
  const instructions = json.analyzedInstructions[0].steps;

  const titleH1 = document.createElement('h1');
  titleH1.textContent = title;
  const img = document.createElement('img');
  img.src = image;
  const ingredientsH2 = document.createElement('h2');
  ingredientsH2.textContent = 'Ingredients: ';
  const ordinaryIngredientList = document.createElement('ol');
  ordinaryIngredientList.style.listStyleType = 'none';
  const divInstructionList = document.createElement('div');
  const instructionsH1 = document.createElement('h1');
  instructionsH1.textContent = 'Instructions: ';

  //Ingredients
  if(ingredients !== null){
  for(const ingredient of ingredients){
    const ingredientInstruction = ingredient.original;
    const li = document.createElement('li');
    ordinaryIngredientList.appendChild(li);
    const p = document.createElement('p');
    p.textContent = ingredientInstruction;
    li.appendChild(p);
  }
}
  //Instructions
  if(instructions !== null){
  for(const instruction of instructions){
    const detailedInstruction = instruction.step;
    const br = document.createElement('br');
    const p = document.createElement('p');
    p.textContent = detailedInstruction;
    divInstructionList.appendChild(br);
    divInstructionList.appendChild(p);
  }
}
  bestResultItem.appendChild(titleH1);
  bestResultItem.appendChild(img);
  bestResultItem.appendChild(ingredientsH2);
  bestResultItem.appendChild(ordinaryIngredientList);
  bestResultItem.appendChild(instructionsH1);
  bestResultItem.appendChild(divInstructionList);
}

function onCocktailSearch(json){
  while(bestResultItem.hasChildNodes()){
    bestResultItem.removeChild(bestResultItem.firstChild);
  }
  while(lessRelevantItem.hasChildNodes()){
    lessRelevantItem.removeChild(lessRelevantItem.firstChild);
  }
  const drinks = json.drinks;
  const firstDrinkResult = drinks[0];
  let drinkName = firstDrinkResult.strDrink;
  let drinkImg = firstDrinkResult.strDrinkThumb;
  let drinkInstructions = firstDrinkResult.strInstructions;
  const drinkIngredients = [];

  const h1 = document.createElement('h1');
  h1.textContent = drinkName;
  const img = document.createElement('img');
  img.src = drinkImg;
  const totalIngredients = document.createElement('h2');
  const divDrinkingredients = document.createElement('div');
  const h2 = document.createElement('h2');
  h2.textContent = 'Instructions: ';
  const p = document.createElement('p');
  p.textContent = drinkInstructions;
  //Save variables not null in Array
  for(let i=1; i<=15; i++){
    let ingredientI = eval("firstDrinkResult.strIngredient" + i);
    if(ingredientI !== null){
      drinkIngredients.push(ingredientI);
    }
  }
  //Load variables from Array
  totalIngredients.textContent = 'Total Ingredients : '+drinkIngredients.length+'';
  divDrinkingredients.appendChild(totalIngredients);
  for(const drinkIngredient of drinkIngredients){
    const br = document.createElement('br');
    const p = document.createElement('p');
    p.textContent = drinkIngredient;
    divDrinkingredients.appendChild(br);
    divDrinkingredients.appendChild(p);
  }
  
  bestResultItem.appendChild(h1);
  bestResultItem.appendChild(img);
  bestResultItem.appendChild(divDrinkingredients);
  bestResultItem.appendChild(h2);
  bestResultItem.appendChild(p);

  bestResultContainer.appendChild(lessRelevantItem);
  lessRelevantItem.classList.add('FlexItemImages');
  const lessRelevantH1 = document.createElement('h1');
  lessRelevantH1.textContent = 'Other Drinks: ';
  lessRelevantH1.style.flexBasis = '100%';
  lessRelevantH1.style.textAlign = 'center';
  lessRelevantItem.appendChild(lessRelevantH1);
  for(const drink of drinks){
   if(drink.idDrink !== firstDrinkResult.idDrink){
     drinkImg = drink.strDrinkThumb;
     let otherDrinks = document.createElement('img');
     otherDrinks.src = drinkImg;
     lessRelevantItem.appendChild(otherDrinks);
     otherDrinks.addEventListener('click', showSelectedCocktail);
     otherDrinks.myParam = drink.idDrink;
   }
  }

}

function showSelectedCocktail(e){
  cocktailID = e.currentTarget.myParam;
  const url = 'https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i='+cocktailID+'';
  fetch(url).then(onResponse, onError).then(onSelectedCocktail);
}

function onSelectedCocktail(json){
  while(bestResultItem.hasChildNodes()){
    bestResultItem.removeChild(bestResultItem.firstChild);
  }
  const drink = json.drinks[0];
  let drinkName = drink.strDrink;
  let drinkImg = drink.strDrinkThumb;
  let drinkInstructions = drink.strInstructions;
  const drinkIngredients = [];

  const h1 = document.createElement('h1');
  h1.textContent = drinkName;
  const img = document.createElement('img');
  img.src = drinkImg;
  const divDrinkingredients = document.createElement('div');
  const h2 = document.createElement('h2');
  h2.textContent = 'Instructions: ';
  const p = document.createElement('p');
  p.textContent = drinkInstructions;
  
  //Save variables not null in Array
  for(let i=1; i<=15; i++){
    let ingredientI = eval("drink.strIngredient" + i);
    if(ingredientI !== null){
      drinkIngredients.push(ingredientI);
    }
  }
  //Load variables from Array
  for(const drinkIngredient of drinkIngredients){
    const br = document.createElement('br');
    const p = document.createElement('p');
    p.textContent = drinkIngredient;
    divDrinkingredients.appendChild(br);
    divDrinkingredients.appendChild(p);
  }
  
  bestResultItem.appendChild(h1);
  bestResultItem.appendChild(img);
  bestResultItem.appendChild(divDrinkingredients);
  bestResultItem.appendChild(h2);
  bestResultItem.appendChild(p);
}