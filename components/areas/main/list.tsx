import React from 'react';
import { getEntityBySlug, hasAnyRole} from 'douhub-helper-util';
import { DefaultList } from 'douhub-ui-web';
import { _window, Nothing} from 'douhub-ui-web-basic';
import dynamic from 'next/dynamic';
import { useContextStore } from 'douhub-ui-store';
import {find, isNil, isArray} from 'lodash';

const Lists: Record<string, any> = {};
let List = null;

const ListMainArea = (props: Record<string, any>) => {
    const { slug, height, search, query } = props;
    const solution = _window.solution;
    const entity = getEntityBySlug(solution, slug);

    const contextStore = useContextStore();
    const context = JSON.parse(contextStore.data);

    const navigation = solution?.app?.navigation;
    const nav = find(navigation, (n)=>{return n.slug==slug});

    if (isNil(nav)) return <Nothing/>
    if (isArray(nav.roles) && !hasAnyRole(context, nav.roles)) return <Nothing/>

    switch (entity?.entityName) {
         case 'Page':
            {
                if (!Lists[slug]) Lists[slug] = dynamic(() => import("../../list/page"), { ssr: false });
                List = Lists[slug];
                break;
            }
        case 'User':
            {
                if (!Lists[slug]) Lists[slug] = dynamic(() => import("../../list/user"), { ssr: false });
                List = Lists[slug];
                break;
            }
        case 'Card':
            {
                if (!Lists[slug]) Lists[slug] = dynamic(() => import("../../list/card"), { ssr: false });
                List = Lists[slug];
                break;
            }
        default:
            {
                List = DefaultList;
            }
    }

    return (
        <List
            onRemoveSearch={props.onRemoveSearch}
            search={search}
            height={height}
            entity={entity}
            webQuery={query}
        />
    )
}


export default ListMainArea;