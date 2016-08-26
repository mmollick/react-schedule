import React from 'react';
import moment from 'moment';

export default class Event extends React.Component {

    close(e) {
        this.props.router.push('/' + this.props.params.day);
    }

    render() {
        const {data, params} = this.props;

        if(data == undefined)
            return <span />;

        const fields = (data.fields && data.fields.length > 0) ? data.fields.map((field, i) => {
            if(field.value !== '')
                return <span className="event-meta-sub" key={i}><strong>{field.title}:</strong> {field.value}</span>
        }) : <span />;

        return (
            <div className={'react-event' + ((!data) ? '' : ' active')} onClick={(e) => this.close(e)}>
                <div onClick={(e) => {e.stopPropagation()}}>
                    {
                        (!data) ? <span /> :
                            <div>
                                <span className="close" onClick={(e) => this.close(e)}>&times;</span>
                                <div className="event-poster" dangerouslySetInnerHTML={{__html: data.poster}}></div>
                                <h2 className="event-title">{data.title}</h2>
                                <span className="event-meta">{moment(params.day + ' ' + data.start).format('lll')}</span>
                                <div className="event-content">{data.description}</div>
                                <div>
                                    {fields}
                                </div>
                            </div>
                    }
                </div>
            </div>
        );
    }
}