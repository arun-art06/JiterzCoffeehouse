var AppData = function() {
	var _endpoints,
    	_initialCards,
    	_announcements,
        _private,
        _itemsBiriyani,
        _itemsDrinks;

	_endpoints = {
		starbucksLocs: {path:"http://www.starbucks.com/api/location.ashx?&features=&lat={LAT}&long={LONG}&limit={MAX}", verb:"GET"},
		starbucksTest: {path:"scripts/testData/starbucksTest.json", verb:"GET"}
	};
    
	_initialCards = [
		{
			"cardNumber":"461253932",
			"amount":20,
			"bonusPoints":60,
			"expireDate": "2013/12/06",
			"name": "veg-biriyani"
		},{
			"cardNumber":"723128745",
			"amount":76,
			"bonusPoints":22,
			"expireDate": "2014/10/16",
			"name": "veg-biriyani"
		},{
			"cardNumber":"912472185",
			"amount":104,
			"bonusPoints":56,
			"expireDate": "2014/11/24"
		}
	];
    
   _itemsBiriyani = [
		{
		    "name": "veg-biriyani",
		    "amount": "25 AED",
		    "photo": "images/best-food.png"
		}, {
		    "name": "Mutton biriyani",
		    "amount": "25 AED",
		    "photo": "images/biriyani1.png"
		}, {
		    "name": "Chicken biriyani",
		    "amount": "25 AED",
		    "photo": "images/biriyani2.png"
		}, {
		    "name": "Doosai",
		    "amount": "7 AED",
		    "photo": "images/food-dosai.png"
		}, {
		    "name": "Idly",
		    "amount": "5 AED / set (2pcs)",
		    "photo": "images/food-idli.png"
		}
   ];

   _itemsDrinks = [
		{
		    "name": "Tomoto Juice",
		    "amount": "3 AED",
		    "photo": "images/drink-tomato.png"
		}, {
		    "name": "Pine Apple Juice",
		    "amount": "15 AED",
		    "photo": "images/drink-pineapple.png"
		}, {
		    "name": "Pine Apple Juice",
		    "amount": "15 AED",
		    "photo": "images/drink-apple.png"
		}, {
		    "name": "Carrot Juice",
		    "amount": "7 AED",
		    "photo": "images/drink-carrot.png"
		}, {
		    "name": "Orange Juice",
		    "amount": "5 AED",
		    "photo": "images/drink-orange.png"
		}
   ];


	_announcements = [
		{ page: 'views/mainItemsView.html', title: "Today special", description: "Wide range of special items like chicken,fish,mutton and forest food.", url: "images/best-food.png" },
		{ page: 'views/mainItemsView.html', title: "Fresh fruit juice", description: "specializes in mixing cold drinks to quench your thirst", url: "images/best-fruit.png" },
		{ page: 'views/mainItemsView.html', title: "Milk shakes", description: "All varity of mile shakes available", url: "images/rewards.png" },
		{ page: 'views/mainItemsView.html', title: "Soups", description: "all our soups tastes like mom made it", url: "images/best-soup.png" },
		{ page: 'views/mainItemsView.html', title: "Hot and Soft drinks", description: "Find and enjoy our, hot and cold drinks anytime", url: "images/love-friend.png" }
	];
    
	_private = {
		load: function(route, options) {
			var path = route.path,
    			verb = route.verb,
    			dfd = new $.Deferred();

			console.log("GETTING", path, verb, options);

			//Return cached data if available (and fresh)
			if (verb === "GET" && _private.checkCache(path) === true) {
				//Return cached data
				dfd.resolve(_private.getCache(path));
			}
			else {
				//Get fresh data
				$.ajax({
					type: verb,
					url: path,
					data: options,
					dataType: "json"
				}).success(function (data, code, xhr) {
					_private.setCache(path, {
						data: data,
						expires: new Date(new Date().getTime() + (15 * 60000)) //+15min
					});
					dfd.resolve(data, code, xhr);
				}).error(function (e, r, m) {
					console.log("ERROR", e, r, m);
					dfd.reject(m);
				});
			}

			return dfd.promise();
		},
        
		checkCache: function(path) {
			var data,
			path = JSON.stringify(path);

			try {
				data = JSON.parse(localStorage.getItem(path));
                
				if (data === null || data.expires <= new Date().getTime()) {
					console.log("CACHE EMPTY", path);
					return false;
				}
			}
			catch (err) {
				console.log("CACHE CHECK ERROR", err);
				return false;
			}

			console.log("CACHE CHECK", true, path);
			return true;
		},
        
		setCache: function(path, data, expires) {
			var cache = {
				data: data,
				expires: expires
			},
			path = JSON.stringify(path);

			//TODO: Serialize JSON object to string
			localStorage.setItem(path, JSON.stringify(cache));

			console.log("CACHE SET", cache, new Date(expires), path);
		},
        
		getCache: function(path) {
			var path = JSON.stringify(path),
			cache = JSON.parse(localStorage.getItem(path));

			console.log("LOADING FROM CACHE", cache, path);

			//TODO: Deserialize JSON string
			return cache.data.data;
		}
	};

	return {
		getStarbucksLocations: function(lat, lng, max) {
			var route = $.extend({}, _endpoints.starbucksLocs);

			route.path = route.path.replace(/{LAT}/g, lat);
			route.path = route.path.replace(/{LONG}/g, lng);
			route.path = route.path.replace(/{MAX}/g, max || 10);

			if (document.location.hostname === "coffee") {
				//Test environment (localhost) - fake response
				route = $.extend({}, _endpoints.starbucksTest);
			}

			return _private.load(route, {});
		},
        
		getInitialCards: function() {
			return JSON.stringify(_initialCards);
		},
        
		getAnnouncements: function() {
		    return _announcements;
		},

		getBiriyani: function() {
		    return _itemsBiriyani;
		},

		getDrinks: function() {
		    return _itemsDrinks;
		}
        
        
	};
}