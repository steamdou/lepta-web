import React from 'react';
import { _window } from 'douhub-ui-web-basic';
import { CardList } from 'douhub-ui-web-premium';

const ListMainArea = (props: Record<string, any>) => {
    return (
        <CardList {...props}/>
    )
}


export default ListMainArea;