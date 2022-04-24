import React, { useEffect, useState } from 'react';
import { DefaultList } from 'douhub-ui-web';
import { _window, Nothing } from 'douhub-ui-web-basic';
import dynamic from 'next/dynamic';
import { find, isNil, isArray } from 'lodash';
import { getEntityBySlug, hasAnyRole, isObject } from 'douhub-helper-util';
import { useContextStore } from 'douhub-ui-store';
import { observer } from 'mobx-react-lite';
import { ListBase } from 'douhub-ui-web';
// import ListBase from './list-base';

let List: any = null;
if (!_window.lists) {
    console.log('Init - _window.lists');
    _window.lists = {};
}
const ListMainArea = observer((props: Record<string, any>) => {

    const { slug } = props;
    const solution = _window.solution;
    const entity = getEntityBySlug(solution, slug);
    const [showNothing, setShowNothing] = useState(true);
    const contextStore = useContextStore();
    const context = JSON.parse(contextStore.data);

    const navigation = solution?.app?.navigation;
    const nav = find(navigation, (n) => { return n.slug == slug });

    useEffect(() => {
        if (isObject(nav) && (!isArray(nav.roles) || isArray(nav.roles) && hasAnyRole(context, nav.roles))) {
            setShowNothing(false);
        }
    }, [context, nav])


    switch (slug?.toLowerCase()) {
        case 'page':
            {
                if (!_window.lists[slug]) _window.lists[slug] = dynamic(() => import("./pages"), { ssr: false });
                List = _window.lists[slug];
                break;
            }
        case 'user':
            {
                if (!_window.lists[slug]) _window.lists[slug] = dynamic(() => import("./users"), { ssr: false });
                List = _window.lists[slug];
                break;
            }
        case 'book':
            {
                if (!_window.lists[slug]) _window.lists[slug] = dynamic(() => import("./books"), { ssr: false });
                List = _window.lists[slug];
                break;
            }
        case 'card':
            {
                if (!_window.lists[slug]) _window.lists[slug] = dynamic(() => import("./cards"), { ssr: false });
                List = _window.lists[slug];
                break;
            }
        default:
            {
                List = DefaultList;
                break;
            }
    }

    return showNothing ? <Nothing /> : <List {...props} entity={entity} ListBase={ListBase} />
});


export default ListMainArea;