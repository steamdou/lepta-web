import React from 'react';
import { _window } from 'douhub-ui-web-basic';
import { BookList } from 'douhub-ui-web-premium';

const ListMainArea = (props: Record<string, any>) => {
    return (
        <BookList {...props}/>
    )
}


export default ListMainArea;