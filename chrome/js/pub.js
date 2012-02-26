$(document).ready(function(){

  $("#z_listing_event_form_information").prepend('<div class="z-group z-panel-information"><h2>Event Brite Information</h2><input class="z-validate-me z-full" type="text" id="event_brite_id"><br/><br/><button id="loadEventBrite">Load Event Brite</button><div class="z-bottom"></div></div>');

  $("#loadEventBrite").click(function(e) {
    e.preventDefault();
    button_id = $("#event_brite_id").val();
    console.log(button_id);
    $.get("https://www.eventbrite.com/xml/event_get?id=" + button_id + "&app_key=VUCVNDY2STJWJVP7ZR", function(data) {
      xml = $(data);

      title = xml.find("title");
      description = xml.find("description");

      foo = $("<div/>");
      foo.html(description.text());

      price = xml.find("price");
      tags = xml.find("tags");
      organizer_url = xml.find("organizer").find("url");
      venue = xml.find("venue")
      address = venue.find("name");
      city = venue.find("city");
      country = venue.find("country");
      
      category = xml.find("category").text().split(",")[0];

      $("#z_event_first_category option").each(function(index, item) {
        if (item.text.toLowerCase().indexOf(category) >= 0) {
          $(item).attr("selected", "selected");
        }
      });

      $("#queued_event_name").val(title.text());
      $("#queued_event_description").val(foo.text());
      $("#queued_event_price").val(price.text());
      $("#queued_event_keywords").val(tags.text());
      $("#queued_event_url").val(organizer_url.text());

      $("#z_event_input_venue_name").val(address.text());
      $("#z_event_input_venue_where").val(city.text() + ", " + country.text());

      $("#z_event_button_lookup_venue").click();

      window.setTimeout(function() {
        $(".z-trigger-venue-choose")[0].click();
      }, 2000);
    });
  });

});
