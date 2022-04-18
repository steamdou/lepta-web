import React, {useEffect, useState} from 'react';
import { DefaultList } from 'douhub-ui-web';
import { _window, Nothing} from 'douhub-ui-web-basic';
import dynamic from 'next/dynamic';
import { find, isNil, isArray } from 'lodash';
import { getEntityBySlug, hasAnyRole, isNonEmptyString, newGuid } from 'douhub-helper-util';
import { useContextStore } from 'douhub-ui-store';
import { observer } from 'mobx-react-lite';

let List:any = null;
if (!_window.lists) 
{
    console.log('Init - _window.lists');
    _window.lists={};
}
const ListMainArea = observer((props: Record<string, any>) => {

    const { slug } = props;
    const solution = _window.solution;
    const entity = getEntityBySlug(solution, slug);

    const contextStore = useContextStore();
    const context = JSON.parse(contextStore.data);

    const navigation = solution?.app?.navigation;
    const nav = find(navigation, (n) => { return n.slug == slug });

   

    if (isNil(nav)) List = Nothing
    if (isArray(nav.roles) && !hasAnyRole(context, nav.roles)) List = Nothing

    if (isNil(List))
    {
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
                    List = _window[slug];
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
    }
   
    return <List {...props} entity={entity}/>
});


export default ListMainArea;