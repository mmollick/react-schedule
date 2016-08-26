/**
 * Copyright (c) 2015 NeverBounce
 * Original Author: Mike Mollick
 * -----------------------------
 * Renders pagination using react-router
 */

import React from 'react';
import {Link} from 'react-router';

export default class Pagination extends React.Component {

    //static defaultProps = {
    //    route: '', // The route prefix for links
    //    pageSeparator: 'page', // The page number separator for friendly URLs (ex: lists/page/2)
    //    currentPage: 1, // What's the current page?
    //    totalPages: 1, // How many pages are their in total?
    //    visibleRange: 5, // How many number links should we display?
    //}

    /**
     * Generate links using given route and page separator
     * @param page
     * @returns {string}
     */
    getRoute(page) {
        let {route} = this.props;
        return  route + '/page/' + page;
    }

    /**
     * Generate the pagination links
     * @param start
     * @param end
     * @param current
     * @param total
     * @returns {Array}
     */
    getNodes(start, end, current, total) {
        let html = [];

        // Previous & first buttons
        if (current > 1) {
            html.push((
                <li key={Math.random()}>
                    <Link to={this.getRoute(1)} aria-label="Previous">
                        <span aria-hidden="true">&laquo;</span>
                    </Link>
                </li>
            ));
            html.push((
                <li key={Math.random()}>
                    <Link to={this.getRoute(Math.max(current - 1, 1))} aria-label="Previous">
                        <span aria-hidden="true">&lsaquo;</span>
                    </Link>
                </li>
            ));
        }

        // Page links
        for (var i = start; i < end; i++) {
            html.push((<li key={Math.random()} className={(i + 1 === current) ? 'active' : ''}><Link to={this.getRoute(i + 1)} activeClassName="active">{i + 1}</Link></li>))
        }

        // Next & last buttons
        if (current < total) {
            html.push((
                <li key={Math.random()}>
                    <Link to={this.getRoute(Math.min(current + 1, total))} aria-label="Next">
                        <span aria-hidden="true">&rsaquo;</span>
                    </Link>
                </li>
            ));
            html.push((
                <li key={Math.random()}>
                    <Link to={this.getRoute((total))} aria-label="Next">
                        <span aria-hidden="true">&raquo;</span>
                    </Link>
                </li>
            ));
        }

        return html;
    }

    /**
     * Renders Pagination
     * @returns {XML}
     */
    render() {
        let {currentPage, totalPages, visibleRange} = this.props;

        let leftRange = Math.floor((visibleRange - 1) / 2); // How far back should we start the links?
        let start = Math.max(currentPage - leftRange, 0); // The first page number to display
        let end = start + visibleRange; // The last page number to display

        // Don't display links to non existent pages
        if (end > totalPages) {
            start = Math.max(totalPages - visibleRange, 0);
            end = totalPages;
        }

        let nodes = this.getNodes(start, end, currentPage, totalPages);

        // No page numbers to display? return empty span
        if(totalPages < 2)
            return <span/>;

        return (
            <nav className="pagination">
                <ul>
                    {nodes}
                </ul>
            </nav>
        )
    }

}