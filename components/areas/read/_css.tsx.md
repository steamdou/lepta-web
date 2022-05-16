import React, { useEffect, useState } from 'react';
import { isNonEmptyString } from 'douhub-helper-util';
import { _window } from 'douhub-ui-web-basic';
import { useCssStore } from 'douhub-ui-store';

const CSS = (props: Record<string, any>) => {

    const { id, content } = props;
    const cssStore = useCssStore();

    useEffect(() => {
        if (!_window.css) _window.css = {};
        if (isNonEmptyString(id) && !_window.css[id]) {
            _window.css[id] = true;
            console.log({cssStore: {id, content}})
            cssStore.setCSS(id, content);
        }   
    }, []);

    return <></>
}


CSS.displayName = 'CSS';
export default CSS;