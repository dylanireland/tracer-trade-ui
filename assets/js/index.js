


fixCoindentifierHeight();

var long = true;
var leverage = 1;
var coindex = -1;
var gmenu = 1;

function resize() {
  fixCoindentifierHeight();
}

window.onresize = function () {
  resize();
}

$(document).ready(function(){

	var clickedTab = $(".tabs > .active");
	var tabWrapper = $(".tab__content");
	var activeTab = tabWrapper.find(".active");

	activeTab.show();

	$(".tabs > li").on("click", function() {
	  $(".tabs > li").removeClass("active");
		$(this).addClass("active");
		clickedTab = $(".tabs .active");
		$(".tab__content > li").removeClass("active");
    $(".tab__content > li").hide();
		var clickedTabIndex = clickedTab.index();
		$(".tab__content > li").eq(clickedTabIndex).addClass("active");
		activeTab = $(".tab__content > .active");
    activeTab.show();
    swapMenus($(this).data("index"));
	});
});

function makeLong() {
  $(".flipflop button.short").removeClass("active");
  $(".flipflop button.long").addClass("active");
  long = true;
  optionsUpdated();
}

function makeShort() {
  $(".flipflop button.long").removeClass("active");
  $(".flipflop button.short").addClass("active");
  long = false;
  optionsUpdated();
}

function make1x() {
  $(".flipflop button.3x").removeClass("active");
  $(".flipflop button.1x").addClass("active");
  leverage = 1;
  optionsUpdated();
}

function make3x() {
  $(".flipflop button.1x").removeClass("active");
  $(".flipflop button.3x").addClass("active");
  leverage = 3;
  optionsUpdated();
}

function coinClicked(which) {
  const tokens = document.getElementById("tokens");
  const imgs = tokens.querySelectorAll("img");
  var removables = tokens.getElementsByClassName('clicked');
  if (imgs[which].classList.contains("clicked")) {
    imgs[which].classList.remove("clicked");
    coindex = -1;
    for (var i = 0; i < 6; i++) {
      imgs[i].classList.remove("inactive");
    }
    //No Token in bottom middle slot after this^
  } else {
    while (removables.length > 0) {
      removables[0].classList.remove('clicked');
    }
    imgs[which].classList.remove('inactive');
    imgs[which].classList.add("clicked");
    coindex = which;
    for (var i = 0; i < 6; i++) {
      if (i != which) {
        imgs[i].classList.add("inactive");
      }
    }
  }
  optionsUpdated();
}

function fixCoindentifierHeight() {
  if (document.getElementById("coindentifier")) {
    document.getElementById("coindentifier").style.height = document.getElementById("buysell").querySelector("button").offsetHeight + "px";
  }
}

function assetFromCoindex() {
  switch (coindex) {
    case 0:
     return "BTC";
    case 1:
     return "ETH";
    case 2:
     return "TOKE";
    case 3:
     return "LINK";
    case 4:
     return "EUR";
    case 5:
     return "AAVE";
    default:
     return "";
  }
}

function optionsUpdated() {
  const coindentifier = document.getElementById("coindentifier");
  const p = coindentifier.querySelector("p");
  const buysell = document.getElementById("buysell");
  const leverage_switch = document.getElementById("leverage_switch");
  const oneX = leverage_switch.getElementsByClassName("1x")[0];
  const threeX = leverage_switch.getElementsByClassName("3x")[0];
  const isOnly3xCompatible = (coindex == 2 || coindex == 3 || coindex == 5);
  if (coindex == -1) {
    p.innerHTML = "";
    coindentifier.classList.add("hidden");
    buysell.classList.add("fullButtonWidth");
    buysell.classList.add("grey");
    oneX.innerHTML = "1x";
    oneX.classList.remove("hidden");
    threeX.classList.remove("full");
    return;
  }
  if (isOnly3xCompatible) {
    oneX.innerHTML = "&#x200b;";
    oneX.classList.add("hidden");
    threeX.classList.add("full");
    $(".flipflop button.1x").removeClass("active");
    $(".flipflop button.3x").addClass("active");
    leverage = 3;
  } else {
    oneX.innerHTML = "1x";
    oneX.classList.remove("hidden");
    threeX.classList.remove("full");
  }
  coindentifier.classList.remove("hidden");
  buysell.classList.remove("fullButtonWidth");
  buysell.classList.remove("grey");
  p.innerHTML = (((isOnly3xCompatible) ? "3": (leverage.toString())) + (long ? "L": "S") + "-" + assetFromCoindex(coindex) + "/USD");
}

function swapMenus(menu) {
  if (menu == 0) {
    if (gmenu == 0) {
      drawUpBuySell();
    }
    gmenu = 1;
  } else if (menu == 1) {
    if (gmenu == 1) {
      drawUpMintBurn();
    }
    gmenu = 0;
  }
}

function drawUpMintBurn() {
  const main = document.getElementById("main");
  main.querySelector("div > div > h2").innerHTML = "Mint & Burn Pool Tokens";
}

function drawUpBuySell() {
  const main = document.getElementById("main");
  main.querySelector("div > div > h2").innerHTML = "Trade Pool Tokens";
}
