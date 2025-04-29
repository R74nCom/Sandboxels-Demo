"dirt": {
	color: ["#76552b","#5c4221","#573c1a","#6b481e"],
	behavior: behaviors.POWDER,
	reactions: {
		"water":{elem1:"mud",elem2:null},
		"salt_water":{elem1:"mud",elem2:null},
		"sugar_water":{elem1:"mud",elem2:null},
		"seltzer":{elem1:"mud",elem2:null},
		"dirty_water":{elem1:"mud",elem2:null},
		"pool_water":{elem1:"mud",elem2:null},
		"slush":{elem1:"mud",elem2:null},
		"soda":{elem1:"mud",elem2:null},
		"juice":{elem1:"mud",elem2:null},
		"milk":{elem1:"mud",elem2:null},
		"chocolate_milk":{elem1:"mud",elem2:null},
		"fruit_milk":{elem1:"mud",elem2:null},
		"pilk":{elem1:"mud",elem2:null},
		"eggnog":{elem1:"mud",elem2:null},
		"nut_milk":{elem1:"mud",elem2:null},
		"cream":{elem1:"mud",elem2:null},
		"vinegar":{elem1:"mud",elem2:null},
		"blood":{elem1:"mud",elem2:null},
		"vaccine":{elem1:"mud",elem2:null},
		"antibody":{elem1:"mud",elem2:null},
		"infection":{elem1:"mud",elem2:null},
		"poison":{elem1:"mud",elem2:null},
		"antidote":{elem1:"mud",elem2:null},
		"bone": { elem1:"rock", chance:0.001, oneway:true },
	},
	tempHigh:1200,
	tempLow: -50,
	stateLow: "permafrost",
	category:"land",
	state: "solid",
	density: 1220
},
"mud": {
	color: "#382417",
	behavior: behaviors.STURDYPOWDER,
	reactions: {
		"dirt": { elem1:"dirt", elem2:"mud", chance:0.0005, oneway:true },
		"sand": { elem1:"dirt", elem2:"wet_sand", chance:0.0005, oneway:true },
		"sawdust": { elem1:"mulch", "elem2":null },
		"evergreen": { elem1:"mulch", "elem2":null },
		"wheat": { elem1:"adobe", "elem2":"adobe" },
		"straw": { elem1:"adobe", "elem2":"adobe" },
		"flour": { elem1:"adobe", "elem2":"adobe" },
	},
	tempHigh: 100,
	stateHigh: "mudstone",
	onStateHigh: function(pixel) {
		releaseElement(pixel,"steam");
	},
	tempLow: -50,
	stateLow: "permafrost",
	category: "land",
	state: "solid",
	density: 1730,
	stain: 0.02
},
"rock": {
	color: ["#808080","#4f4f4f","#949494"],
	behavior: behaviors.POWDER,
	reactions: {
		"fly": { elem2:"dead_bug", chance:0.25, oneway:true },
		"firefly": { elem2:"dead_bug", chance:0.2, oneway:true },
		"stink_bug": { elem2:"dead_bug", chance:0.15, oneway:true },
		"bee": { elem2:"dead_bug", chance:0.1, oneway:true },
		"bird": { elem2:"feather", chance:0.025, oneway:true },
		"egg": { elem2:"yolk", oneway:true },
		"grass": { elem2:null, chance:0.005, oneway:true },
		"bone": { elem2:"oil", tempMin:300, chance:0.005, oneway:true },
		"dead_plant": { elem2:"charcoal", tempMin:200, chance:0.005, oneway:true },
		"charcoal": { elem2:"diamond", tempMin:800, tempMax:900, chance:0.005, oneway:true },
		"sand": { elem2:"packed_sand", tempMin:500, chance:0.005, oneway:true },
		"wet_sand": { elem2:"packed_sand", chance:0.005, oneway:true },
	},
	tempHigh: 950,
	stateHigh: "magma",
	category: "land",
	state: "solid",
	density: 2550,
	hardness: 0.5,
	breakInto: ["sand","gravel"]
},
"rock_wall": {
	color: ["#666666","#363636","#7a7a7a"],
	behavior: behaviors.WALL,
	tool: function(pixel) {
		if (pixel.element === "sun") {
			pixel.eclipse = true;
			if (Math.random() < 0.1) {
				changePixel(pixel,"rock_wall");
				pixel.temp = 20;
				pixel.color = pixelColorPick(pixel,"#301B16")
			}
		}
	},
	canPlace: true,
	tempHigh: 950,
	stateHigh: "magma",
	category: "land",
	state: "solid",
	density: 2550,
	hardness: 0.5,
	breakInto: "rock"
},
"plant": {
	color: "#00bf00",
	behavior: behaviors.WALL,
	reactions: {
		"vinegar": { elem1:"dead_plant", elem2:null, chance:0.035 },
		"baking_soda": { elem1:"dead_plant", elem2:null, chance:0.01 },
		"bleach": { elem1:"dead_plant", elem2:null, chance:0.05 },
		"alcohol": { elem1:"dead_plant", elem2:null, chance:0.035 },
		"mercury": { elem1:"dead_plant", elem2:null, chance:0.01 },
		"salt": { elem1:"dead_plant", elem2:null, chance:0.001 },
		"stench": { elem2:null, chance:0.25 },
		"chlorine": { stain1:"#a2bf00" },
	},
	renderer: renderPresets.PLANTCHAR,
	category:"life",
	tempHigh: 100,
	stateHigh: "dead_plant",
	tempLow: -1.66,
	stateLow: "frozen_plant",
	burn:15,
	burnTime:60,
	burnInto: "dead_plant",
	breakInto: "dead_plant",
	state: "solid",
	density: 1050,
	forceSaveColor: true
},
"grass": {
	color: ["#439809","#258b08","#118511","#127b12","#136d14"],
	tick: function(pixel) {
		if (!tryMove(pixel,pixel.x,pixel.y+1)) {
			if (pixel.h < 2 && Math.random() < 0.0005 && isEmpty(pixel.x,pixel.y-1)) {
				createPixel(pixel.element,pixel.x,pixel.y-1);
				pixelMap[pixel.x][pixel.y-1].h = pixel.h+1;
			}
			var coords = [
				[pixel.x+1,pixel.y],
				[pixel.x-1,pixel.y],
				[pixel.x+1,pixel.y+1],
				[pixel.x-1,pixel.y+1],
			];
			for (var i = 0; i < coords.length; i++) {
				if (Math.random() < 0.005 && isEmpty(coords[i][0],coords[i][1])) {
					if (!isEmpty(coords[i][0],coords[i][1]+1,true)) {
						var soil = pixelMap[coords[i][0]][coords[i][1]+1];
						if (eLists.SOIL.indexOf(soil.element) !== -1) {
							createPixel(pixel.element,coords[i][0],coords[i][1]);
						}
					}
				}
			}
		}
		doDefaults(pixel);
	},
	renderer: renderPresets.PLANTCHAR,
	properties: {
		"h": 0
	},
	reactions: {
		"vinegar": { elem1:"dead_plant", elem2:null, chance:0.035 },
		"mercury": { elem1:"dead_plant", elem2:null, chance:0.01 },
		"alcohol": { elem1:"dead_plant", elem2:null, chance:0.035 },
		"baking_soda": { elem1:"dead_plant", elem2:null, chance:0.01 },
	},
	tempHigh: 100,
	stateHigh: "dead_plant",
	tempLow: -2,
	stateLow: "frozen_plant",
	burn:3,
	burnTime:20,
	breakInto: "dead_plant",
	category:"life",
	state: "solid",
	density: 1400,
	seed: "grass_seed"
},
"algae": {
	color: ["#395706","#6f9315","#9dca19"],
	behavior: [
		"XX|XX|XX",
		"SW:water,salt_water,dirty_water,sugar_water%1|XX|SW:water,salt_water,dirty_water,sugar_water%1",
		"M2%10|M1|M2%10",
	],
	tick: function(pixel) {
		if (Math.random() < 0.01 && !isEmpty(pixel.x+1,pixel.y+1,true) && isEmpty(pixel.x+1,pixel.y)) {
			var newPixel = pixelMap[pixel.x+1][pixel.y+1];
			if (newPixel.element !== "algae" && elements[newPixel.element].state === "liquid") {
				createPixel(pixel.element,pixel.x+1,pixel.y);
			}
		}
		if (Math.random() < 0.01 && !isEmpty(pixel.x-1,pixel.y+1,true) && isEmpty(pixel.x-1,pixel.y)) {
			var newPixel = pixelMap[pixel.x-1][pixel.y+1];
			if (newPixel.element !== "algae" && elements[newPixel.element].state === "liquid") {
				createPixel(pixel.element,pixel.x-1,pixel.y);
			}
		}
		doDefaults(pixel);
	},
	reactions: {
		"wood": { elem1:"lichen" },
		"chlorine": { elem1:"dead_plant", elem2:null, chance:0.035 },
		"baking_soda": { elem1:"dead_plant", elem2:null, chance:0.035 },
		"bleach": { elem1:"dead_plant", elem2:null, chance:0.035 },
		"mercury": { elem1:"dead_plant", elem2:null, chance:0.035 },
		"broth": { elem2:"water", chance:0.05 },
		"tea": { elem2:"water", chance:0.05 },
		"nitrogen": { elem2:"algae", chance:0.05 },
		"water": { elem2:"foam", attr2:{"clone":"water"}, color2:"#e3d8ca", chance:0.001 },
		"salt_water": { elem2:"foam", attr2:{"clone":"salt_water"}, color2:"#e3d8ca", chance:0.001 }
	},
	category:"life",
	tempHigh: 70,
	stateHigh: "dead_plant",
	tempLow: 0,
	stateLow: "frozen_plant",
	burn:95,
	burnTime:20,
	state: "liquid",
	density: 920,
	seed: "algae"
},
"concrete": {
	color: "#ababab",
	behavior: behaviors.SUPPORT,
	tempHigh: 1500,
	stateHigh: "magma",
	category: "powders",
	state: "solid",
	density: 2400,
	hardness: 0.5,
	breakInto: "dust",
	darkText: true
},
"wall": {
	color: "#808080",
	behavior: behaviors.WALL,
	category: "solids",
	insulate: true,
	hardness: 1,
	noMix: true,
	alias: "solid"
},
"fire": {
	color: ["#ff6b21","#ffa600","#ff4000"],
	tick: function(pixel){
		if (pixel.start === pixelTicks) {return}
		let move1Spots = adjacentCoords.slice(0);
		let moved = false;
		for (var i = 0; i < move1Spots.length; i++) {
			const j = Math.random()*move1Spots.length | 0;
			const coords = move1Spots[j];
			const x = pixel.x+coords[0];
			const y = pixel.y+coords[1];
			if (!isEmpty(x, y, true) && elements[pixelMap[x][y].element].fireColor) {
				pixel.color = pixelColorPick(pixel,elements[pixelMap[x][y].element].fireColor);
				pixel.origColor = undefined;
				pixel.cc = true;
			}
			if (tryMove(pixel, x, y)) { moved = true; break; }
			move1Spots.splice(j, 1);
		}
		if (!moved) {
			let move2Spots = diagonalCoords.slice(0);
			for (var i = 0; i < move2Spots.length; i++) {
				const j = Math.random()*move2Spots.length | 0;
				const coords = move2Spots[j];
				if (tryMove(pixel, pixel.x+coords[0], pixel.y+coords[1])) { break; }
				move2Spots.splice(j, 1);
			}
		}
		doDefaults(pixel);
	
		if (!pixel.del && settings.burn===0 && (pixelTicks-pixel.start > 70) && Math.random() < 0.1 ) { changePixel(pixel,"smoke") }
	},
	tool: function(pixel) {
		if (pixel.temp >= elements.fire.temp || elements[pixel.element].insulate) {return;}
		pixel.temp += elements.fire.temp/(elements[pixel.element].extinguish ? 240 : 60);
		pixelTempCheck(pixel);
	},
	canPlace: true,
	renderer: renderPresets.HUESHIFT,
	reactions: {
		"water": { elem1: "smoke" },
		"steam": { elem1: "smoke" },
		"carbon_dioxide": { elem1: "smoke" },
		"foam": { elem1: "smoke" },
		"dirty_water": { elem1: "smoke" },
		"salt_water": { elem1: "smoke" },
		"sugar_water": { elem1: "smoke" },
		"seltzer": { elem1: "smoke" },
		"pool_water": { elem1: "smoke" },
		"smoke": { elem2: null, chance:0.1 },
		"oxygen": { elem2: null, chance:0.1 },
	},
	temp:600,
	tempLow:100,
	stateLow: "smoke",
	tempHigh: 7000,
	stateHigh: "plasma",
	category: "energy",
	burning: true,
	burnTime: 25,
	burnInto: "smoke",
	state: "gas",
	density: 0.1,
	noMix: true
},
"bomb": {
	color: "#524c41",
	behavior: [
		"XX|EX:10|XX",
		"XX|XX|XX",
		"M2|M1 AND EX:10|M2",
	],
	category: "weapons",
	state: "solid",
	density: 1300,
	excludeRandom: true,
	cooldown: defaultCooldown
},
"steam": {
	color: "#abd6ff",
	behavior: behaviors.GAS,
	tick: function(pixel) {
		if (pixel.temp > 3000 && Math.random() < 0.01) {
			changePixel(pixel,Math.random() < 0.5 ? "hydrogen" : "oxygen");
		}
	},
	reactions: {
		"steam": { elem1: "cloud", elem2: "cloud", chance:0.05, "y":[0,15], "setting":"clouds" },
		"rain_cloud": { elem1: "rain_cloud", chance:0.4, "y":[0,12], "setting":"clouds" },
		"cloud": { elem1: "cloud", chance:0.4, "y":[0,12], "setting":"clouds" },
		"snow_cloud": { elem1: "rain_cloud", chance:0.4, "y":[0,12], "setting":"clouds" },
		"hail_cloud": { elem1: "rain_cloud", chance:0.4, "y":[0,12], "setting":"clouds" },
		"thunder_cloud": { elem1: "rain_cloud", chance:0.4, "y":[0,12], "setting":"clouds" },
		"pyrocumulus": { elem1: "cloud", chance:0.4, "y":[0,12], "setting":"clouds" },
		"anesthesia": { elem1:"acid_cloud", elem2:null, chance:0.05, "y":[0,12], "setting":"clouds" },
		"fire_cloud": { elem1: "cloud", elem2: "pyrocumulus", chance:0.4, "y":[0,12], "setting":"clouds" },
		"smoke": { elem1: "smog", elem2: null, chance:0.001 },
		"carbon_dioxide": { elem1: "smog", elem2: null, chance:0.001 },
		"plasma": { elem1:"ozone", tempMin:500, charged:true },
		"copper": { elem1:"oxygen", elem2:"oxidized_copper", chance:0.01 },
		"bronze": { elem1:"oxygen", elem2:"oxidized_copper", chance:0.005 },
		"iron": { elem1:"oxygen", elem2:"rust", chance:0.005 },
		"steel": { elem1:"oxygen", elem2:"rust", chance:0.004 },
		"tornado":{elem1:"cloud"},
		"melted_wax": { elem1:"explosion" }
	},
	temp: 150,
	tempLow: 95,
	extraTempLow: {
		0: "rime"
	},
	stateLow: "water",
	category: "gases",
	state: "gas",
	density: 0.6,
	conduct: 0.002,
	stain: -0.05,
	alias: "water vapor",
	extinguish: true
},
"ice": {
	color: "#b2daeb",
	behavior: behaviors.WALL,
	temp: -5,
	tempHigh: 5,
	stateHigh: "water",
	category: "solids",
	state: "solid",
	density: 917,
	breakInto: "snow"
},
"snow": {
	color: "#e1f8fc",
	behavior: behaviors.POWDER,
	reactions: {
		"water": { elem1:"slush", elem2:"slush" },
		"salt_water": { elem1:"slush", elem2:"slush" },
		"dirty_water": { elem1:"slush", elem2:"slush" },
		"pool_water": { elem1:"slush", elem2:"slush" },
		"sugar_water": { elem1:"slush", elem2:"slush" },
		"seltzer": { elem1:"slush", elem2:"slush" },
		"uranium": { elem1:"dirty_water", chance:0.001 },
	},
	temp: -5,
	tempHigh: 18,
	tempLow: -100,
	stateLow: "packed_snow",
	stateHigh: "water",
	category: "land",
	state: "solid",
	density: 100
},
"wood": {
	color: "#a0522d",
	behavior: behaviors.WALL,
	renderer: renderPresets.WOODCHAR,
	tempHigh: 400,
	stateHigh: ["ember","charcoal","fire","fire","fire"],
	category: "solids",
	burn: 5,
	burnTime: 300,
	burnInto: ["ember","charcoal","fire"],
	state: "solid",
	hardness: 0.15,
	breakInto: "sawdust",
	forceSaveColor: true
},
"smoke": {
	color: "#383838",
	behavior: behaviors.DGAS,
	reactions: {
		"steam": { elem1: "pyrocumulus", chance:0.08, "y":[0,12], "setting":"clouds" },
		"rain_cloud": { elem1: "pyrocumulus", chance:0.08, "y":[0,12], "setting":"clouds" },
		"cloud": { elem1: "pyrocumulus", chance:0.08, "y":[0,12], "setting":"clouds" },
		"snow_cloud": { elem1: "pyrocumulus", chance:0.08, "y":[0,12], "setting":"clouds" },
		"hail_cloud": { elem1: "pyrocumulus", chance:0.08, "y":[0,12], "setting":"clouds" },
		"thunder_cloud": { elem1: "pyrocumulus", chance:0.08, "y":[0,12], "setting":"clouds" },
		"acid_cloud": { elem1: "pyrocumulus", chance:0.05, "y":[0,12], "setting":"clouds" },
		"fire_cloud": { elem1: "pyrocumulus", chance:0.05, "y":[0,12], "setting":"clouds" },
		"rad_cloud": { elem1: "pyrocumulus", chance:0.05, "y":[0,12], "setting":"clouds" },
		"pyrocumulus": { elem1: "pyrocumulus", chance:0.08, "y":[0,12], "setting":"clouds" }
	},
	temp: 114,
	tempHigh: 1000,
	stateHigh: "fire",
	category: "gases",
	state: "gas",
	density: 0.1,
	stain: 0.075,
	noMix: true
},
"magma": {
	color: ["#ff6f00","#ff8c00","#ff4d00"],
	behavior: behaviors.MOLTEN,
	renderer: renderPresets.MOLTEN,
	reactions: {
		"ice": { elem1: "basalt" },
		"ash": { elem1: "molten_tuff", "elem2":null },
		"molten_ash": { elem1: "molten_tuff", "elem2":null },
		"charcoal": { elem2:"diamond", tempMin:800, tempMax:900, chance:0.005, oneway:true },
	},
	temp: 1200,
	tempLow: 800,
	stateLow: ["basalt","basalt","basalt","rock"],
	viscosity: 10000,
	category: "liquids",
	state: "liquid",
	density: 2725,
	alias: "lava"
},
"plasma": {
	color: ["#8800ff","#b184d9","#8800ff"],
	behavior: behaviors.DGAS,
	behaviorOn: [
		"M2|M1|M2",
		"CL%5 AND M1|XX|CL%5 AND M1",
		"M2|M1|M2",
	],
	temp:7065,
	tempLow:5000,
	stateLow: "fire",
	category: "energy",
	state: "gas",
	density: 1,
	//charge: 0.5,
	conduct: 1
},
"cold_fire": {
	color: ["#21cbff","#006aff","#00ffff"],
	tick: function(pixel){
		behaviors.GAS(pixel);
		if (!pixel.del && Math.random() < 0.08 ) { changePixel(pixel,"smoke") }
	},
	tool: function(pixel) {
		if (pixel.temp <= elements.cold_fire.temp || elements[pixel.element].insulate) {return;}
		pixel.temp += elements.cold_fire.temp/(elements[pixel.element].extinguish ? 240 : 60);
		pixelTempCheck(pixel);
	},
	canPlace: true,
	reactions: {
		"fire": { elem1: "smoke", elem2: "smoke" },
		"plasma": { elem1: "light", elem2: "light" },
		"smoke": { elem2: null, chance:0.1 },
	},
	renderer: renderPresets.HUESHIFT,
	temp:-200,
	tempHigh:0,
	stateHigh: "smoke",
	category: "energy",
	state: "gas",
	density: 0.1
},
"glass": {
	color: ["#5e807d","#5e807d","#679e99","#5e807d","#5e807d"],
	colorPattern: textures.GLASS,
	colorKey: {
		"g": "#5e807d",
		"s": "#638f8b",
		"S": "#679e99"},
	renderer: renderPresets.BORDER,
	behavior: behaviors.WALL,
	reactions: {
		"radiation": { elem1:"rad_glass", chance:0.33 },
		"rad_steam": { elem1:"rad_glass", elem2:null, chance:0.33 },
		"fallout": { elem1:"rad_glass", elem2:"radiation", chance:0.1 },
		"uranium": { elem1:"rad_glass", chance:0.01 }
	},
	tempHigh: 1500,
	category: "solids",
	state: "solid",
	density: 2500,
	breakInto: "glass_shard",
	noMix: true,
	grain: 0
},
"meat": {
	color: ["#9e4839","#ba6449","#d2856c","#a14940"],
	behavior: [
		"XX|XX|XX",
		"SP|XX|SP",
		"XX|M1|XX",
	],
	reactions: {
		"dirty_water": { elem1:"rotten_meat", chance:0.1 },
		"fly": { elem1:"rotten_meat", chance:0.2 },
		"dioxin": { elem1:"rotten_meat", elem2:null, chance:0.1 },
		"uranium": { elem1:"rotten_meat", chance:0.1 },
		"cancer": { elem1:"rotten_meat", chance:0.1 },
		"plague": { elem1:"rotten_meat", elem2:null, chance:0.3 },
		"ant": { elem1:"rotten_meat", chance:0.1 },
		"worm": { elem1:"rotten_meat", chance:0.1 },
		"rat": { elem1:"rotten_meat", chance:0.3 },
		"mushroom_spore": { elem1:"rotten_meat", chance:0.1 },
		"mushroom_stalk": { elem1:"rotten_meat", chance:0.1 },
		"mycelium": { elem1:"rotten_meat", chance:0.1 },
		"hyphae": { elem1:"rotten_meat", chance:0.1 },
		"mercury": { elem1:"rotten_meat", elem2:null, chance:0.2 },
		"mercury_gas": { elem1:"rotten_meat", elem2:null, chance:0.1 },
		"virus": { elem1:"rotten_meat", chance:0.1 },
		"poison": { elem1:"rotten_meat", elem2:null, chance:0.5 },
		"infection": { elem1:"rotten_meat", elem2:null, chance:0.1 },
		"ink": { elem1:"rotten_meat", elem2:null, chance:0.1 },
		"acid": { elem1:"rotten_meat", elem2:null, chance:0.5 },
		"acid_gas": { elem1:"rotten_meat", chance:0.4 },
		"cyanide": { elem1:"rotten_meat", elem2:null, chance:0.5 },
		"cyanide_gas": { elem1:"rotten_meat", elem2:null, chance:0.5 },
		"rotten_cheese": { elem1:"rotten_meat", chance:0.02 },
		"fallout": { elem1:"rotten_meat", chance:0.2 },
		"water": { elem2:"broth", tempMin:70 },
		"salt_water": { elem2:"broth", tempMin:70 },
		"sugar_water": { elem2:"broth", tempMin:70 },
		"seltzer": { elem2:"broth", tempMin:70 },
		"salt": { elem1:"cured_meat" },
		"vinegar": { elem1:"cured_meat", chance:0.1 },
	},
	tempHigh: 100,
	stateHigh: "cooked_meat",
	tempLow: -18,
	stateLow: "frozen_meat",
	category:"food",
	burn:15,
	burnTime:200,
	burnInto:"cooked_meat",
	state: "solid",
	density: 1019.5,
	conduct: 0.2,
	isFood: true
},
"salt": {
	color: ["#f2f2f2","#e0e0e0"],
	behavior: behaviors.POWDER,
	reactions: {
		"ice": { elem1:null, elem2:"salt_water", chance:0.1 },
		"rime": { elem1:null, elem2:"salt_water", chance:0.075 },
		"snow": { elem1:null, elem2:"salt_water", chance:0.25 },
		"packed_snow": { elem1:null, elem2:"salt_water", chance:0.05 },
		"packed_ice": { elem1:null, elem2:"salt_water", chance:0.01 }
	},
	category: "food",
	tempHigh: 801,
	state: "solid",
	density: 2160,
	fireColor: "#F1E906",
	alias: "sodium chloride"
},
"sugar": {
	color: "#f2f2f2",
	behavior: behaviors.POWDER,
	reactions: {
		"grape": { elem1:null, elem2:"jelly", chance:0.005, tempMin:100 },
	},
	category: "food",
	tempHigh: 186,
	stateHigh: "caramel",
	state: "solid",
	density: 1590,
	isFood: true
},
"flour": {
	color: ["#f0e2b7","#f0e4c0","#ded1ab"],
	behavior: behaviors.POWDER,
	reactions: {
		"water": { elem1: "dough", elem2: null },
		"salt_water": { elem1: "dough", elem2: null },
		"sugar_water": { elem1: "dough", elem2: null },
		"seltzer": { elem1: "dough", elem2: null },
		"pool_water": { elem1: "dough", elem2: null },
		"juice": { elem1: "dough", elem2: null },
		"vinegar": { elem1: "dough", elem2: null },
		"yolk": { elem1: "batter", elem2: null },
		"yogurt": { elem1: "batter", elem2: null },
		"honey": { elem1:"gingerbread", elem2:null },
		"molasses": { elem1:"gingerbread", elem2:null },
		"sap": { elem1:"gingerbread", elem2:null },
		"caramel": { elem1:"gingerbread", elem2:null },
		"broth": { elem1:"dough", elem2:null },
		"soda": { elem1:"dough", elem2:null },
		"tea": { elem1:"dough", elem2:null },
		"blood": { elem1:"dough", elem2:null },
		"infection": { elem1:"dough", elem2:null },
		"antibody": { elem1:"dough", elem2:null },
		"milk": { elem1:"dough", elem2:null },
		"cream": { elem1:"dough", elem2:null },
	},
	category: "food",
	tempHigh: 400,
	stateHigh: "fire",
	burn:40,
	burnTime:25,
	state: "solid",
	density: 600,
	isFood: true
},
"wire": {
	color: "#4d0a03",
	behavior: behaviors.WALL,
	category: "machines",
	insulate: true,
	conduct: 1,
	noMix: true,
	// ignoreConduct:["ecloner"],
},
"battery": {
	color: "#9c6c25",
	behavior: [
		"XX|SH|XX", // shocks (adds charge)
		"SH|XX|SH",
		"XX|SH|XX",
	],
	category: "machines",
	tempHigh: 1455.5,
	stateHigh: ["molten_steel","explosion","acid_gas"]
},
"cloner": {
	color: "#dddd00",
	behavior: behaviors.CLONER,
	ignore: ["ecloner","slow_cloner","clone_powder","floating_cloner","wall","ewall"],
	category:"machines",
	insulate:true,
	hardness: 1,
	darkText: true,
},
"heater": {
	color: "#881111",
	behavior: [
		"XX|HT:2|XX",
		"HT:2|XX|HT:2",
		"XX|HT:2|XX",
	],
	category:"machines",
	insulate:true
},
"cooler": {
	color: "#111188",
	behavior: [
		"XX|CO:2|XX",
		"CO:2|XX|CO:2",
		"XX|CO:2|XX",
	],
	category:"machines",
	insulate:true
},
"smash": {
	color: ["#666666","#888888","#666666"],
	tool: function(pixel) {
		let old = pixel.element;
		if (isBreakable(pixel)) {
			// times 0.25 if not shiftDown else 1
			if (Math.random() < (1-(elements[pixel.element].hardness || 0)) / (shiftDown ? 1 : 4)) {
				breakPixel(pixel);
			}
			// if (Math.random() > ((1-(elements[pixel.element].hardness || 1)) * (shiftDown ? 0.5 : 1))) {
		}
		else if (old === pixel.element && elements[pixel.element].movable && !isEmpty(pixel.x,pixel.y+1) && !paused) {
			let x = 0; let y = 0;
			if (Math.random() < 0.66) x = Math.random() < 0.5 ? 1 : -1;
			if (Math.random() < 0.66) y = Math.random() < 0.5 ? 1 : -1;
			tryMove(pixel,pixel.x+x,pixel.y+y)
		}
	},
	category: "tools",
	excludeRandom: true,
	desc: "Use on pixels to break them, if possible."
},
"cement": {
	color: "#b5b5b5",
	behavior: behaviors.LIQUID,
	tick: function(pixel) {
		if (pixelTicks - pixel.start > 100 && Math.random() < 0.1) {
			changePixel(pixel,"concrete")
		}
	},
	onMix: function(pixel) {
		pixel.start = pixelTicks;
	},
	category:"liquids",
	tempHigh: 1550,
	stateHigh: "magma",
	tempLow: -10,
	stateLow: "concrete",
	state: "solid",
	density: 1440,
	hardness: 0.1,
	viscosity: 1000,
	darkText: true
},
"dust": {
	color: "#666666",
	behavior: behaviors.POWDER,
	category: "powders",
	burn: 10,
	burnTime: 1,
	tempHigh: 425,
	stateHigh: "fire",
	state: "solid",
	density: 1490
},
"void": {
	color: "#262626",
	tick: function(pixel) {
		for (var i = 0; i < adjacentCoords.length; i++) {
			var x = pixel.x+adjacentCoords[i][0];
			var y = pixel.y+adjacentCoords[i][1];
			if (!isEmpty(x,y,true)) {
				var newPixel = pixelMap[x][y];
				if (elements[newPixel.element].hardness === 1) { continue; }
				deletePixel(x,y);
			}
		}
		doDefaults(pixel);
	},
	category:"special",
	hardness: 1,
	excludeRandom: true,
	movable: false,
	insulate: true
},
"worm": {
	color: "#d34c37",
	behavior: [
		"SW:dirt,sand,gravel,ash,mycelium,mud,wet_sand,clay_soil,water,salt_water,dirty_water,primordial_soup,blood,infection,color_sand%3|XX|SW:dirt,sand,gravel,ash,mycelium,mud,wet_sand,clay_soil,water,salt_water,dirty_water,primordial_soup,blood,infection,color_sand%3",
		"M2%10|XX|M2%10",
		"SW:dirt,sand,gravel,ash,mycelium,mud,wet_sand,clay_soil,water,salt_water,dirty_water,primordial_soup,blood,infection,color_sand%3|M1|SW:dirt,sand,gravel,ash,mycelium,mud,wet_sand,clay_soil,water,salt_water,dirty_water,primordial_soup,blood,infection,color_sand%3",
	],
	reactions: {
		"ash": { elem2:[null,null,null,null,null,null,null,null,null,null,"dirt"], chance:0.1, func:behaviors.FEEDPIXEL },
		"crumb": { elem2:[null,null,null,null,null,null,null,null,null,null,"dirt"], chance:0.1, func:behaviors.FEEDPIXEL },
		"feather": { elem2:[null,null,null,null,"dirt"], chance:0.1, func:behaviors.FEEDPIXEL },
		"root": { elem2:"dirt", chance:0.1, func:behaviors.FEEDPIXEL },
		"dead_plant": { elem2:"dirt", chance:0.1, func:behaviors.FEEDPIXEL },
		"tinder": { elem2:[null,"dirt"], chance:0.1, func:behaviors.FEEDPIXEL },
		"sawdust": { elem2:[null,null,null,null,"dirt"], chance:0.1, func:behaviors.FEEDPIXEL },
		"dust": { elem2:null, chance:0.1, func:behaviors.FEEDPIXEL },
		"rotten_meat": { elem2:null, chance:0.05, func:behaviors.FEEDPIXEL },
		"dead_bug": { elem2:"dirt", chance:0.1, func:behaviors.FEEDPIXEL },
		"hyphae": { elem2:"mycelium", chance:0.1, func:behaviors.FEEDPIXEL },
		"plant": { elem2:"dirt", chance:0.01, func:behaviors.FEEDPIXEL },
		"fiber": { elem2:"dirt", chance:0.01, func:behaviors.FEEDPIXEL },
		"evergreen": { elem2:"dirt", chance:0.01, func:behaviors.FEEDPIXEL },
		"petal": { elem2:"dirt", chance:0.01, func:behaviors.FEEDPIXEL },
		"pistil": { elem2:"dirt", chance:0.01, func:behaviors.FEEDPIXEL },
		"vine": { elem2:"dirt", chance:0.01, func:behaviors.FEEDPIXEL },
		"herb": { elem2:"dirt", chance:0.1, func:behaviors.FEEDPIXEL },
		"rice": { elem2:"dirt", chance:0.01, func:behaviors.FEEDPIXEL },
		"coffee_ground": { elem2:"dirt", chance:0.1, func:behaviors.FEEDPIXEL },
		"nut": { elem2:"dirt", chance:0.05, func:behaviors.FEEDPIXEL },
		"yolk": { elem2:null, chance:0.01, func:behaviors.FEEDPIXEL },
		"charcoal": { elem2:"dirt", chance:0.05, func:behaviors.FEEDPIXEL },
		"straw": { elem2:"dirt", chance:0.05, func:behaviors.FEEDPIXEL },
		"mudstone": { elem2:"dirt", chance:0.1 },
		"permafrost": { elem2:"dirt", chance:0.1 },
		"packed_sand": { elem2:"sand", chance:0.1 },
		"lichen": { elem2:"dirt", chance:0.0025 },
		"salt": { elem1: "slime", elem2: null },
		"potassium_salt": { elem1: "slime", elem2: null },
		"epsom_salt": { elem1: "slime", elem2: null },
		"alcohol": { elem1:null, chance:0.005 },
	},
	tempHigh: 100,
	stateHigh: "ash",
	tempLow: 0,
	stateLow: "frozen_worm",
	category:"life",
	breakInto: "slime",
	burn:20,
	burnTime:50,
	state: "solid",
	density: 1050,
	conduct: 0.17
},
"fly": {
	color: "#4c4e42",
	tick: behaviors.FLY,
	behaviorOn: [
		"XX|CR:flash|XX",
		"CR:flash|CH:ash|CR:flash",
		"XX|CR:flash|XX",
	],
	reactions: {
		"dead_plant": { elem2:null, chance:0.15, func:behaviors.FEEDPIXEL },
		"meat": { elem2:null, chance:0.15, func:behaviors.FEEDPIXEL },
		"cooked_meat": { elem2:null, chance:0.15, func:behaviors.FEEDPIXEL },
		"rotten_meat": { elem2:[null,null,"ammonia"], chance:0.15, func:behaviors.FEEDPIXEL },
		"cheese": { elem2:[null,null,"ammonia"], chance:0.15, func:behaviors.FEEDPIXEL },
		"cheese_powder": { elem2:[null,null,"ammonia"], chance:0.15, func:behaviors.FEEDPIXEL },
		"rotten_cheese": { elem2:[null,null,"ammonia"], chance:0.15, func:behaviors.FEEDPIXEL },
		"vine": { elem2:null, chance:0.15, func:behaviors.FEEDPIXEL },
		"corn": { elem2:null, chance:0.05, func:behaviors.FEEDPIXEL },
		"potato": { elem2:null, chance:0.05, func:behaviors.FEEDPIXEL },
		"crumb": { elem2:null, chance:0.05, func:behaviors.FEEDPIXEL },
		"wheat": { elem2:null, chance:0.1, func:behaviors.FEEDPIXEL },
		"yeast": { elem2:null, chance:0.15, func:behaviors.FEEDPIXEL },
		"caramel": { elem2:null, chance:0.15, func:behaviors.FEEDPIXEL },
		"bread": { elem2:null, chance:0.1, func:behaviors.FEEDPIXEL },
		"sugar_water": { elem2:null, chance:0.15, func:behaviors.FEEDPIXEL },
		"honey": { elem2:null, chance:0.15, func:behaviors.FEEDPIXEL },
		"soda": { elem2:null, chance:0.15, func:behaviors.FEEDPIXEL }
	},
	foodNeed: 15,
	tempHigh: 100,
	stateHigh: "ash",
	tempLow: 0,
	stateLow: "dead_bug",
	breakInto: "dead_bug",
	category:"life",
	burn:95,
	burnTime:25,
	state: "solid",
	density: 600,
	conduct: 1
},
"fish": {
	color: "#ac8650",
	behavior: [
		"XX|M2%5|SW:water,salt_water,sugar_water,dirty_water,seltzer,pool_water,primordial_soup%14",
		"XX|FX%0.5|BO",
		"M2|M1|M2 AND SW:water,salt_water,sugar_water,dirty_water,seltzer,pool_water,primordial_soup%5",
	],
	reactions: {
		"algae": { elem2:null, chance:0.25, func:behaviors.FEEDPIXEL },
		"kelp": { elem2:"water", chance:0.25 },
		"plant": { elem2:null, chance:0.125, func:behaviors.FEEDPIXEL },
		"fly": { elem2:null, chance:0.4, func:behaviors.FEEDPIXEL },
		"firefly": { elem2:null, chance:0.6, func:behaviors.FEEDPIXEL },
		"worm": { elem2:null, chance:0.25, func:behaviors.FEEDPIXEL },
		"tadpole": { elem2:null, chance:0.25, func:behaviors.FEEDPIXEL },
		"spider": { elem2:null, chance:0.25, func:behaviors.FEEDPIXEL },
		"oxygen": { elem2:"carbon_dioxide", chance:0.5 },
		"dead_bug": { elem2:null, chance:0.2, func:behaviors.FEEDPIXEL },
		"broth": { elem2:"water", chance:0.2, func:behaviors.FEEDPIXEL },
		"slug": { elem2:null, chance:0.2, func:behaviors.FEEDPIXEL },
		"herb": { elem2:null, chance:0.15, func:behaviors.FEEDPIXEL },
		"lettuce": { elem2:null, chance:0.15, func:behaviors.FEEDPIXEL },
		"dead_plant": { elem2:null, chance:0.15, func:behaviors.FEEDPIXEL },
		"lichen": { elem2:null, chance:0.1, func:behaviors.FEEDPIXEL },
		"yeast": { elem2:null, chance:0.15, func:behaviors.FEEDPIXEL },
		"yogurt": { elem2:null, chance:0.15, func:behaviors.FEEDPIXEL },
		"tea": { elem2:null, chance:0.2, func:behaviors.FEEDPIXEL },
		"yolk": { elem2:null, chance:0.15, func:behaviors.FEEDPIXEL },
		"cell": { elem2:null, chance:0.15, func:behaviors.FEEDPIXEL },
		"crumb": { elem2:null, chance:0.1, func:behaviors.FEEDPIXEL },
		"alcohol": { elem1:"meat", chance:0.001 },
		"water": { elem2:"bubble", attr2:{"clone":"water"}, chance:0.001, oneway:true },
		"salt_water": { elem2:"bubble", attr2:{"clone":"salt_water"}, chance:0.001, oneway:true },
		"pool_water": { elem1:"meat", chance:0.001 },
		"chlorine": { elem1:"meat", chance:0.1 },
		"vinegar": { elem1:"meat", chance:0.001 },
	},
	foodNeed: 20,
	temp: 20,
	tempHigh: 120,
	stateHigh: "cooked_meat",
	stateHighColor: "#E4CFB9",
	tempLow: -20,
	stateLow: ["frozen_meat","frozen_meat","frozen_meat","frozen_fish"],
	category:"life",
	breakInto: "blood",
	burn:20,
	burnTime:200,
	state: "solid",
	density: 1080,
	conduct: 0.2,
	eggColor: ["#211316","#2C1A1D","#503734"]
},
"fuse": {
	color: "#825d38",
	tick: function(pixel) {
		doDefaults(pixel);
		if (pixel.charge < 1) {
			changePixel(pixel,"flash");
			pixel.charge = 0;
		}
	},
	movable: true,
	tempHigh: 500,
	stateHigh: "fire",
	burn: 100,
	burnTime: 1,
	fireElement: "flash",
	burnInto: "flash",
	category: "machines",
	state: "solid",
	density: 1000,
	conduct: 1,
	ignoreConduct:["ecloner","sensor"]
},
"torch": {
	color: "#d68542",
	behavior: [
		"XX|CR:fire|XX",
		"XX|XX|XX",
		"XX|XX|XX",
	],
	reactions: {
		"water": { elem1:"wood" },
		"sugar_water": { elem1:"wood" },
		"salt_water": { elem1:"wood" },
		"seltzer": { elem1:"wood" },
		"dirty_water": { elem1:"wood" },
		"pool_water": { elem1:"wood" },
		"steam": { elem1:"wood" },
		"smog": { elem1:"wood" },
		"rain_cloud": { elem1:"wood" },
		"cloud": { elem1:"wood" },
		"snow_cloud": { elem1:"wood" },
		"hail_cloud": { elem1:"wood" },
		"thunder_cloud": { elem1:"wood" },
		"ice_nine": { elem1:"wood" }
	},
	temp:600,
	category:"special",
	breakInto: "sawdust",
	tempLow: -273,
	stateLow: "wood"
},
"spout": {
	color: "#606378",
	behavior: [
		"XX|CR:water|XX",
		"CR:water|XX|CR:water",
		"XX|CR:water|XX",
	],
	category:"special",
	tempHigh: 1455.5,
	stateHigh: "molten_steel",
	conduct: 0.42
},
"balloon": {
	color: ["#fe4a75","#267cb0","#1a743c","#ff6ffa","#eaede5","#1dc9f3","#ff0101","#f4cd32","#bee347","#fab937","#91c7cc"],
	behavior: [
		"M1%50|M1%50|M1%50",
		"M2%5|XX|M2%5",
		"M2%5|M2%5|M2%5",
	],
	reactions: {
		"cloud": {elem1:"pop"},
		"rain_cloud": {elem1:"pop"},
		"snow_cloud": {elem1:"pop"},
		"thunder_cloud": {elem1:"pop"},
		"hail_cloud": {elem1:"pop"},
		"acid_cloud": {elem1:"pop"},
		"ozone": {elem1:"pop"},
	},
	category:"special",
	tempHigh: 120,
	stateHigh: "pop",
	tempLow: -272.20,
	stateLow: "pop",
	burn: 20,
	burnTime: 2,
	burnInto: "pop",
	state: "solid",
	density: 0.164,
	breakInto: ["confetti","helium","helium","helium","pop"]
},
"antipowder": {
	color: "#ebd1d8",
	behavior: behaviors.AGPOWDER,
	category:"special",
	tempHigh: 1850,
	stateHigh: "antimolten",
	state: "solid",
	density: 1850
},
"ash": {
	color: ["#8c8c8c","#9c9c9c"],
	behavior: behaviors.POWDER,
	reactions: {
		"steam": { elem1: "pyrocumulus", chance:0.08, "y":[0,12], "setting":"clouds" },
		"rain_cloud": { elem1: "pyrocumulus", chance:0.08, "y":[0,12], "setting":"clouds" },
		"cloud": { elem1: "pyrocumulus", chance:0.08, "y":[0,12], "setting":"clouds" },
		"snow_cloud": { elem1: "pyrocumulus", chance:0.08, "y":[0,12], "setting":"clouds" },
		"hail_cloud": { elem1: "pyrocumulus", chance:0.08, "y":[0,12], "setting":"clouds" },
		"thunder_cloud": { elem1: "pyrocumulus", chance:0.08, "y":[0,12], "setting":"clouds" },
		"acid_cloud": { elem1: "pyrocumulus", chance:0.05, "y":[0,12], "setting":"clouds" },
		"pyrocumulus": { elem1: "pyrocumulus", chance:0.08, "y":[0,12], "setting":"clouds" },
		"tornado":{elem1:"pyrocumulus", oneway:true},
		"stench": { elem2:null, chance:0.1 }
	},
	category:"powders",
	state: "solid",
	density: 700,
	tempHigh: 2000,
	forceAutoGen: true,
	stateHigh: ["molten_ash","smoke","smoke","smoke"]
},
"light": {
	color: "#fffdcf",
	tick: function(pixel) {
	if (Math.random() < 0.02) {
		deletePixel(pixel.x,pixel.y);
		return;
	}
	if (pixel.bx===undefined) {
		// choose 1, 0, or -1
		pixel.bx = Math.random() < 0.5 ? 1 : Math.random() < 0.5 ? 0 : -1;
		pixel.by = Math.random() < 0.5 ? 1 : Math.random() < 0.5 ? 0 : -1;
		// if both are 0, make one of them 1 or -1
		if (pixel.bx===0 && pixel.by===0) {
			if (Math.random() < 0.5) { pixel.bx = Math.random() < 0.5 ? 1 : -1; }
			else { pixel.by = Math.random() < 0.5 ? 1 : -1; }
		}
	}
	// move and invert direction if hit
	if (pixel.bx && !tryMove(pixel, pixel.x+pixel.bx, pixel.y)) {
		var newX = pixel.x + pixel.bx;
		if (!isEmpty(newX, pixel.y, true)) {
			var newPixel = pixelMap[pixel.x+pixel.bx][pixel.y];
			if (!elements[newPixel.element].insulate) {
				newPixel.temp += 1;
				pixelTempCheck(newPixel);
			}
			if (!elements.light.reactions[newPixel.element]) {
				pixel.color = newPixel.color;
			}
		}
		pixel.bx = -pixel.bx;
	}
	if (!pixel.del && pixel.by && !tryMove(pixel, pixel.x, pixel.y+pixel.by)) {
		var newY = pixel.y + pixel.by;
		if (!isEmpty(pixel.x, newY, true)) {
			var newPixel = pixelMap[pixel.x][pixel.y+pixel.by];
			if (!elements[newPixel.element].insulate) {
				newPixel.temp += 1;
				pixelTempCheck(newPixel);
			}
			if (!elements.light.reactions[newPixel.element]) {
				pixel.color = newPixel.color;
			}
		}
		pixel.by = -pixel.by;
	}
	},
	reactions: {
		"glass": { "color1":["#ff0000","#ff8800","#ffff00","#00ff00","#00ffff","#0000ff","#ff00ff"] },
		"glass_shard": { "color1":["#ff0000","#ff8800","#ffff00","#00ff00","#00ffff","#0000ff","#ff00ff"] },
		"rad_glass": { "color1":["#9f6060","#9f8260","#9f9f60","#609f60","#609f9f","#60609f","#9f609f"] },
		"rad_shard": { "color1":["#9f6060","#9f8260","#9f9f60","#609f60","#609f9f","#60609f","#9f609f"] },
		"steam": { "color1":["#ff0000","#ff8800","#ffff00","#00ff00","#00ffff","#0000ff","#ff00ff"] },
		"rain_cloud": { "color1":["#ff0000","#ff8800","#ffff00","#00ff00","#00ffff","#0000ff","#ff00ff"] },
		"cloud": { "color1":["#ff0000","#ff8800","#ffff00","#00ff00","#00ffff","#0000ff","#ff00ff"] },
		"smog": { "color1":["#9f6060","#9f8260","#9f9f60","#609f60","#609f9f","#60609f","#9f609f"] },
		"ice": { "color1":"#c2fff9" },
		"rime": { "color1":"#c2fff9" },
		"water": { "color1":"#a1bac9" },
		"salt_water": { "color1":"#a1bac9" },
		"sugar_water": { "color1":"#a1bac9" },
		"dirty_water": { "color1":"#a1c9a8" },
		"seltzer": { "color1":"#c2fff9" },
		"diamond": { "color1":["#c2c5ff","#c2d9ff"] },
		"rainbow": { "color1":["#ff0000","#ff8800","#ffff00","#00ff00","#00ffff","#0000ff","#ff00ff"] },
		"static": { "color1":["#ffffff","#bdbdbd","#808080","#424242","#1c1c1c"] }
	},
	temp: 35,
	tempLow: -273,
	stateLow: ["liquid_light",null],
	stateLowColorMultiplier: 0.8,
	category: "energy",
	state: "gas",
	density: 0.00001,
	ignoreAir: true,
	insulate: true,
	alias: "photon"
},
"charcoal": {
	color: "#2b2b2b",
	behavior: behaviors.POWDER,
	reactions: {
		"broth": { elem2:"water", chance:0.02 },
		"tea": { elem2:"water", chance:0.02 },
		"poison": { elem2:"dirty_water", chance:0.02 },
		"sulfur": { elem1:"gunpowder", elem2:"gunpowder", chance:0.02 },
		"molten_sulfur": { elem1:"gunpowder", elem2:"gunpowder", chance:0.02 },
		"dead_plant": { elem2:"charcoal", tempMin:200, chance:0.005, oneway:true },
	},
	renderer: renderPresets.CHARCOALHEAT,
	burn: 25,
	burnTime: 1000,
	burnInto: ["fire","fire","fire","fire","ash","carbon_dioxide"],
	tempHigh: 6000,
	stateHigh: "fire",
	category: "powders",
	state: "solid",
	density: 208,
	breakInto: ["ash","ash","carbon_dioxide"],
	hardness: 0.5,
	conduct: 0.001,
	stain: 0.02
},
"hydrogen": {
	color: "#558bcf",
	behavior: behaviors.GAS,
	reactions: {
		"oxygen": { elem1:null, elem2:"steam", tempMin:500, tempMax:3000 },
		"hydrogen": { elem1:"neutron", elem2:"helium", tempMin:10000, temp1:20000, temp2:20000 },
		"nitrogen": { elem1:null, elem2:"oxygen", tempMin:10000 },
		"sulfur": { elem1:null, elem2:"chlorine", tempMin:10000 },
		"neon": { elem1:null, elem2:"sodium", tempMin:10000 },
		"fire": { elem1:"explosion", chance:0.005 },
		"carbon_dioxide": { elem1:["methane",null], elem2:"steam", tempMin:300 },
		"charcoal": { elem1:null, elem2:"oil", tempMin:400, chance:0.1 }
	},
	category: "gases",
	burn: 100,
	burnTime: 2,
	burnInto: ["fire","fire","fire","fire","fire","fire","fire","fire","fire","fire","fire","fire","steam"],
	fireColor: "#637980",
	tempLow: -253,
	stateLow: "liquid_hydrogen",
	state: "gas",
	density: 0.08375,
	conduct: 0.02,
	colorOn: "#7d15e5"
},
"oxygen": {
	color: "#99c7ff",
	behavior: behaviors.GAS,
	reactions: {
		"copper": { elem1:null, elem2:"oxidized_copper", chance:0.05 },
		"bronze": { elem1:null, elem2:"oxidized_copper", chance:0.025 },
		"iron": { elem1:null, elem2:"rust", chance:0.025 },
		"steel": { elem1:null, elem2:"rust", chance:0.02 },
		"water": { elem1:"foam", attr1:{"clone":"oxygen"} },
		"salt_water": { elem1:"foam", attr1:{"clone":"oxygen"} },
		"sugar_water": { elem1:"foam", attr1:{"clone":"oxygen"} },
		"seltzer": { elem1:"foam", attr1:{"clone":"oxygen"} },
		"soda": { elem1:"foam", attr1:{"clone":"oxygen"} },
		"dirty_water": { elem1:"foam", attr1:{"clone":"oxygen"} },
		"oxygen": { elem1: null, elem2: "ozone", chance:0.01, "y":[0,12], "setting":"clouds" },
		"ozone": { elem1: "ozone", chance:0.01, "y":[0,12], "setting":"clouds" },
		"light": { elem1: "ozone", elem2: null, chance:0.3, "y":[0,12], "setting":"clouds" },
		"proton": { elem1:"flash", color1:"#e36d88", attr1:{delay:500}, elem2:"flash", color2:"#e36d88", attr2:{delay:500}, chance:0.25, "y":[0,10] },
		"paper": { elem1:"fragrance", chance:0.005 }
	},
	category: "gases",
	// burn: 100,
	// burnTime: 2,
	tempLow: -183.94,
	stateLow: "liquid_oxygen",
	state: "gas",
	density: 1.292
},
"nitrogen": {
	color: "#b8d1d4",
	behavior: behaviors.GAS,
	reactions: {
		"oxygen": { elem1:null, elem2:"anesthesia", tempMin:250 },
		"hydrogen": { elem1:null, elem2:"ammonia" },
		"neon": { elem1:null, elem2:"chlorine", tempMin:10000 },
		"proton": { elem1:"flash", color1:"#895adb", attr1:{delay:500}, elem2:"flash", color2:"#895adb", attr2:{delay:500}, chance:0.05, "y":[0,20] },
	},
	category: "gases",
	tempLow: -195.8,
	stateLow: "liquid_nitrogen",
	state: "gas",
	density: 1.165
},
"helium": {
	color: "#a69494",
	behavior: behaviors.GAS,
	category: "gases",
	tempLow: -272.20,
	stateLow: "liquid_helium",
	state: "gas",
	density: 0.1786,
	conduct: 0.02,
	colorOn: "#f1a1ff"
},
"carbon_dioxide": {
	color: "#2f2f2f",
	behavior: behaviors.GAS,
	reactions: {
		"plant": { elem1:"oxygen" },
		"evergreen": { elem1:"oxygen" },
		"grass": { elem1:"oxygen" },
		"cactus": { elem1:"oxygen" },
		"bamboo": { elem1:"oxygen" },
		"bamboo_plant": { elem1:"oxygen" },
		"vine": { elem1:"oxygen" },
		"flower_seed": { elem1:"oxygen" },
		"grass_seed": { elem1:"oxygen" },
		"algae": { elem1:"oxygen" },
		"kelp": { elem1:"oxygen" }
	},
	category: "gases",
	tempLow: -78.5,
	stateLow: "dry_ice",
	state: "gas",
	density: 1.977,
	alias: ["CO2","CO₂"]
},
"oil": {
	color: "#470e00",
	behavior: behaviors.LIQUID,
	tick: function(pixel) {
		if (!pixel.burning && pixel.temp > 90 && Math.random() < 0.001) {
			if (pixel.temp < 150) { changePixel(pixel,"propane") }
			else if (pixel.temp < 300) { changePixel(pixel,"molten_plastic") }
			else { changePixel(pixel,"lamp_oil") }
		}
	},
	reactions: {
		"dirt": { elem1:null, elem2:"mud" },
		"sand": { elem1:null, elem2:"wet_sand" },
		"sulfur": { elem1:null, elem2:"greek_fire" },
		"molten_sulfur": { elem1:"greek_fire", elem2:"greek_fire" },
		"water": { burning1:true, elem2:"explosion" },
		"steam": { burning1:true, elem2:"explosion" },
		"salt_water": { burning1:true, elem2:"explosion" },
		"sugar_water": { burning1:true, elem2:"explosion" },
		"dirty_water": { burning1:true, elem2:"explosion" },
		"pool_water": { burning1:true, elem2:"explosion" },
		"seltzer": { burning1:true, elem2:"explosion" },
		"coral": { elem2:null, chance:0.01 },
	},
	category: "liquids",
	tempHigh: 500,
	stateHigh: "fire",
	burn: 5,
	burnTime: 300,
	burnInto: ["carbon_dioxide","fire"],
	viscosity: 250,
	state: "liquid",
	density: 825,
	stain: 0.05,
	alias: "petroleum"
},
"propane": {
	color: "#cfcfcf",
	behavior: behaviors.GAS,
	behaviorOn: [
		"XX|XX|XX",
		"XX|CH:fire|XX",
		"XX|XX|XX",
	],
	conduct: 0.01,
	category: "gases",
	tempHigh: 600,
	stateHigh: "fire",
	tempLow: -43,
	burn: 100,
	burnTime: 5,
	fireColor: ["#00ffff","#00ffdd"],
	state: "gas",
	density: 2.0098,
	alias: "gas"
},
"rainbow": {
	color: ["#ff0000","#ff8800","#ffff00","#00ff00","#00ffff","#0000ff","#ff00ff"],
	tick: function(pixel) {
		var t = pixelTicks+pixel.x+pixel.y;
		var r = Math.floor(127*(1-Math.cos(t*Math.PI/90)));
		var g = Math.floor(127*(1-Math.cos(t*Math.PI/90+2*Math.PI/3)));
		var b = Math.floor(127*(1-Math.cos(t*Math.PI/90+4*Math.PI/3)));
		pixel.color = "rgb("+r+","+g+","+b+")";
		doDefaults(pixel);
	},
	onPlace: behaviors.DO_TICK,
	category: "special",
	movable: false,
	breakInto: "static"
},
"clay": {
	color: "#d4c59c",
	behavior: behaviors.SUPPORT,
	reactions: {
		"dirt": { elem1:"clay_soil", elem2:"clay_soil" },
		"gravel": { elem1:"clay_soil", elem2:"clay_soil" },
		"quicklime": { elem1:"cement", elem2:"cement" },
	},
	tempHigh: 135,
	stateHigh: "baked_clay",
	tempLow: -50,
	stateLow: "clay_soil",
	category: "land",
	state: "solid",
	density: 1760
},
"brick": {
	color: "#cb4141",
	buttonColor: ["#e05555","#cb4141","#a62e2e"],
	colorPattern: textures.BRICK,
	colorKey: {
		"l": "#e05555",
		"r": "#cb4141",
		"d": "#a62e2e",
		"w": "#bababa"},
	behavior: behaviors.WALL,
	category: "solids",
	tempHigh: 1540,
	state: "solid",
	density: 1650,
	hardness: 0.33,
	breakInto: "brick_rubble"
},
"paper": {
	color: "#f0f0f0",
	behavior: behaviors.WALL,
	reactions: {
		"water": { elem1:"cellulose", elem2:null },
		"dirty_water": { elem1:"cellulose", elem2:null },
		"salt_water": { elem1:"cellulose", elem2:null },
		"sugar_water": { elem1:"cellulose", elem2:null },
		"seltzer": { elem1:"cellulose", elem2:null },
		"soda": { elem1:"cellulose", elem2:null },
		"blood": { elem1:"cellulose", elem2:null },
		"foam": { elem1:"cellulose", elem2:null },
		"bubble": { elem1:"cellulose", elem2:null },
		"oil": { elem1:"cellulose", elem2:null },
		"alcohol": { elem1:"cellulose", elem2:null },
		"vinegar": { elem1:"cellulose", elem2:null },
		"light": { stain1:"#ebdfa7" },
		"oxygen": { stain1:"#ebdfa7" }
	},
	tempHigh: 248,
	stateHigh: ["fire","fire","fire","fire","fire","ash"],
	burn: 70,
	burnTime: 300,
	burnInto: ["fire","fire","fire","fire","fire","ash"],
	category: "solids",
	state: "solid",
	density: 1201,
	breakInto: "confetti",
	breakIntoColor: ["#ffffff","#e6e6e6","#dbdbdb"]
},
"acid": {
	color: ["#b5cf91","#a1ff5e","#288f2a"],
	behavior: [
		"XX|DB%5|XX",
		"DB%5 AND M2|XX|DB%5 AND M2",
		"DB%5 AND M2|DB%10 AND M1|DB%5 AND M2",
	],
	ignore: ["glass","rad_glass","glass_shard","rad_shard","stained_glass","baked_clay","acid_gas","neutral_acid","acid_cloud","water","salt_water","sugar_water","dirty_water","copper","gold","porcelain","plastic","bead","microplastic","molten_plastic","pool_water","chlorine","hydrogen","gold_coin","silver","nickel","calcium","bone","earthquake","tornado","tsunami","liquid_light","sensor","clay"],
	reactions: {
		"ash": { elem1:"neutral_acid", elem2:null },
		"limestone": { elem1:"neutral_acid", elem2:["calcium","carbon_dioxide"] },
		"quicklime": { elem1:"neutral_acid", elem2:null },
		"slaked_lime": { elem1:"neutral_acid", elem2:null },
		"borax": { elem1:"neutral_acid", elem2:null },
		"ammonia": { elem1:"neutral_acid", elem2:null },
		"cement": { elem1:"neutral_acid", elem2:null },
		"potassium": { elem1:["fire","hydrogen"], elem2:"potassium_salt" },
		"caustic_potash": { elem1:"water", elem2:"potassium_salt" },
		"bone": { elem1:"neutral_acid", chance:0.01 },
		"head": { elem1:"bone", chance:0.03 },
		"body": { elem1:"bone", chance:0.03 },
		"water": { elem1:null, elem2:"dirty_water" },
		"salt_water": { elem1:null, elem2:"water" },
		"sugar_water": { elem1:null, elem2:"water" },
		"plant": { elem1:null, elem2:"dead_plant" },
		"tree_branch": { elem1:null, elem2:"wood" },
		"charcoal": { elem1:null, elem2:"carbon_dioxide" },
		"rock": { elem1:null, elem2:"sand", chance:0.05 },
		"baking_soda": { elem1:"salt_water", elem2:["carbon_dioxide","foam"] },
		"calcium": { elem1:"chlorine", elem2:"hydrogen", chance:0.01 },
		"zinc": { elem1:"hydrogen", elem2:null, chance:0.03 },
		"sugar": { elem1:"steam", elem2:"carbon_dioxide" },
		"gravel": { elem1:null, elem2:"sand", chance:0.1 },
		"wet_sand": { elem1:"neutral_acid", elem2:"clay" },
		"snail": { elem1:"neutral_acid", elem2:"slug" },
		"silver": { stain2:"#2a2e2a" }
	},
	category: "liquids",
	tempHigh: 110,
	stateHigh: "acid_gas",
	tempLow: -58.88,
	burn: 30,
	burnTime: 1,
	state: "liquid",
	density: 1049,
	stain: -0.1,
	alias: "hydrochloric acid"
},
"soda": {
	color: "#422016",
	behavior: [
		"XX|XX|XX",
		"M2|XX|M2",
		"M2|M1|M2",
	],
	tick: function(pixel) {
		if (Math.random() < 0.02 && isEmpty(pixel.x,pixel.y-1)) {
			let foam = releaseElement(pixel, "foam");
			if (foam) foam.color = pixelColorPick(foam,"#dbb586");
		}
	},
	onMix: function(pixel) {
		let foam = releaseElement(pixel, "foam");
		if (foam) foam.color = pixelColorPick(foam,"#dbb586");
	},
	tempHigh: 100,
	stateHigh: ["steam","carbon_dioxide","sugar"],
	tempLow: -1.11,
	category: "liquids",
	reactions: {
		"rock": { elem2: "wet_sand", chance: 0.0004 },
		"water": { elem1: "sugar_water", elem2: "sugar_water" },
		"salt": { elem2:"foam", chance:0.05, color2:"#dbb586" },
		"salt_water": { elem2:"foam", chance:0.01, color2:"#dbb586" },
		"sugar": { elem2:"foam", chance:0.001, color2:"#dbb586" },
		"egg": { elem2:"yolk", chance:0.001 },
		"candy": { elem2:"foam", chance:0.01, color2:"#dbb586" },
		"caramel": { elem2:"foam", chance:0.01, color2:"#dbb586" },
		"rust": { elem2:"iron", chance:0.01 },
		"oxidized_copper": { elem2:"copper", chance:0.01 },
	},
	state: "liquid",
	density: 1030,
	isFood: true
},
"wax": {
	color: "#fff3d6",
	behavior: behaviors.STURDYPOWDER,
	tempHigh: 57,
	stateHigh: "melted_wax",
	category: "powders",
	state: "solid",
	density: 900
},
"iron": {
	color: ["#cbcdcd","#bdbdbd"],
	behavior: behaviors.WALL,
	reactions: {
		"water": { elem1:"rust", chance:0.0025 },
		"salt_water": { elem1:"rust", chance:0.005 },
		"dirty_water": { elem1:"rust", chance:0.04 },
		"pool_water": { elem1:"rust", chance:0.04 },
		"sugar_water": { elem1:"rust", chance:0.0035 },
		"seltzer": { elem1:"rust", chance:0.006 },
		"salt": { elem1:"rust", chance:0.004 },
		"blood": { elem1:"rust", chance:0.003 },
		"infection": { elem1:"rust", chance:0.003 },
		"antibody": { elem1:"rust", chance:0.003 },
		"fire": { elem1:"rust", chance:0.0025 },
		"coffee": { elem1:"rust", chance:0.0003 },
		"tea": { elem1:"rust", chance:0.0003 },
		"broth": { elem1:"rust", chance:0.0003 },
		"juice": { elem1:"rust", chance:0.0003 },
		"nut_milk": { elem1:"rust", chance:0.0003 },
	},
	tempHigh: 1538,
	category: "solids",
	density: 7860,
	conduct: 0.47,
	hardness: 0.4,
	darkText: true
},
"copper": {
	color: ["#a95232","#be4322","#c76035"],
	behavior: behaviors.WALL,
	reactions: {
		"blood": { elem1:"oxidized_copper", chance:0.003 },
		"infection": { elem1:"oxidized_copper", chance:0.003 },
		"antibody": { elem1:"oxidized_copper", chance:0.003 },
		"fire": { elem1:"oxidized_copper", chance:0.0025 },
	},
	category: "solids",
	tempHigh: 1085,
	density: 8960,
	conduct: 0.95,
	hardness: 0.3,
	fireColor: ["#07BA4F","#00BC5B","#00C2A9","#11B7E7","#C6F2EC"]
},
"gold": {
	color: ["#fff0b5","#986a1a","#f0bb62"],
	behavior: behaviors.WALL,
	tempHigh: 1064,
	category: "solids",
	density: 19300,
	conduct: 0.81,
	hardness: 0.25,
	breakInto: "gold_coin"
},
"milk": {
	color: "#fafafa",
	behavior: behaviors.LIQUID,
	onMix: function(milk1, milk2) {
		if (shiftDown && Math.random() < 0.01) {
			changePixel(milk1,"butter")
		}
	},
	reactions: {
		"melted_chocolate": { elem1:"chocolate_milk", elem2:null },
		"chocolate": { elem1:"chocolate_milk", elem2:"melted_chocolate", chance:0.05 },
		"chocolate_powder": { elem1:"chocolate_milk", elem2:"melted_chocolate", chance:0.2 },
		"juice": { elem1:"fruit_milk", elem2:null, chance:0.05 },
		"soda": { elem1:"pilk", elem2:null, chance:0.1 },
		"yolk": { elem1:"eggnog", elem2:null, chance:0.1 },
		"ash": { elem1:"soap", chance:0.1 },
		"caramel": { color1:"#C8B39A", elem2:null, chance:0.05 },
		"sugar": { elem2:null, chance:0.005},
	},
	tempLow: 0,
	stateLow: "ice_cream",
	stateLowColorMultiplier: [0.97,0.93,0.87],
	tempHigh: 100,
	stateHigh: ["steam","bubble","cream","cream","sugar"],
	viscosity: 1.5,
	category: "liquids",
	state: "liquid",
	density: 1036.86,
	isFood: true
},
"cheese": {
	color: "#fcba03",
	behavior: behaviors.STURDYPOWDER,
	reactions: {
		"dirty_water": { elem1:"rotten_cheese", chance:0.1 },
		"stench": { elem1:"rotten_cheese", chance:0.2 },
		"fly": { elem1:"rotten_cheese", chance:0.2 },
		"dioxin": { elem1:"rotten_cheese", elem2:null, chance:0.1 },
		"uranium": { elem1:"rotten_cheese", chance:0.1 },
		"cancer": { elem1:"rotten_cheese", chance:0.1 },
		"plague": { elem1:"rotten_cheese", elem2:null, chance:0.3 },
		"ant": { elem1:"rotten_cheese", chance:0.1 },
		"worm": { elem1:"rotten_cheese", chance:0.1 },
		"rat": { elem1:"rotten_cheese", chance:0.1 },
		"mushroom_spore": { elem1:"rotten_cheese", chance:0.1 },
		"mushroom_stalk": { elem1:"rotten_cheese", chance:0.1 },
		"mercury": { elem1:"rotten_cheese", elem2:null, chance:0.2 },
		"mercury_gas": { elem1:"rotten_cheese", elem2:null, chance:0.1 },
		"virus": { elem1:"rotten_cheese", chance:0.1 },
		"poison": { elem1:"rotten_cheese", elem2:null, chance:0.5 },
		"infection": { elem1:"rotten_cheese", elem2:null, chance:0.1 },
		"ink": { elem1:"rotten_cheese", elem2:null, chance:0.1 },
		"acid": { elem1:"rotten_cheese", elem2:null, chance:0.5 },
		"acid_gas": { elem1:"rotten_cheese", chance:0.4 },
		"cyanide": { elem1:"rotten_cheese", elem2:null, chance:0.5 },
		"cyanide_gas": { elem1:"rotten_cheese", elem2:null, chance:0.5 },
		"rotten_meat": { elem1:"rotten_cheese", chance:0.02 }
	},
	tempHigh: 54,
	stateHigh: "melted_cheese",
	breakInto: "cheese_powder",
	breakIntoColorMultiplier: [1.1,1,0.86],
	category: "food",
	state: "solid",
	density: 477.62,
	isFood: true
},
"soap": {
	color: "#f2f2f2",
	behavior: [
		"XX|CR:bubble%0.25|XX",
		"M2|XX|M2",
		"M2|M1|M2",
	],
	reactions: {
		"rust": { elem2: "iron", chance:0.01 },
		"oxidized_copper": { elem2: "copper", chance:0.01 },
		"blood": { elem2:null, chance:0.02 },
		"dirty_water": { elem2: "water" },
		"salt_water": { elem2: "water" },
		"oxygen": { elem2: "bubble" },
		"plague": { elem2: null },
		"virus": { func: function(pixel1,pixel2){pixel2.heal=true} },
		"infection": { elem2: ["blood",null], chance:0.02 },
		"mushroom_spore": { elem2: null, chance:0.02 },
		"lichen": { elem2: null, chance:0.005 },
		"rotten_meat": { elem2: "meat" },
		"rotten_cheese": { elem2: "cheese" },
		"acid_cloud": { elem2: "rain_cloud" },
		"oil": { elem2: null, chance:0.02 },
		"soda": { elem2: "sugar_water", chance:0.02 },
		"ink": { elem2: null, chance:0.02 },
		"dye": { elem2: null, chance:0.02 },
		"glue": { elem2: null, chance:0.02 },
		"slime": { elem2: null, chance:0.005 },
		"stench": { elem2: null },
		"cancer": { elem2: null, chance:0.01 },
		"rat": { elem2: null, chance:0.01 },
		"ant": { elem2: "dead_bug", chance:0.1 },
		"bee": { elem2: "dead_bug", chance:0.1 },
		"fly": { elem2: "dead_bug", chance:0.1 },
		"firefly": { elem2: "dead_bug", chance:0.1 },
		"worm": { elem2: "dead_bug", chance:0.1 },
		"flea": { elem2: "dead_bug", chance:0.1 },
		"termite": { elem2: "dead_bug", chance:0.1 },
		"spider": { elem2: "dead_bug", chance:0.1 },
		"stink_bug": { elem2: "dead_bug", chance:0.1 },
		"smog": { elem2: "cloud" },
		"water": { elem1: ["foam","bubble"], chance:0.005 },
		"salt_water": { elem1: ["foam","bubble"], chance:0.005 },
		"sugar_water": { elem1: ["foam","bubble"], chance:0.005 },
		"seltzer": { elem1: ["foam","bubble"], chance:0.005 },
		"pool_water": { elem1: ["foam","bubble"], chance:0.005 },
		"fire": { elem1: "fragrance" },
	},
	tempHigh: 100,
	stateHigh: "bubble",
	viscosity: 500,
	state: "liquid",
	category:"liquids",
	density: 1055,
	stain: -1
},