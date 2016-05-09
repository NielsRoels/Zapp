var latitude = "";
var longitude = "";
var perimeter = "";
var perimeterval = "";
var color1 = "#835fa5";
var color2 = "#da905e";
var color3 = "#9ac856";
var color4 = "#4a5a94";
var color5 = "#d5c956";
var color6 = "#276f72";
var primaryTextColor = "white";
var seenSuggestion = 0;
var seenSuggestions = [];
var map_options = "";
var circle = "";
var map = "";
var from = "";
var to = "";
var dist = 0;

/* GET CURRENT LOCATION OF USER*/
var getLocation = function(){
	if(navigator.geolocation){
    	navigator.geolocation.getCurrentPosition(showPosition);
  	} else {
		console.log("Geolocation is not supported your browser");
	}		
}

var showPosition = function(position){
	latitude = position.coords.latitude;
	longitude = position.coords.longitude;
	console.log("Latitude: " + latitude);
	console.log("Longitude: "  + longitude);
}

$(document).ready(function(){
	var socket = io.connect('http://localhost:3000');

	$("#choice__link__1").on("click", function(e){
		localStorage.choice = "Home";
		localStorage.acceptLat = localStorage.getItem('latitude');
		localStorage.acceptLong = localStorage.getItem('longitude');
		var from = new google.maps.LatLng(localStorage.latitude, localStorage.longitude);
  		var to = new google.maps.LatLng(localStorage.acceptLat, localStorage.acceptLong);
  		var dist = (google.maps.geometry.spherical.computeDistanceBetween(from, to)).toFixed(0);
  		localStorage.distance = dist;
  		if(localStorage.distance > 1000)
  		{
  			$(".route__menu__p--distance").text((localStorage.distance/1000).toFixed(1)+"km");
  		} else {
  			$(".route__menu__p--distance").text(localStorage.distance+"m");
  		}

  		if(localStorage.distance < 50){
  			window.location.href="/choice/destination";
  		} else {
  			window.location.href="/choice/route";
  		}
		e.preventDefault();
	});

	$("#choice__link__2").on("click", function(e){
		localStorage.choice = "Restaurant";
		window.location.href="/choice/suggestion";
		e.preventDefault();
	});

	$("#choice__link__3").on("click", function(e){
		localStorage.choice = "Bar";
		window.location.href="/choice/suggestion";
		e.preventDefault();
	});

	$("#choice__link__4").on("click", function(e){
		localStorage.choice = "Landmark";
		window.location.href="/choice/suggestion";
		e.preventDefault();
	});

	$("#choice__link__5").on("click", function(e){
		localStorage.choice = "Museum";
		window.location.href="/choice/suggestion";
		e.preventDefault();
	});

	$("#choice__link__6").on("click", function(e){
		localStorage.choice = "Add";
		window.location.href="/add/";
		e.preventDefault();
	});

	$("#backRoute").on("click", function(e){
		window.location.href="/choice";
		e.preventDefault();
	});

	$("#addForm").on("submit", function(){
		var theme = $("#theme").val();
		var location = $("#location").val();
		var picture = /*$("#picture").val();*/ "/images/" + ($("#spotPic").val()).replace('C:\\fakepath\\', '');
		var adress = $("#adress").val();
		var description = $("#description").val();
		var latitudeloc = parseFloat($(".add__lat").text());
		var longitudeloc = parseFloat($(".add__long").text());
		var coordinates = [latitudeloc, longitudeloc];

		socket.emit("addSpot", {location: location, adress: adress, description: description, coordinates: coordinates, picture: picture, theme: theme});
		
		$(this).ajaxSubmit({
			error: function(xhr){
				status('Error: ' + xhr.status);
			},
			success: function(response){
				console.log(response);
			}
		});
		return false;
	});

	$(".suggestion__body").on("click", function(){
		var target = $(event.target);
		if(target.is('div')){
			$(".suggestion__body__container__article").fadeIn("slow");
		}
	});
	$(".suggestion__close").on("click", function(){
		$(".suggestion__body__container__article").fadeOut("slow");
	});

	socket.on("show", function(data){
		seenSuggestion++;
		var suggestions = data.length;
		console.log(suggestions);
		if(seenSuggestion <= suggestions){
			var random = Math.floor(Math.random()*suggestions);
			while($.inArray(random, seenSuggestions) > -1)
            {
                random = Math.floor(Math.random()*suggestions);
            }
            console.log(dist);
  			var suggestion = data[random];

			console.log(suggestion);
			localStorage.suggestionLat = suggestion.coordinates[0];
			localStorage.suggestionLong = suggestion.coordinates[1];
			console.log(suggestion.picture);
			from = new google.maps.LatLng(localStorage.latitude, localStorage.longitude);
  			to   = new google.maps.LatLng(localStorage.suggestionLat, localStorage.suggestionLong);
  			dist = (google.maps.geometry.spherical.computeDistanceBetween(from, to)).toFixed(0);
  			localStorage.distance = dist;

  			showdist = parseInt(dist);
  			showperimeter = parseInt(localStorage.perimeter);

  			if(showdist > showperimeter){
  				console.log(dist);
  				console.log(localStorage.perimeter);  				
  				console.log("Woops, way to far!");
  				switch(localStorage.choice)
				{
					case "Restaurant":
						socket.emit("goEat",{theme: localStorage.choice});
						break;
					case "Bar":
						socket.emit("goDrink",{theme: localStorage.choice});
						break;
					case "Landmark":
						socket.emit("goSee",{theme: localStorage.choice});
						break;
					case "Museum":
						socket.emit("goCulture",{theme: localStorage.choice});
					break;
				}
  			} else {
  				console.log(dist);
  				console.log(localStorage.perimeter);
  				console.log("Hey, you're welcome!");
            	$(".suggestion__title").text(suggestion.location);
				$(".suggestion__adress").text(suggestion.adress);
				$(".suggestion__description").text(suggestion.description);
				$(".suggestion__body").css("background-image", "url("+suggestion.picture+")");  				
  				$(".suggestion__lat").val(localStorage.suggestionLat);
				$(".suggestion__long").val(localStorage.suggestionLong);
  				if(localStorage.distance > 1000)
  				{
  					$(".suggestion__menu__p--distance").text((localStorage.distance/1000).toFixed(1)+"km");
  				} else {
  					$(".suggestion__menu__p--distance").text(localStorage.distance+"m");
  				}
  			}

  			seenSuggestions.push(random);
		} else {
			window.location.href= "/choice/outofoptions";
		}
	});

	$("#acceptedBtn").on('click', function(e){
		localStorage.acceptLat = $('.suggestion__lat').val();
		localStorage.acceptLong = $('.suggestion__long').val();
		e.preventDefault();
		window.location.href="/choice/route";
	});

	$("#declinedBtn").on('click', function(e){
		switch(localStorage.choice)
		{
			case "Restaurant":
				socket.emit("goEat",{theme: localStorage.choice});
				break;
			case "Bar":
				socket.emit("goDrink",{theme: localStorage.choice});
				break;
			case "Landmark":
				socket.emit("goSee",{theme: localStorage.choice});
				break;
			case "Museum":
				socket.emit("goCulture",{theme: localStorage.choice});
				break;
		}
		e.preventDefault();
	});
});