import React from 'react';
import { isObject } from 'douhub-helper-util';
import HtmlField from './html';

export const ReadCard = (props: Record<string, any>) => {
    const data = isObject(props.data) ? props.data : {};
    const { content } = data;
    return <HtmlField value={content} record={data} readonly={true} onReady={props.onReady}/>
}

export default ReadCard;