const $ = window.$;

$(document).ready(function () {
  const url = 'http://0.0.0.0:5001/api/v1/status/';
  $.get(url, (data) => {
    if (data.status === 'OK') {
      $('#api_status').addClass('available');
    } else {
      $('#api_status').removeClass('available');
    }
  });

  const amenityIds = {};
  $('input[type=checkbox]').change(function () {
    if ($(this).prop('checked')) {
      amenityIds[$(this).attr('data-id')] = $(this).attr('data-name');
    } else if (!$(this).prop('checked')) {
      delete amenityIds[$(this).attr('data-id')];
    }
    if (Object.keys(amenityIds).length === 0) {
      $('div.amenities h4').html('&nbsp;');
    } else {
      $('div.amenities h4').text(Object.values(amenityIds).join(', '));
    }
  });

  $('.filters button').on('click', function () {
	$.ajax({
		type: 'POST',
		url: 'http://0.0.0.0:5001/api/v1/places_search/',
		contentType: 'application/json',
		data: JSON.stringify({ amenities: Object.keys(amenityIds) }),
		success: function(data) {
			$('section.places').empty();
			$('section.places').append('<h1>');
			for (const place of data){
				const myPlace = `<article>
					 <div class="title_box">
						 <h2>${ place.name }</h2>
						 <div class="price_by_night">${ place.price_by_night }</div>
					 </div>
					 <div class="information">
					 	<div class="max_guest">${ place.max_guest } Guests</div>
						<div class="number_rooms">${ place.number_rooms } Bedrooms</div>
						<div class="number_bathrooms">${place.number_bathrooms} Bathrooms</div>
					 </div>
					 <div class="description">
					 	 ${ place.description }
					 </div>
					 </article>`;
				$('section.places').append(myPlace);
			}
		}
	     });
	});
});
