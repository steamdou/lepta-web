import React from 'react';
import { without } from 'lodash';
import PageForm from '../form/page';
import { DEFAULT_EDIT_COLUMN, DEFAULT_ACTION_COLUMN, DEFAULT_OPEN_IN_BROWSER_COLUMN } from 'douhub-ui-web';

import { _window } from 'douhub-ui-web-basic';
import { hasRole, isNonEmptyString } from 'douhub-helper-util';
import { observer } from 'mobx-react-lite';
import { useContextStore } from 'douhub-ui-store';
// import ListCategoriesTags from './list-categories-tags';
import { ListCategoriesTags } from 'douhub-ui-web';

// import BaseList from './_base';
import { BaseList } from 'douhub-ui-web';

const PageList = observer((props: Record<string, any>) => {
    const { entity, height, search, webQuery } = props;
    const contextStore = useContextStore();
    const context = JSON.parse(contextStore.data);

    const allowCreate = isNonEmptyString(hasRole(context, 'ORG-ADMIN') || hasRole(context, 'KNOWLEDGE-MANAGER'));

    const columns = (
        onClick: (record: Record<string, any>, action: string) => {},
        entity: Record<string, any>
    ) => {
        return without([
            {
                title: 'Title',
                dataIndex: 'display',
                id: 'display',
                render: (v: string, data: Record<string, any>) => {
                    const text = data.highlight?.searchDisplay ? data.highlight?.searchDisplay : v;
                    const searchDetail = data.highlight?.searchContent ? data.highlight?.searchContent : [];

                    return <div className="flex flex-col items-start">
                        <div className="text-sm font-normal text-gray-900" dangerouslySetInnerHTML={{ __html: text }}></div>
                        {searchDetail.length > 0 && <div className="mt-1 text-xs font-light text-gray-900" dangerouslySetInnerHTML={{ __html: searchDetail[0] }}></div>}
                    </div>
                },
            },
            DEFAULT_OPEN_IN_BROWSER_COLUMN(onClick, entity),
            DEFAULT_EDIT_COLUMN(onClick, entity),
            DEFAULT_ACTION_COLUMN(onClick, entity)
        ], undefined);
    };

    const onClickRecord = (record: Record<string, any>, action: string) => {
        switch (action) {
            case 'open-in-browser':
                {
                    _window.open(`/read/${record.slug}`)
                }
        }
    }

    return (
        <BaseList
            ListCategoriesTags={ListCategoriesTags}
            allowUpload={false}
            allowCreate={allowCreate}
            webQuery={webQuery}
            search={search}
            onRemoveSearch={props.onRemoveSearch}
            onClickRecord={onClickRecord}
            selectionType="checkbox"
            height={height}
            entity={entity}
            columns={columns}
            Form={PageForm}
            maxFormWidth={1000}
            view="grid"
            showViewToggleButton={true}
        />
    )
})


export default PageList;