import React from 'react';
import moment from 'moment';
import { Link, withRouter } from 'react-router';
import { slugify } from '../index';
import Event from './event';

class App extends React.Component {

    componentWillMount() {
        this.pixelsPerHour = 96;
        this.mountDay();
        this.getEvent();
    }

    componentWillReceiveProps() {
        this.mountDay();
        this.getEvent();
    }

    /**
     * Returns the current day's venue/event data
     * @returns {*}
     */
    getDaysData() {
        const {data} = this.props.route;
        const {params} = this.props;

        // Does this data include days?
        if(data.days) {

            // Return the specified date or just the first one
            return (params.day) ? data.days.filter((day) => {
                return (moment(params.day).isSame(day.date, 'day'));
            })[0] : data.days[0];
        }
        return data;
    }

    /**
     * Mounts the current specified day
     * @returns void
     */
    mountDay() {
        const data = this.getDaysData();

        this.earliest = data.start.replace(':', '') / 100 || 24;
        this.latest = data.end.replace(':', '') / 100 || 0;


        // Calculate the earliest event time and latest event time for the day..
        // Earliest time will be the earliest event's start time rounded down to
        // the nearest hour.
        // Latest time will be the latest event's start time plus it's run time
        // rounded to up  to the nearest hour.
        data.venues.map((venue) => {
            venue.events.map((event) => {
                this.earliest = Math.min(this.earliest, Math.floor(event.start.replace(':', '') / 100));
                this.latest = Math.max(this.latest, Math.ceil((Number(event.start.replace(':', '')) + event.length) / 100));
            });
        });
    }

    /**
     * Returns the date selectors
     * @returns {XML}
     */
    getDateSelection() {
        const {data} = this.props.route;
        const {params} = this.props;

        // No date selection is needed
        if(!data.days || data.days < 2)
            return <span />;

        return (
            <section className="react-dates">
                <ul>
                    {
                        // Sort the items
                        data.days.sort((a, b) => {
                            if(moment(a.date).isBefore(b.date))
                                return -1;
                            else if(moment(a.date).isAfter(b.date))
                                return 1;
                            return 0;
                        }).map((day, i) => {
                            let date = moment(day.date).format('Do').toString().match(/([0-9]+)([a-z]+)/);
                            // Don't link the active day
                            if((!params.day && i === 0) || (params.day && moment(params.day).isSame(day.date, 'day')))
                                return (
                                    <li className="active" key={i}>
                                        <span className="weekday">
                                            {moment(day.date).format('dddd')}
                                        </span>
                                        <span className="date">
                                            {date[1]}<span>{date[2]}</span>
                                        </span>
                                    </li>
                                );
                            else
                                return (
                                    <li key={i}>
                                        <Link to={moment(day.date).format('YYYY-MM-DD')}>
                                            <span className="weekday">
                                                {moment(day.date).format('dddd')}
                                            </span>
                                            <span className="date">
                                                {date[1]}<span>{date[2]}</span>
                                            </span>
                                        </Link>
                                    </li>
                                );
                        })
                    }
                </ul>
            </section>
        )
    }

    /**
     * Returns the venue list
     * @returns {Array}
     */
    getVenues() {
        const data = this.getDaysData();
        return data.venues.map((venue, i) => {
            return <li key={i}><span className="row-heading"><span>{venue.title}</span></span></li>
        });
    }

    /**
     * Returns a list of the times between the earliest and latest
     * @returns {Array}
     */
    getTimeframe() {
        let times = [];
        for(let i = this.earliest; i <= this.latest; i++) {
            let label = moment({hour: i});
            times.push(<li key={i}><span className="time-label">{label.format('h:mm a')}</span></li>)
        }
        return times;
    }

    /**
     * Returns the events
     * @returns {Array}
     */
    getEvents() {
        const data = this.getDaysData();
        return data.venues.map((venue, i) => {
            return <li key={i}>
                {
                    venue.events.map((event, i) => {
                        // We need to calculate the nearest hour and then the
                        // get the minute offset (.5 hours is 30 minutes)
                        const hours = Math.floor(event.start.replace(':', '') / 100);
                        const minutes = (event.start.replace(':', '') / 100 - hours) / 0.6;

                        // Calculate the position and length for the event's dev
                        let pos = {
                            left: (this.pixelsPerHour * (hours - this.earliest + minutes)) + 'px',
                            width: (this.pixelsPerHour * (event.length / 60)) + 'px'
                        };

                        return (
                            <Link key={i} to={'/' + moment(data.date).format('YYYY-MM-DD') + '/venue/' + slugify(venue.title) + '/event/' + slugify(event.title) + '/' + event.start}>
                                <span key={i} title={event.title} style={pos} className="time-entry">
                                    <small>{event.title}</small>
                                </span>
                            </Link>
                        );
                    })
                }
            </li>;
        });
    }

    /**
     * Grabs the specified event (if specified); Will redirect to the specified
     * date if no event was found with the same venue/title/start
     * @returns {*}
     */
    getEvent() {
        const {params} = this.props;
        if(!params.venue || !params.event || !params.start)
            return;

        // Lets filter down to the correct venue data
        const venue = this.getDaysData().venues.filter((data) => {
            return (slugify(data.title) === params.venue);
        })[0];

        // Unable to find venue...
        if(!venue) {
            this.props.router.push('/' + params.day);
            return;
        }

        // Filter down to the correct event data
        const event = venue.events.filter((data) => {
            return (slugify(data.title) === params.event && data.start.toString() === params.start);
        })[0];

        // Unable to find event...
        if(!event) {
            this.props.router.push('/' + params.day);
            return;
        }

        return event;
    }

    /**
     * Renders the schedule
     * @returns {XML}
     */
    render() {
        return (
            <div>
                {this.getDateSelection()}
                <aside className="react-venues">
                    <ul>
                        {this.getVenues()}
                    </ul>
                </aside>
                <section className="react-events">
                    <div className="time">
                        <header>
                            <ul>
                                {this.getTimeframe()}
                            </ul>
                        </header>
                        <ul className="room-timeline">
                            {this.getEvents()}
                        </ul>
                    </div>
                </section>
                <Event data={this.getEvent()} {...this.props} />
            </div>
        );


    }

}

export default withRouter(App);