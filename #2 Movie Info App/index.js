let movieNameRef = document.getElementById("movie-name");
let searchBtn = document.getElementById("search-btn");
let result = document.getElementById("result");
let body = document.querySelector("body");
let button = document.getElementById("search-btn");
let input = document.getElementById("movie-name");
function getMovie(movieName) {
	if (movieName === "") {
		result.innerHTML = `<h3 class="msg">Please enter a movie name </h3>`;
	}
	else {
		//Create a variable to store the api url
		let url = `https://www.omdbapi.com/?t=${movieName}&apikey=15bd8d8c`;
		//Create a variable to store the fetch method
		let movie = fetch(url);
		//Create a variable to store the response
		let movieResponse = movie.then((response) => response.json());
		//Return the data
		return movieResponse.then((data) => data);
	}
}

function displayMovie(movie) {
	if (movie.Response === "False") {
		result.innerHTML = `<h3 class="msg">Movie not found</h3>`;
		return;
	}
	//Create a variable to store the html
	//Set the innerHTML of the result to the html
	result.innerHTML = `
				<div class="info">
					<img src=${movie.Poster} class="poster">
					<div>
							<h2>${movie.Title}</h2>
							<div class="rating">
									<img src="img/star-icon.svg">
									<h4>${movie.imdbRating}</h4>
							</div>
							<div class="details">
									<span>${movie.Rated}</span>
									<span>${movie.Year}</span>
									<span>${movie.Runtime}</span>
							</div>
							<div class="genre">
								<span>${movie.Genre}</span>	
							</div>
					</div>
			</div>
			<h3>Plot:</h3>
			<p>${movie.Plot}</p>
			<h3>Cast:</h3>
			<p>${movie.Actors}</p>
		`;

	getAverageHexColor(movie.Poster).then((hexColor) => {
		body.style.backgroundColor = hexColor;
		button.style.backgroundColor = hexColor;
		input.style.border = "1px solid " + hexColor;
	});
}

function handleSearchBtn() {
	//Create a variable to store the movie name
	let movieName = movieNameRef.value;
	//Create a variable to store the movie
	let movie = getMovie(movieName);
	movie.then((data) => {
		displayMovie(data); // Affiche le film sur la page
	});
}

function getAverageHexColor(imageUrl) {
	return new Promise((resolve, reject) => {
		let img = new Image();
		img.crossOrigin = "Anonymous";
		img.onload = function() {
			let canvas = document.createElement('canvas');
			canvas.width = img.width;
			canvas.height = img.height;
			let ctx = canvas.getContext('2d');
			ctx.drawImage(img, 0, 0, img.width, img.height);
			let pixelData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
			let r = 0, g = 0, b = 0;
			for (let i = 0; i < pixelData.length; i += 4) {
				r += pixelData[i];
				g += pixelData[i + 1];
				b += pixelData[i + 2];
			}
			let count = pixelData.length / 4;
			r = Math.round(r / count);
			g = Math.round(g / count);
			b = Math.round(b / count);
			let hexColor = '#' + ('000000' + ((r << 16) | (g << 8) | b).toString(16)).slice(-6);
			resolve(hexColor);
		};
		img.onerror = function() {
			reject('Error loading image');
		};
		img.src = imageUrl;
	});
}

//Add an event listener to the search button
searchBtn.addEventListener("click", handleSearchBtn);
// Ajouter un événement de pression de touche sur la zone de texte de la recherche
movieNameRef.addEventListener("keyup", function(event) {
	// Vérifier si la touche pressée est "Entrée"
	if (event.key === "Enter") {
		// Appeler la fonction handleSearchBtn
		handleSearchBtn();
	}
});
