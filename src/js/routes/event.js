import React from 'react';
import moment from 'moment';

export default class Event extends React.Component {

    close(e) {
        this.props.router.push('/' + this.props.params.day);
    }

    render() {
        const {data, params} = this.props;
        return (
            <div className={'react-event' + ((!data) ? '' : ' active')} onClick={(e) => this.close(e)}>
                <div onClick={(e) => {e.stopPropagation()}}>
                    {
                        (!data) ? <span /> :
                            <div>
                                <span className="close" onClick={(e) => this.close(e)}>&times;</span>
                                <div className="event-image" style={{'backgroundImage': 'url(http://placehold.it/350x200/fffffff/000000)'}}></div>
                                <h2 className="event-title">{data.title}</h2>
                                <span className="event-meta">{moment(params.day + ' ' + data.start).format('lll')}</span>
                                <div className="event-content">{data.description}</div>
                            </div>
                    }
                </div>
            </div>
        );
    }
}