import React from 'react';
import { without } from 'lodash';
import Form from '../form/book';
import { DEFAULT_EDIT_COLUMN, DEFAULT_ACTION_COLUMN, DEFAULT_OPEN_IN_BROWSER_COLUMN, BaseList, ListTags } from 'douhub-ui-web';
import { _window } from 'douhub-ui-web-basic';
import { hasRole, isNonEmptyString } from 'douhub-helper-util';
import { observer } from 'mobx-react-lite';
import { useContextStore } from 'douhub-ui-store';
// import ListCategoriesTags from './list-categories-tags';
// import ListBase from './list-base';

const SourceList = observer((props: Record<string, any>) => {

    const { entity } = props;
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
                        <ListTags tags={data.tags} />
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
                   if (isNonEmptyString(record.url)) _window.open(record.url)
                }
        }
    }

    return (
        <BaseList
            {...props}
            // ListBase={ListBase}
            // ListCategoriesTags={ListCategoriesTags}
            allowCreate={allowCreate}
            onClickRecord={onClickRecord}
            entity={entity}
            columns={columns}
            Form={Form}
            maxFormWidth={700}
            view="grid"
            showViewToggleButton={true}
        />
    )
})


export default SourceList;