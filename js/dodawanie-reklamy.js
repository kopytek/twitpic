/*
	js for dodawanie-reklamy.html

*/

var b1 = false, // etap-pierwszy textarea test
		b2 = false, // etap-trzeci input test
		sK = $("#stworz-reklame-button"),
		etap_pierwszy = $(".etap-pierwszy textarea"),
		etap_trzeci_input = $(".etap-trzeci .nazwa-reklamy-input");

var checkEtapy = function() {
	if (b1 && b2 ){
		sK.removeClass('disabled');
	} else { 
		sK.addClass('disabled'); 
	}
}

$(document).ready(function() {

	/* plugin dla textarea do sprawdzania ilości znaków */	
	$("#wiadomoscDoWyslania").charCount({
		allowed: 140,
		warning: 30,
		counterText: 'Pozostało: '
	});

	/*
	przycisk do stworzenia kampanii powinien być aktywny dopiero gdy wszystkie etapy
	zostały wykonane
	*/
	etap_pierwszy.on('keyup', function() {
		if (etap_pierwszy.val().length >= 1) {
			b1 = true;
		} else { b1 = false; }
		checkEtapy();
	});

	/*
	sprawdzamy czy użytkownik wybrał nazwę dla kampanii i wpisał ją w input
	*/
	etap_trzeci_input.on('keyup', function() {
		if (etap_trzeci_input.val().length >=1) {
			b2 = true;
		} else { b2 = false; }
		checkEtapy();
	});

	$("#stworz-reklame-button").on('click', function() {
		/* tworzymy reklamę, POST na /api/adds */
	  $('#fileupload').fileupload({
	    dataType: 'json',
	    type:     'POST',
	    url:      "http://q4.maszyna.pl/api/adds",
	    formData: {
	      'name': $('#nazwaReklamy').val(),
	      'text': $('#wiadomoscDoWyslania').val()
	    },
	    add: function (e, data) {
	      data.context = $('#stworz-reklame-button');
	      $("#commercial_create_form").unbind('submit');
	      $("#commercial_create_form").submit(function(){
	        data.submit();
	        return false; 
	      });   
	    },
	    done: function (e, data) {
	      console.log(data);
	      if(data.result && data.result.files) {
	        $.each(data.result.files, function (index, file) {
	          $('#commercial_create_form fieldset').append('<div class="alert alert-info"><button type="button" class="close" data-dismiss="alert">&times;</button><strong>Dodano:</strong> '+file.name+'</div>');
	        });
	      }
	      else {
	        $('#commercial_create_form fieldset').prepend('<div class="alert alert-error"><button type="button" class="close" data-dismiss="alert">&times;</button><strong>Blad\' !</strong> Zła odpowiedź</div>');
	      }
	    },
	    fail: function(e, data) {
	      $('#commercial_create_form fieldset').prepend('<div class="alert alert-error"><button type="button" class="close" data-dismiss="alert">&times;</button><strong>Blad\' !</strong> niczego nie wgrałem</div>');
	    }
	  });
	});
	
    
}); //end of document.ready()