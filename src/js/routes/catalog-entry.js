import React from 'react';
import moment from 'moment';

export default class CatalogEntry extends React.Component {

    render() {
        const {data, params} = this.props;

        const fields = (data.fields && data.fields.length > 0) ? data.fields.map((field, i) => {
            if(field.value !== '')
                return <span className="event-meta-sub" key={i}><strong>{field.title}:</strong> {field.value}</span>
        }) : <span />;

        return (
            <li >
                <div>
                    {
                        (data.poster) ?
                            <div className="event-poster" dangerouslySetInnerHTML={{__html: data.poster}}></div>
                            : <div className="event-poster"><img src="http://placehold.it/640x360" /></div>
                    }
                    <div className="event-description">
                        <h2 className="event-title">{data.title}</h2>
                        <div dangerouslySetInnerHTML={{__html: data.description}}></div>
                    </div>
                    <div className="event-details">
                        {
                            (data.button && data.button.url) ?
                                <a href={data.button.url} className="event-button" target="_blank">{data.button.title}</a> : <span/>
                        }
                        <span className="event-meta">{moment(params.day + ' ' + data.start).format('lll')}</span>
                        {fields}
                    </div>
                </div>
            </li>
        );
    }
}