import React from 'react';
import { getEntityBySlug } from 'douhub-helper-util';
import { DefaultList } from 'douhub-ui-web';
import { _window} from 'douhub-ui-web-basic';
import dynamic from 'next/dynamic';

const Lists: Record<string, any> = {};
let List = null;

const UserMainArea = (props: Record<string, any>) => {
    const { slug, height, search, query } = props;
    const solution = _window.solution;
    const entity = getEntityBySlug(solution, slug);

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


export default UserMainArea;