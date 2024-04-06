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
  const stateIds = {};
  const cityIds = {};
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
      success: function (data) {
        $('section.places').empty();
        $('section.places').append('<h1>');
        for (const place of data) {
          const myPlace = `<article>
					 <div class="title_box">
						 <h2>${place.name}</h2>
						 <div class="price_by_night">${place.price_by_night}</div>
					 </div>
					 <div class="information">
					 	<div class="max_guest">${place.max_guest} Guests</div>
						<div class="number_rooms">${place.number_rooms} Bedrooms</div>
						<div class="number_bathrooms">${place.number_bathrooms} Bathrooms</div>
					 </div>
					 <div class="description">
					 	 ${place.description}
					 </div>
					 <div class="reviews">
					  <h2>Reviews <span class="review-span" data-id="${place.id}">show</span></h2>
					  <ul>
					  </ul>
					  </div>
					 </article>`;
          $('section.places').append(myPlace);
        }
      }
	     });
  });

  $('.state-checkbox').change(function () {
    if ($(this).prop('checked')) {
	    stateIds[$(this).attr('data-id')] = $(this).attr('data-name');
    } else if (!$(this).prop('checked')) {
	    delete stateIds[$(this).attr('data-id')];
    }
    if (Object.keys(stateIds).length === 0 && Object.keys(cityIds).length === 0) {
	    $('.locations h4').html('&nbsp;');
    } else {
	    $('.locations h4').text(Object.values(stateIds).concat(Object.values(cityIds)).join(', '));
    }
  });

  $('.city-checkbox').change(function () {
    if ($(this).prop('checked')) {
	    cityIds[$(this).attr('data-id')] = $(this).attr('data-name');
    } else if (!$(this).prop('checked')) {
	    delete cityIds[$(this).attr('data-id')];
    }
    if (Object.keys(stateIds).length === 0 && Object.keys(cityIds).length === 0) {
	    $('.locations h4').html('&nbsp;');
    } else {
	    $('locations h4').text(Object.values(cityIds).concat(Object.values(stateIds)).join(', '));
    }
  });
$('.review-span').on('click', function (e) {
  $.ajax({
    url: 'http://0.0.0.0:5001/api/v1/places/' + $(this).attr('data-id') + '/reviews'
  }).done(function (data) {
    $('span').addClass('hide-review');
    if ($('.review-span').text('show')) {
      for (const review of data) {
        $('.reviews ul').append(`<li>${review.text}</li>`);
    }
    $('.hide-review').text('hide'));
} else if ($('.hide-review').text('hide')) {
    $('.reviews ul').empty();
    $('.reviews-span').text('show');
   }
  });
 });
});
