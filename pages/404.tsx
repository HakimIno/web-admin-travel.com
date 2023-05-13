import React from 'react';

import { Page } from '../types/types';

const Custom404: Page = () => {
    return <h1>404</h1>;
};

Custom404.getLayout = function getLayout(page) {
    return page;
};

export default Custom404;
