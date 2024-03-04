import * as React from 'react';

import BackNews from './back';
import RenderNew from './renderNews';
import user from 'Managers/UserManager';
import dataManager from 'Managers/DataManager';

import Text from 'Interface/Components/Text';
import Swiper from 'Interface/Components/Swiper';

class News extends BackNews {
    state = {
        pagesNews: []
    }

    constructor(props) {
        super(props);

        if (dataManager.news.news.length) {
            try {
                const news = dataManager.news.news.map(RenderNew);
                this.state.pagesNews.push(...news);
            } catch (e) {
                user.interface.console.AddLog('error', 'News loading failed: ' + e);
            }
        }
    }

    renderRecapNZD = () => {
        return (
            <Text>RenderRecapNZD</Text>
        );
        return null;
    }

    renderRecapMyquests = () => {
        return (
            <Text>RenderRecapMyquests</Text>
        );
        return null;
    }

    render() {
        const { pagesNews } = this.state;

        const pages = [
            this.renderRecapNZD(),
            this.renderRecapMyquests(),
            ...pagesNews
        ];

        return (
            <Swiper
                style={this.props.style}
                pages={pages}
            />
        );
    }
};

export default News;
