/*
 * tinycard: returns a DOM element representing the given Spoils TCG card
 *
 * card must have a name
 * card can also have the following attributes:
 * - threshold, which determines the number of resource icons to present
 * - cost or numeric-cost, which if undefined indicates a resource card
 * - trade, which determines the background color and the resource icons
 *
 * If the name passed in is the name of a staple resource, a staple resource
 * with custom presentation will be returned.
 *
 * All attributes on the provided card will be added as attributes to the
 * returned DOM element. The DOM element will also have its cost attribute
 * set for non-resource cards.
 */
function tinycard(card) {
  if (isEmpty(card.name)) return undefined;

  card = resourceCard(card) ? resourceCard(card) : card;

  var cardElement = document.createElement("div");
  cardElement.className = "card " + card.trade + (hasCost(card) ? "" : " resource");
  if (hasCost(card)) {
    cardElement.appendChild(createCost(card));
  }
  cardElement.appendChild(createName(card));
  cardElement.appendChild(createThreshold(card));

  for (var key in card) {
    cardElement.setAttribute(key, card[key]);
  }

  if (hasCost(card)) {
     cardElement.setAttribute("cost", cardCost(card));
  }

  return cardElement;
}

function createCost(card) {
  var cost = document.createElement("span");
  cost.className = "cost numeric";
  cost.appendChild(document.createTextNode(intOrZero(cardCost(card))));

  return cost;
}

function createName(card) {
  var name = document.createElement("div");
  name.className = "name";
  name.appendChild(document.createTextNode(card.name));

  return name;
}

function createThreshold(card) {
  var threshold = document.createElement("div");
  threshold.className = "threshold";

  var iconCount = intOrZero(card.threshold);
  for (var i = 0; i < iconCount; i++) {
    var icon = document.createElement("img");
    icon.setAttribute("src", trade_icon_img(card.trade));
    threshold.appendChild(icon);
  }

  return threshold;
}

function trade_icon_img(trade) {
  if (typeof trade == "string" && trade_icons[trade.toLowerCase()]) {
    return "imgs/" + trade_icons[trade.toLowerCase()] + "_tiny.png";
  }
  return "imgs/blank_tiny.png";
}

var trade_icons = {
  'arcanist' : 'obs',
  'banker' : 'greed',
  'gearsmith' : 'elit',
  'rogue' : 'dec',
  'warlord' : 'rage'
}

function resourceCard(card) {
  if (typeof card.name != "string") return undefined;

  return resources[card.name.toLowerCase()];
}

var resources = {
  'obsession' : {
    "name" : "Obsession",
    "threshold" : 1,
    "trade" : "arcanist"
  },
  'greed' : {
    "name" : "Greed",
    "threshold" : 1,
    "trade" : "banker"
  },
  'elitism' : {
    "name" : "Elitism",
    "threshold" : 1,
    "trade" : "gearsmith"
  },
  'deception' : {
    "name" : "Deception",
    "threshold" : 1,
    "trade" : "rogue"
  },
  'rage' : {
    "name" : "Rage",
    "threshold" : 1,
    "trade" : "warlord"
  }
}

function cardCost(card) {
  if (isNumeric(card['numeric-cost'])) {
    return parseInt(card['numeric-cost']);
  }
  return parseInt(card['cost']);
}

function hasCost(card) {
  return isNumeric(card['numeric-cost']) || isNumeric(card.cost);
}

function isNumeric(value) {
  return parseInt(value) == 0 || parseInt(value);
}

function intOrZero(n) {
  var num = parseInt(n);
  return num ? num : 0;
}

function isEmpty(string) {
  return typeof(string) != "string" || string.length == 0;
}

