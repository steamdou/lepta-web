import React from 'react';
import { _window } from 'douhub-ui-web-basic';
import { ReadCard } from 'douhub-ui-web-premium';
import { CardList } from 'douhub-ui-web-premium';

const Read = (props: { data: Record<string, any> }) => {
    return <div className={`w-full flex flex-row text-left text-lg`}>
        <ReadCard data={props.data} wrapperStyle={{ padding: 0 }} />
    </div>
}

const ListMainArea = (props: Record<string, any>) => {
    return (
        <CardList {...props} Read={Read} />
    )
}


export default ListMainArea;