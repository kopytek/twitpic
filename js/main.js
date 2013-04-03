
/*	==================== 
	deklaracja zmiennych 
	====================
*/

var b1 = false; // etap_pierwszy textarea test
var b2 = false; // etap_czwarty input test
var sK = $("#stworz-kampanie-button");
var etap_pierwszy = $(".etap-pierwszy textarea");
var etap_drugi = $(".etap-drugi ul li");	
var etap_trzeci = $(".etap-trzeci ul"); 
var etap_czwarty_input = $(".etap-czwarty .nazwa-kampanii-input");

var checkEtapy = function() {
	if (b1 && b2 && (etap_drugi.find('a.selected').length) >=1 && (etap_trzeci.find('li.selected').length >= 1)) {
		sK.removeClass('disabled');
	} else { 
		sK.addClass('disabled'); 
	}
}

/* document.ready() */
$(document).ready(function() {

	/* plugin dla textarea do sprawdzania ilości znaków */	
	$("#wiadomoscDoWyslania").charCount({
		allowed: 140,
		warning: 30,
		counterText: 'Pozostało: '
	});

	/*  
		trochę kodu dla wizualizacji kliknięcia danego zdjęcia + dodanie
		eventów dla przycisków tak być działały 
	*/
	if (($(".etap-drugi ul.thumbnails").children().length) > 1) { 
		
		console.log("zdjęcia w kolekcji, eventy ON");

		$(".etap-drugi ul li a").on('click', function(event) {
			event.preventDefault();
			$(this).toggleClass("selected");
			console.log("img clicked");
			checkEtapy();
		});

		$("#odznacz-wszystkie-zdjecia").on('click', function(event) {
			event.preventDefault();
			$(".etap-drugi ul li").each(function() {
				$(this).find('a').removeClass("selected");
			});
		});

		$("#zaznacz-wszystkie-zdjecia").on('click', function(event) {
			event.preventDefault();
			$(".etap-drugi ul li").each(function() {
				$(this).find('a').addClass("selected");
			});
			checkEtapy();
		});

		// przyciski mogą być ukryte, let's show them
		$("#odznacz-wszystkie-zdjecia").show();
		$("#zaznacz-wszystkie-zdjecia").show(); 

		
	} else {
		$(".etap-drugi ul.thumbnails").append('<h2>Brak dodanych zdjęć</h2><p class="lead"> Nie zostały dodane jeszcze żadne zdjęcia do kolekcji, dodaj coś żeby móc stworzyć kampanię.</p>');
		$("#odznacz-wszystkie-zdjecia").hide();
		$("#zaznacz-wszystkie-zdjecia").hide();
	}

	/* zajmujemy się kontami, podobne efekty & kod jak dla zdjęć */
	if (($(".etap-trzeci ul.media-list").children().length) > 1) {
		console.log("konta w kolekcji, eventy ON");

		$(".etap-trzeci ul li ").on('click', function(event) {
			event.preventDefault();
			$(this).toggleClass("selected");
			console.log("konto clicked");
			checkEtapy();
		});

		$("#odznacz-wszystkie-konta").on('click', function(event) {
			event.preventDefault();
			$(".etap-trzeci ul li").each(function() {
				$(this).removeClass("selected");
			});
		});

		$("#zaznacz-wszystkie-konta").on('click', function(event) {
			event.preventDefault();
			$(".etap-trzeci ul li").each(function() {
				$(this).addClass("selected");
			});
			checkEtapy();
		});
		// przyciski mogą być ukryte, let's show them
		$("#odznacz-wszystkie-konta").show();
		$("#zaznacz-wszystkie-konta").show();
	
		checkEtapy();
	} else {
		$(".etap-trzeci ul.media-list").append('<h2>Brak dodanych kont</h2><p class="lead">Nie zostały dodane jeszcze żadne konta, dodaj najpierw konto by móc stworzyć kampanię</p>');
		// przyciski mogą być ukryte, let's show them
		$("#odznacz-wszystkie-konta").hide();
		$("#zaznacz-wszystkie-konta").hide();
	}

	/* 
	chcemy dodać progress bar, który będzie się zmieniał w momencie wykonywania
	kolejnych etapów przy tworzeniu kampanii

	mamy 3 etapy czyli 33.33% 66.66% 100%
	
	w tym momencie progress bar zostaje porzucaony, może do niego kiedyś wrócimy
	*/

	/*
	var t = $(".etap-pierwszy textarea");
	var pb = $(".etap-czwarty .progress .bar");
	
	t.on('blur', function() {
		if (t.val().length > 1) {
			// jakiś tekst został dodany do textarea, we can now update our progress bar
			if (!pb.hasClass('etap-pierwszy-width')) {
				pb.addClass('etap-pierwszy-width');
				pb.css({
					'width': ''
				});
			}					
		} else {
			pb.removeClass('etap-pierwszy-width');
		}
	});
	*/

	/*
	przycisk do stworzenia kampanii powinien być aktywny dopiero gdy wszystkie etapy
	zostały wykonane
	*/

	etap_pierwszy.on('blur', function() {
		if (etap_pierwszy.val().length >= 1) {
			b1 = true;
		} else { b1 = false; }
	});
	
	/*
	sprawdzamy czy użytkownik wybrał nazwę dla kampanii i wpisał ją w input
	*/
	etap_czwarty_input.on('blur', function() {
		if (etap_czwarty_input.val().length >=1) {
			b2 = true;
		} else { b2 = false; }
		checkEtapy();
	});
});