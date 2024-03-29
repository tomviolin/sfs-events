// Depends on https://raw.github.com/mozilla-comm/ical.js/master/build/ical.js

function ical_events(ical, event_callback, recur_event_callback) {
    jcal_events(ICAL.parse(ical), event_callback, recur_event_callback)
}

function jcal_events(jcal, event_callback, recur_event_callback) {
    for (event of new ICAL.Component(jcal).getAllSubcomponents('vevent')) {
        console.log(event);
        console.log(event.getAllProperties());
        for (prop in event.getAllProperties()) {
            jc = prop.jCal;
            console.log(jc);
        }

        if (event.hasProperty('summary')) {
            if (event.hasProperty('location')) {
                ttlstr = event.getFirstPropertyValue('summary');
                locstr = event.getFirstPropertyValue('location');
                console.log('title: '+ttlstr+' location: '+locstr);
                ttlstr = ttlstr.replace(new RegExp('FRSHWTR ','g'),'FW ');
                ttlstr = ttlstr.replace(new RegExp('CS [0-9]+$',''),'');
                locstr = locstr.replace(new RegExp('GLRF ','g'),'');
                if (ttlstr.substr(0,1) !== "[" && locstr.substr(0,4) === "GLRF") {
                    event.updatePropertyWithValue('summary','['+locstr+'] '+ttlstr);
                }
            }
        }
        if (event.hasProperty('rrule')) {
            recur_event_callback(event)
        } else {
            event_callback(event)
            //console.log(event);
        }
        //var myevent = new ICAL.Event(event);
        //console.log(myevent.summary, myevent.description, myevent.start, myevent.end, myevent.title);
        //console.log(event.jCal[1][2][3]);
    }
}

function event_duration(event) {
    return new Date(event.getFirstPropertyValue('dtend').toJSDate() - event.getFirstPropertyValue('dtstart').toJSDate()).getTime()
}

function event_dtend(dtstart, duration) {
    return new ICAL.Time().fromJSDate(new Date(dtstart.toJSDate().getTime() + duration))
}

function expand_recur_event(event, dtstart, dtend, event_callback) {
    exp = new ICAL.RecurExpansion({
        component:event,
        dtstart:event.getFirstPropertyValue('dtstart')
    })
    duration = event_duration(event)
    while (! exp.complete && exp.next() < dtend) {
        if (exp.last >= dtstart) {
            event = new ICAL.Component(event.toJSON())
            event.updatePropertyWithValue('dtstart', exp.last)
            event.updatePropertyWithValue('dtend', event_dtend(exp.last, duration))
            event_callback(event)
        }
    }
}

