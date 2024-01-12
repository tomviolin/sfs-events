// Edit your ics sources here
ics_sources = [
	{url:'/proxy.php?url='+encodeURI('http://uwm.edu/freshwater/events/?ical=1'), title:'SFS Web Events', prefix:'💧', event_properties:{color: '#FFbbFF'}},
	//{url:'/proxy.php?url='+encodeURI('https://25livepub.collegenet.com/calendars/uwm-sfs-all-events.ics?startdate=20230201&weeks=52'), title:'ROAR Room Reservations', prefix:'🚪', event_properties:{color: '#ccffcc'}},
	{url:'/proxy.php?url='+encodeURI('https://25livepub.collegenet.com/calendars/uwm-sfs-all-events.ics'), title:'ROAR Room Reservations', prefix:'🚪', event_properties:{color: '#ccffcc'}},
	//{url:'/proxy.php?url='+encodeURI('https://25livepub.collegenet.com/calendars/uwm-sfs-all-events.ics?startdate=20230101&enddate=20231231'), title:'ROAR Room Reservations', prefix:'🚪', event_properties:{color: '#ccffcc'}},
	//{url:'/proxy.php?url='+encodeURI('https://panthers.sharepoint.com/:u:/s/SFSReservations/EUOq58_EkORIrjNUmg7nZ8gBVOUY04mdOpL8iMZXzQzgxA?e=5m1Rd2'), title:'ROAR Room Reservations', prefix:'🚪', event_properties:{color: '#ccffcc'}},
	//{url:'https://sfsfiles01.sfs.uwm.edu/calendar.php', title:'ROAR Room Reservations', prefix:'🚪', event_properties:{color: '#ccffcc'}},
	{url:'/proxy.php?url='+encodeURI('https://calendar.google.com/calendar/ical/sfs.neeskay%40gmail.com/public/basic.ics'),title:'R/V Neeskay', prefix:'⛵', event_properties:{color:'#cceeFF'}},
	{url: '/proxy.php?url='+encodeURI('https://calendar.google.com/calendar/ical/sfs.events.calendar%40gmail.com/public/basic.ics'), title:'SFS Internal Events', prefix:'🏢', event_properties:{color:'#ffddbb'}}
]


////////////////////////////////////////////////////////////////////////////
//
// Here be dragons!
//
////////////////////////////////////////////////////////////////////////////

function data_req (url, callback) {
    req = new XMLHttpRequest()
    req.addEventListener('load', callback)
    req.open('GET', url)
    req.send()
}

function add_recur_events() {
    if (sources_to_load_cnt < 1) {
        $('#calendar').fullCalendar('addEventSource', expand_recur_events)
    } else {
        setTimeout(add_recur_events, 30)
    }
}


function load_ics(ics, cpt){
    data_req(ics.url, function(){
        $('#calendar').fullCalendar('addEventSource', fc_events(this.response, ics.event_properties));
        sources_to_load_cnt -= 1;
    })
    // Meddling with the HTML to add everything related to our ics feeds dynamically
    // hidden ics feeds
    document.getElementById("ics-feeds").insertAdjacentHTML('beforeend', "<span hidden id='ics-url"+cpt+"'>"+ics.url+"</span>");

    // calendar legend
    document.getElementById("legend-feeds").insertAdjacentHTML('beforeend', "<div class='calendar-feed'>" +
        "<button class='fc-event' id='copyLink"+cpt+"' style='_xdisplay:inline-block; _xpadding-top:0; _xpadding-left:3px; _xborder-radius:3px; background-color:"+ics.event_properties['color']+"; font-size:16px;'>"+
		""+ics.title+
	" </button></div>");


    // copy button for ics feeds
    document.querySelector("#copyLink"+cpt).addEventListener("click", function(){copy("ics-url"+cpt);});
}


$(document).ready(function() {

    // display events
    $('#calendar').fullCalendar({
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek,agendaDay,listWeek,listMonth'
        },
        defaultView: 'month',
        firstDay: '1',
        locale: 'en',
        lang: 'en',

        // customize the button names,
        // otherwise they'd all just say "list"
        views: {
          listWeek: { buttonText: 'list week' },
          listMonth: { buttonText: 'list month' }
        },
	navLinks: true,
	editable: false,
    eventLimit: true, // allow "more" link when too many events
    eventRender: function(event, element, view) {

	  if(view.name == "listMonth" || view.name == "listWeek") {
            element.find('.fc-list-item-title').append('<div style="margin-top:5px;"></div><span style="font-size: 0.9em">'+(event.description || 'no description')+'</span>'+((event.loc) ? ('<span style="margin-top:5px;display: block"><b>Venue: </b>'+event.loc+'</span>') : ' ')+'</div>');
	  } else if(view.name == "agendaWeek" || view.name == "agendaDay") {
            if(event.end == null) { event.end=event.start; }
              element.qtip({
                  content: {
                    text: '<small>'+((event.start.format("d") != event.end.format("d")) ? (event.start.format("MMM Do")
                          +(((event.end.subtract(1,"seconds")).format("d") == event.start.format("d")) ? ' ' : ' - '
                          +(event.end.subtract(1,"seconds")).format("MMM Do"))) :
			  (event.start == event.end ? event.start.format("MMM Do") : event.start.format("HH:mm")
                          +' - '+event.end.format("HH:mm")))+'</small><br/>'+
	                   '<b>'+event.title+'</b>'+
	                  ((event.description) ? ('<br/>'+event.description) : ' ')+
	                  ((event.loc) ? ('<br/><b>Venue: </b>'+event.loc) : ' ')
                  },
                  style: {
                      classes: 'qtip-bootstrap qtip-rounded qtip-shadown qtip-light',
                  },
                  position: {
                      my: 'top center',
                      at: 'bottom center',
                  }
              });
	  } else {
            if(event.end == null) { event.end=event.start; }
	    if (!element.loc) element.loc = " N/A ";
            element.qtip({
                content: {
                    text: ''+(
			    (event.start.format("d") != event.end.format("d")) ? 
			    	(event.start.format("MMM Do")
                          	+(((event.end.subtract(1,"seconds")).format("d") == event.start.format("d")) ? 
			            ' ' 
			        : 
			           ' - '+(event.end.subtract(1,"seconds")).format("MMM Do")
				 )
				) 
			  :
		            (event.start == event.end ? 
                                event.start.format("MMM Do") 
			    : 
			        event.start.format("HH:mm")
                                     +' - '+event.end.format("HH:mm")))+'<br/>'
	 	                     +'<b>['+(event.loc?event.loc.replace('GLRF ',''):"")+"] "
			             +event.title.replace('FRSHWTR ','FW ')+'</b>'
		                     +((event.description) ? 
			                 ('<br/>'+event.description) 
				     : ' ')+
		          ((event.loc) ? ('<br/><b>Venue: </b>'+event.loc) : ' ')
                },
                style: {
                    classes: 'qtip-bootstrap qtip-rounded qtip-shadown qtip-light',
                },
                position: {
                    my: 'top center',
                    at: 'bottom center',
                }
            });
          }
        }
    })
    sources_to_load_cnt = ics_sources.length
    var cpt = 0;
    for (ics of ics_sources) {
        cpt+=1;
        load_ics(ics, cpt)
    }
    add_recur_events()
})

