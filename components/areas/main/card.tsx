import React from 'react';
import Form from 'douhub-ui-web-premium/build/cjs/forms/card';
import { DEFAULT_EDIT_COLUMN, DEFAULT_ACTION_COLUMN, DEFAULT_OPEN_IN_BROWSER_COLUMN, BaseList, DEFAULT_SELECT_COLUMN } from 'douhub-ui-web';
import { _window, Tags } from 'douhub-ui-web-basic';
import { hasRole, isNonEmptyString } from 'douhub-helper-util';
import { observer } from 'mobx-react-lite';
import { useContextStore } from 'douhub-ui-store';
import { useEnvStore } from 'douhub-ui-store';
import { isFunction } from 'lodash';


const CardList = observer((props: Record<string, any>) => {

    const { height, entity } = props;
    const contextStore = useContextStore();
    const context = JSON.parse(contextStore.data);
    const envStore = useEnvStore();
    const envData = JSON.parse(envStore.data);

    const allowCreate = isNonEmptyString(hasRole(context, 'ORG-ADMIN') || hasRole(context, 'KNOWLEDGE-MANAGER'));

    const columns = (
        onClick: (record: Record<string, any>, action: string) => void,
        entity: Record<string, any>
    ) => {
        return [
            DEFAULT_SELECT_COLUMN(onClick, entity, {
                currentEditRecord: envData.currentEditRecord,
                currentReadRecord: envData.currentReadRecord,
                context
            }),
            {
                title: 'Title',
                dataIndex: 'display',
                id: 'display',
                render: (v: string, data: Record<string, any>) => {
                    const text = data.highlight?.searchDisplay ? data.highlight?.searchDisplay : v;
                    const searchDetail = data.highlight?.searchContent ? data.highlight?.searchContent : [];
                    return <div className="flex flex-col items-start">
                        <div className="text-base font-semibold text-gray-900 cursor-pointer" dangerouslySetInnerHTML={{ __html: text }} onClick={() => { onClick(data, 'read') }}></div>
                        {searchDetail.length > 0 && <div className="mt-1 text-sm text-gray-700" dangerouslySetInnerHTML={{ __html: searchDetail[0] }}></div>}
                        <Tags tags={data.tags} />
                    </div>
                },
            },
            DEFAULT_OPEN_IN_BROWSER_COLUMN(onClick, entity),
            DEFAULT_EDIT_COLUMN(onClick, entity),
            DEFAULT_ACTION_COLUMN(onClick, entity)
        ];
    };

    const onClickRecord = (record: Record<string, any>, action: string) => {
        switch (action) {
            case 'open-in-browser':
                {
                    _window.open(`/read/${record.slug}`);
                    break;
                }
            default:
                {
                    if (isFunction(props.onClickRecord)) props.onClickRecord(record, action);
                    break;
                }
        }
    }

    return (
        <BaseList
            {...props}
            allowCreate={allowCreate}
            onClickRecord={onClickRecord}
            height={height}
            entity={entity}
            columns={columns}
            Form={Form}
            maxFormWidth={700}
            view="grid"
            showViewToggleButton={true}
        />
    )
})


export default CardList;