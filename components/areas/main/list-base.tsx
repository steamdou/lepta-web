import {
    DEFAULT_COLUMNS, AlertField,
    Notification, DefaultForm,
    ListCategoriesTags, ListFilters,
    Splitter as SplitterInternal, ListTable, LIST_CSS, ListFormResizer
} from 'douhub-ui-web';
import { notification as antNotification } from 'antd';
import { SVG, hasErrorType, getLocalStorage, _window, CSS, _track, callAPI, setLocalStorage, Card as ICard } from 'douhub-ui-web-basic';
import { observer } from 'mobx-react-lite';
import { useEnvStore, useContextStore } from 'douhub-ui-store';
import React, { useEffect, useState } from 'react';
import { getRecordDisplay, isObject, isNonEmptyString, newGuid, setWebQueryValue, getRecordAbstract, getRecordMedia } from 'douhub-helper-util';
import { without, throttle, debounce, isNumber, map, isFunction, isArray, find, isNil, each, cloneDeep } from 'lodash';
import { useRouter } from 'next/router';
import ReactResizeDetector from 'react-resize-detector';


import { ListFormHeader as IListFormHeader } from 'douhub-ui-web';
// import IListFormHeader from './list-form-header';

import { ListReadHeader as IListReadHeader } from 'douhub-ui-web';
// import IListReadHeader from './list-read-header';

import { ListHeader as IListHeader } from 'douhub-ui-web';
// import IListHeader from './list-header';


import StackGrid from "react-stack-grid";

const MESSAGE_TITLE_RECORD_CHANGED = 'Record has been changed';
const MESSAGE_CONTENT_RECORD_CHANGED = 'Please save or cancel the changes to the current record in the edit form.';

const NonSplitter = (props: Record<string, any>) => {
    return <div className="flex flex-row w-full">
        {props.children}
    </div>
}

const DefaultNoData = (props: Record<string, any>) => {

    const { entity, search, allowCreate, tags, categories } = props;

    const onClickCreateRecord = () => {
        if (isFunction(props.onClickCreateRecord)) props.onClickCreateRecord();
    }

    const hasSearch = isNonEmptyString(search);
    const hasTags = isArray(tags) && tags.length > 0;
    const hasCategories = isArray(categories) && categories.length > 0;
    const hasNoFilter = !hasSearch && !hasTags && !hasCategories;

    return <div className="w-full">
        <p>There is no {entity.uiName?.toLowerCase()} returned from the query.</p>

        {hasNoFilter && allowCreate && <p>You can click the button below to create a new {entity.uiName?.toLowerCase()}.</p>}
        {hasNoFilter && allowCreate && <div
            onClick={onClickCreateRecord}
            className="flex cursor-pointer whitespace-nowrap inline-flex items-center justify-center py-2 px-4 rounded-md shadow-md text-xs font-medium text-white bg-green-600 hover:bg-green-700">
            <span className="hidden sm:block">Create your first {entity.uiName?.toLowerCase()}</span>
        </div>}


        {(hasSearch || hasTags || hasCategories) && <p><b>Hope the tips below can help you.</b></p>}
        {(hasSearch || hasTags || hasCategories) && <ul>
            {hasSearch && <li>* Check the spelling of your keyword</li>}
            {hasTags && <li>* Check the spelling of your tag(s)</li>}
            {hasSearch && <li>* Broaden your search by using fewer or more general word(s)</li>}
            {hasTags && <li>* Broaden your search by using fewer or more general tag(s)</li>}
            {!hasCategories && <li>* Select one or more categories to filter by categories</li>}
            {!hasTags && <li>* Select one or more tags to filter by tags</li>}
        </ul>}
    </div>
}

const FORM_RESIZER_MIN_WIDTH = 400;

const ListBase = observer((props: Record<string, any>) => {

    const { height, entity, search, tags, categories, hideListCategoriesTags, cardLayout,
        selectionType, FormFields,
        allowCreate, allowUpload, recordForMembership, lgScreen } = props;
    const ListFormHeader = props.ListFormHeader ? props.ListFormHeader : IListFormHeader;
    const ListReadHeader = props.ListReadHeader ? props.ListReadHeader : IListReadHeader;
    const ListHeader = props.ListHeader ? props.ListHeader : IListHeader;
    const envStore = useEnvStore();
    const envData = JSON.parse(envStore.data);

    const contextStore = useContextStore();
    const context = JSON.parse(contextStore.data);
    const currentEditRecord = envData.currentEditRecord;
    const currentReadRecord = envData.currentReadRecord;
    const router = useRouter();
    const solution = _window.solution;
    const defaultFormWidth = isNumber(props.defaultFormWidth) ? props.defaultFormWidth : FORM_RESIZER_MIN_WIDTH;
    const [view, setView] = useState(props.view);
    const [refreshGrid, setRefreshGrid] = useState('');
    const loadingMessage = isNonEmptyString(props.loadingMessage) ? props.loadingMessage : 'Loading ...';
    const [currentFormWidth, setCurrentFormWidth] = useState(0)
    const NoData = props.NoData ? props.NoData : DefaultNoData;
    const Card = props.Card ? props.Card : ICard;
    const formWidthCacheKey = `list-form-width-${entity?.entityName}-${entity?.entityType}`;
    const viewCacheKey = `list-view-${entity?.entityName}-${entity?.entityType}`;
    const sidePaneKey = props.sidePaneKey ? props.sidePaneKey : `sidePane-${entity?.entityName}-${entity?.entityType}`;
    const openRightDrawer = envData.openRightDrawer;
    const [loading, setLoading] = useState('');
    const [loadingType, setLoadingType] = useState({ name: 'first', pageNumber: 1 });
    const [firstLoadError, setFirstLoadError] = useState('');
    const [recordSaving, setRecordSaving] = useState('');
    const [areaWidth, setAreaWidth] = useState<number>(0);
    const [width, setWidth] = useState(0);
    const [result, setResult] = useState<Record<string, any> | null>(null);
    const [notification, setNotification] = useState<{ id: string, message: string, description: string, type: string, placement?: string } | null>(null);
    const [oriCurrentRecord, setOriCurrentRecord] = useState<Record<string, any> | null>(null);
    const [selectedRecords, setSelectedRecords] = useState<Record<string, any>>([]);
    const [predefinedFormWidth, setPredefinedFormWidth] = useState(defaultFormWidth);

    const ListForm = props.Form ? props.Form : DefaultForm;
    const ListRead = props.Read ? props.Read : null;
    const formHeightAdjust = isNumber(props.formHeightAdjust) ? props.formHeightAdjust : 70;
    const supportSlitter = props.supportSlitter == true
    const Splitter = supportSlitter ? SplitterInternal : NonSplitter;
    const CurrentListCategoriesTags = props.ListCategoriesTags ? props.ListCategoriesTags : ListCategoriesTags;
    const columns = props.columns ? props.columns : DEFAULT_COLUMNS;
    const maxListWidth = isNumber(props.maxListWidth) ? props.maxListWidth : areaWidth;

    let maxFormWidth = isNumber(props.maxFormWidth) ? props.maxFormWidth : (isNumber(entity.maxFormWidth) ? entity.maxFormWidth : 900) + 106;
    maxFormWidth = maxFormWidth > areaWidth - 20 ? areaWidth - 20 : maxFormWidth;

    const [filterSectionHeight, setFilterSectionHeight] = useState(0);
    const scope = isNonEmptyString(props.scope) ? props.scope : 'organization';

    const secondaryInitialSize = areaWidth - maxListWidth >= 350 ? areaWidth - 350 : areaWidth - 250;
    const deleteButtonLabel = isNonEmptyString(props.deleteButtonLabel) ? props.deleteButtonLabel : 'Delete';
    const deleteConfirmationMessage = isNonEmptyString(props.deleteConfirmationMessage) ? props.deleteConfirmationMessage : `Are you sure you want to delete the ${entity?.uiName.toLowerCase()}?`;

    const predefinedQueries = isArray(props.queries) && props.queries.length > 0 ? props.queries : entity.queries;
    const formWidth = predefinedFormWidth < maxFormWidth ? predefinedFormWidth : maxFormWidth;
    const giveRoomToRightArea = !lgScreen && openRightDrawer ? (areaWidth - 370 - currentFormWidth > 0 ? 370 : areaWidth - currentFormWidth) : 0;


    const showSidePane = sidePaneKey && envData[sidePaneKey] && !hideListCategoriesTags && !currentEditRecord;
    const currentEditRecordChanged = envData['currentEditRecordChanged'] == true;

    useEffect(() => {
        const newEnvData = cloneDeep(envData);
        delete newEnvData.currentEditRecord;
        delete newEnvData.currentReadRecord;
        delete newEnvData.currentEditRecordChanged;
        delete newEnvData.search;
        delete newEnvData.tags;
        delete newEnvData.categories;
        newEnvData.openRightDrawer = false;
        envStore.setData(newEnvData);
        setOriCurrentRecord(null)
    }, [entity.entityName, entity.entityType]);


    useEffect(() => {

        const cacheValue = getLocalStorage(viewCacheKey);

        if (isNil(cacheValue)) {
            setView(props.view == 'grid' ? 'grid' : 'table');
        }
        else {
            setView(cacheValue);
        }
    }, [props.view])


    const guterWidth = 20;

    const getCardSize = () => {
        switch (cardLayout) {
            case 'image-left': return 400;
            default: return 250;
        }
    }

    const getGridColumnWidth = () => {
        const count = width < 500 ? 1 : Math.floor(width / getCardSize());
        return (width - guterWidth * (count + 1)) / count;
    }

    useEffect(() => {
        //init form width from localstorage and props
        const cacheValue = getLocalStorage(formWidthCacheKey);
        if (isNumber(cacheValue)) {
            setPredefinedFormWidth(cacheValue);
        }
    }, [formWidthCacheKey, currentEditRecord?.id])


    const queries = isArray(predefinedQueries) && predefinedQueries.length > 0 ? without([
        props.hideQueryForAll == true ? null : {
            title: `All ${entity.uiCollectionName}`,
            id: 'default-all'
        }, ...predefinedQueries
    ], null) : [];
    const queryId = props.queryId ? props.queryId : (queries.length > 0 && queries[0].id);

    const statusCodes = isArray(entity.statusCodes) && entity.statusCodes.length > 0 ? [
        {
            title: `All Status`,
            id: 'default-all'
        }, ...entity.statusCodes
    ] : [];
    const statusId = props.statusId ? props.statusId : (statusCodes.length > 0 && statusCodes[0].id);
    const curStatusCode = isNonEmptyString(statusId) && find(statusCodes, (s) => { return s.id == statusId });

    const filters: any[] = without([
        isNonEmptyString(search) ? { type: 'search', text: search } : null
    ], null);

    each(tags, (tag: string) => {
        filters.push({ type: 'tag', text: tag })
    })

    each(categories, (category: Record<string, any>) => {
        filters.push({ ...category, type: 'category' });
    })

    const listHeaderHeight = 68;
    const tableHeaderHeight = 55;
    const tableHeight = height - listHeaderHeight - (filters.length == 0 ? 0 : filterSectionHeight);

    const onUpdateFormWidth = (newWidth: number) => {
        setPredefinedFormWidth(newWidth);
        setLocalStorage(formWidthCacheKey, newWidth);
    }


    const onChangeQuery = (curQuery: Record<string, any>) => {
        router.push(setWebQueryValue(`${_window.location}`, 'query', curQuery.id));
    }

    const onChangeStatus = (curStatus: Record<string, any>) => {
        console.log({ curStatus })
        router.push(setWebQueryValue(`${_window.location}`, 'status', curStatus.value));
    }

    const onResizeAreaDetector = (width?: number) => {
        setAreaWidth(width ? width : 0);
    }

    const onResizeListDetector = (width?: number) => {
        setWidth(width ? width : 0);
        setRefreshGrid(newGuid());
    }

    const onResizeForm = (width?: number) => {
        setCurrentFormWidth(width ? width : 0);
    }

    const apiCallTrigger = JSON.stringify({ queryId, statusId, loadingType, entityName: entity?.entityName, entityType: entity?.entityType, tags, categories, search });

    useEffect(() => {
        if (loadingType) {
            setLoading(loadingType.name);
            setFirstLoadError('');
            if (loadingType.name != 'more') setResult(null);

            const query: Record<string, any> = {
                entityName: entity.entityName,
                orderBy: [{ "type": "desc", "attribute": "_ts" }],
                conditions: [],
                pageSize: 25,
                pageNumber: loadingType.pageNumber
            };

            // if (_track) console.log({ recordForMembership, scope });

            if (isObject(recordForMembership) && isNonEmptyString(recordForMembership.id) && scope == 'membership') {
                query.scope = 'membership';
                query.recordIdForMembership = recordForMembership.id;
            }

            const curQuery = isNonEmptyString(queryId) && find(queries, (q) => q.id == queryId);
            if (isArray(props.conditions)) query.conditions = [...query.conditions, ...props.conditions];
            if (curQuery && isArray(curQuery.conditions)) query.conditions = [...query.conditions, ...curQuery.conditions];
            if (curStatusCode && isArray(curStatusCode.conditions)) query.conditions = [...query.conditions, ...curStatusCode.conditions];

            let apiEndpoint = `${entity?.apis?.data ? entity?.apis?.data : solution.apis.data}query`;
            if (isNonEmptyString(search)) {
                apiEndpoint = `${entity?.apis?.data ? entity?.apis?.data : solution.apis.data}search`;
                query.keywords = search;
            }

            if (isArray(tags) && tags.length > 0) {
                query.tags = tags;
            }

            if (isArray(categories) && categories.length > 0) {
                query.categoryIds = map(categories, (category: any) => { return category.id });
            }

            callAPI(solution, apiEndpoint, { query }, 'post')
                .then((r: any) => {
                    switch (loadingType.name) {
                        case 'more':
                            {
                                const newResult = {
                                    count: result?.count + r.count,
                                    continuation: r.continuation,
                                    data: [...(result ? result.data : {}), ...r.data]
                                }
                                setResult(cloneDeep(newResult));
                                break;

                            }
                        default:
                            {
                                setResult(cloneDeep(r));
                                break;

                            }
                    }

                })
                .catch((error: any) => {
                    console.error(error);
                    if (loadingType.name == 'first') setFirstLoadError('Sorry, the data was failed to load.');
                })
                .finally(() => {
                    setLoading('');
                })
        }
    }, [apiCallTrigger])

    const onClickCreateRecord = () => {
        if (currentEditRecordChanged) {
            antNotification.warning({
                message: MESSAGE_TITLE_RECORD_CHANGED,
                description: MESSAGE_CONTENT_RECORD_CHANGED,
                placement: 'top'
            });
        }
        else {
            const newRecord: Record<string, any> = { id: newGuid(), entityName: entity.entityName };
            if (isNonEmptyString(entity.entityType)) newRecord.entityType = entity.entityType;
            onClickRecord(newRecord, 'create');
        }
    }

    const onClickDeleteRecordFromForm = () => {
        if (currentEditRecord) {
            onClickDeleteRecord(cloneDeep(currentEditRecord));
        }
    }

    const onClickDeleteRecordInternal = async (entity: Record<string, any>, record: Record<string, any>, recordForMembership?: Record<string, any>) => {
        return new Promise((resolve, reject) => {

            const postData: Record<string, any> = { id: record.id }
            if (isNonEmptyString(recordForMembership?.id)) postData.recordIdForMembership = recordForMembership?.id;

            callAPI(solution, `${entity?.apis?.data ? entity?.apis?.data : solution.apis.data}delete`, postData, 'delete')
                .then(resolve)
                .catch(reject);
        });
    }

    const onClickDeleteRecord = (record: Record<string, any>) => {

        setResult({
            ...result, data: map(result?.data, (r) => {
                if (r.id == record.id) {
                    r.uiDoing = true;
                    r.uiDisabled = true;
                }
                else {
                    delete r.uiDoing;
                    delete r.uiDisabled;
                }
                return r;
            })
        });

        const callToDelete = isFunction(props.onClickDeleteRecord) ? props.onClickDeleteRecord : onClickDeleteRecordInternal;

        callToDelete(entity, record, recordForMembership)
            .then(() => {
                // if (!props.keepRecordInListAfterDelete) {
                const newResult: Record<string, any> = {
                    ...result, data: without(map(result?.data, (r) => {
                        delete r.uiDoing;
                        delete r.uiDisabled;
                        return r.id == record.id ? null : r;
                    }), null)
                };
                setResult(newResult);
                // }
                // else {
                //     setResult({
                //         ...result, data: map(result?.data, (r) => {
                //             delete r.uiDoing;
                //             delete r.uiDisabled;
                //             return r;
                //         })
                //     });
                // }
                updateCurrentRecord(null);
            })
            .catch((error: any) => {
                console.error(error);
                setResult({
                    ...result, data: map(result?.data, (r) => {
                        delete r.uiDoing;
                        delete r.uiDisabled;
                        return r;
                    })
                });
                setNotification({ id: newGuid(), message: 'Error', description: `Sorry, it was failed to delete the ${entity.uiName}.`, type: 'error' });
            })
    }

    console.log({ currentReadRecord })

    const onClickRecord = (record: Record<string, any>, action: string) => {
        switch (action) {
            case 'read':
                {
                    if (currentEditRecordChanged) {
                        setNotification({
                            id: newGuid(),
                            type: 'warning',
                            message: "Another card in the edit form",
                            description: "To avoid losing your changes, we do not allow open edit form when there is another record in the edit form.",
                            placement: 'top'
                        });
                    }
                    else {
                        updateCurrentRecord(null);
                        envStore.setValue('currentReadRecord', record);
                    }
                    break;
                }
            case 'delete':
                {
                    onClickDeleteRecord(record);
                    break;
                }
            case 'create':
            case 'edit':
                {
                    if (currentEditRecordChanged) {
                        antNotification.warning({
                            message: MESSAGE_TITLE_RECORD_CHANGED,
                            description: MESSAGE_CONTENT_RECORD_CHANGED,
                            placement: 'top'
                        });
                    }
                    else {
                        updateCurrentRecord(record, action);
                    }
                    break;
                }
            default:
                {
                    console.log({ record, action })
                }
        }
        if (isFunction(props.onClickRecord)) props.onClickRecord(record, action);
    }

    const renderNoData = () => {
        if (isNonEmptyString(firstLoadError)) return null;
        if (isNonEmptyString(loading)) return null;
        if (result?.data?.length > 0) return null;
        return <div className="w-full flex p-4">
            <NoData
                {...props}
                entity={entity}
                search={search}
                tags={tags}
                categories={categories}
                onClickCreateRecord={onClickCreateRecord} />
        </div>
    }

    const renderFirstLoadError = () => {
        if (!isNonEmptyString(firstLoadError)) return null;
        return <div className="w-full flex p-4">
            <AlertField className="pl-2" type="error" message={firstLoadError} />
        </div>
    }

    const onLoadMore = debounce(() => {
        setLoadingType({ name: `more`, pageNumber: isNumber(loadingType.pageNumber) ? loadingType.pageNumber + 1 : 1 });
    }, 200);

    const onScrollList = (e: any) => {
        if (Math.abs(e.target.scrollHeight - e.target.scrollTop - e.target.clientHeight) < 5 && !isNil(result?.continuation) && !isNonEmptyString(loading)) {
            setLoading('more');
            onLoadMore();
        }
    }

    const renderLoadingMore = () => {
        return <div className="w-full flex justify-center py-5">
            {result?.continuation && <div className="flex flex-col items-center justify-center">
                {loading == 'more' ?
                    <SVG src="/icons/loading.svg" className="spinner" style={{ width: 30, height: 30 }} /> :
                    <SVG src="/icons/expand-arrow.svg" className="cursor-pointer" style={{ width: 30, height: 30 }} onClick={onLoadMore} />}
            </div>}
        </div>
    }

    const renderFirstLoading = () => {
        if (loading != 'first') return null;
        return <div className="w-full flex p-4">
            <SVG src="/icons/loading.svg" className="spinner" style={{ width: 22, height: 22 }} />
            <span className="pl-2">{loadingMessage}</span>
        </div>
    }

    const onRowSelected = (newSelectedIds: React.Key[], newSelectedRecords: Record<string, any>[]) => {
        setSelectedRecords(newSelectedRecords);
        if (isFunction(props.onRowSelected)) props.onRowSelected(newSelectedIds, newSelectedRecords);
    }

    const renderTable = () => {
        if (view == 'grid' && !currentEditRecord) return null;
        if (loading == 'first' || isNonEmptyString(firstLoadError)) return null;
        if (isNil(result) || result?.data?.length == 0) return null;


        return <div className="w-full">
            <ListTable
                width={width}
                selectionType={selectionType} //undefined|checkbox|radio
                onRowSelected={onRowSelected}
                height={tableHeight - tableHeaderHeight}
                columns={without(without(columns(onClickRecord, entity), undefined), null)}
                data={result ? result.data : []}
            />
            {renderLoadingMore()}
        </div>
    }

    const onClickGridCard = (record: Record<string, any>) => {
        if (props.onClickGridCard) {
            props.onClickGridCard(record);
        }
        else {
            onClickRecord(record, 'read');
        }

    }

    const onRefreshGrid = debounce(() => {
        setRefreshGrid(newGuid());
    }, 200);

    const renderGrid = () => {
        if (view == 'table' || currentEditRecord) return null;
        if (loading == 'first' || isNonEmptyString(firstLoadError)) return null;
        if (isNil(result) || result?.data?.length == 0) return null;


        return <div className="w-full">
            <StackGrid
                itemComponent="div"
                gutterWidth={guterWidth}
                gutterHeight={guterWidth}
                columnWidth={getGridColumnWidth()}
                style={{ marginTop: guterWidth, marginBottom: guterWidth, paddingLeft: guterWidth / 2, paddingRight: guterWidth / 2 }}
                className={`w-full stack-grid-${refreshGrid}`}>
                {map(result ? result.data : [], (item, i) => {
                    const media = getRecordMedia(item);
                    const display = getRecordDisplay(item);
                    let content = '';

                    if (isArray(item?.highlight?.searchContent) && item?.highlight?.searchContent?.length > 0) {
                        content = item.highlight.searchContent[0];
                    }
                    else {
                        content = getRecordAbstract(item, 128, true);
                    }

                    return <Card
                        key={i}
                        layout={cardLayout}
                        onLoadImage={onRefreshGrid}
                        media={media}
                        item={item}
                        tags={tags}
                        categories={categories}
                        display={display}
                        content={content}
                        onClick={onClickGridCard} />
                })}
            </StackGrid>
            {renderLoadingMore()}
        </div>
    }

    const onClickRefresh = () => {
        setLoadingType({ name: 'first', pageNumber: 1 });
    }

    const onClickSaveRecord = (closeForm: any) => {

        const op = !currentEditRecord?._rid ? 'create' : 'update'

        if (isArray(entity.requiredFields) && entity.requiredFields.length > 0) {
            const fieldNeedValue = find(entity.requiredFields, (field) => {
                return isNil(currentEditRecord?.[field.name]);
            });

            if (fieldNeedValue) {
                return setNotification({
                    id: newGuid(),
                    message: 'Error',
                    description: `Please provide the value to the required fields (${fieldNeedValue.label})`, type: 'error'
                });
            }
        }

        setRecordSaving(op);

        const apiEndpoint = `${entity?.apis?.data ? entity?.apis?.data : solution.apis.data}${op}`;


        callAPI(solution, apiEndpoint, { data: currentEditRecord }, op == 'create' ? 'post' : 'put')
            .then((newRecord: any) => {
                const newResult: Record<string, any> = { ...result };

                if (!find(newResult.data, (r: any) => r.id == newRecord.id)) {
                    newResult.data.unshift(newRecord);
                    newResult.count = newResult.count + 1;
                }
                else {
                    newResult.data = map(newResult.data, (r) => {
                        return r.id == newRecord.id ? newRecord : r;
                    });
                }
                setResult(newResult);
                updateCurrentRecord(newRecord, 'save');
                if (closeForm) onClickCloseForm();
            })
            .catch((error: any) => {
                console.log({ error })
                if (hasErrorType(error, 'ERROR_API_USEREXISTS')) {
                    setNotification({ id: newGuid(), message: 'Error', description: `Sorry, there's already a user with the same email.`, type: 'error' });
                }
                else {
                    setNotification({ id: newGuid(), message: 'Error', description: `Sorry, it was failed to ${op} the ${entity.uiName}.`, type: 'error' });
                }
            })
            .finally(() => {
                setRecordSaving('');
            })
    }

    const updateCurrentRecord = (newRecord: Record<string, any> | null, type?: 'edit' | 'create' | 'save' | 'changed') => {

        let newCurrentRecord: Record<string, any> | null = isNil(newRecord) ? null : cloneDeep(newRecord);
        if (newCurrentRecord) newCurrentRecord.display = getRecordDisplay(newCurrentRecord);
        let newOriCurrentRecord: Record<string, any> | null = cloneDeep(oriCurrentRecord);

        if (!isNil(newRecord)) {

            switch (type) {
                case 'create':
                    {
                        newOriCurrentRecord = {};
                        break;
                    }
                case 'edit':
                    {
                        newOriCurrentRecord = newCurrentRecord;
                        break;
                    }
                case 'save':
                    {
                        newOriCurrentRecord = newCurrentRecord;
                        break;
                    }
            }
        }
        else {
            newCurrentRecord = null;
            newOriCurrentRecord = null
        }

        envStore.setValue('currentEditRecordChanged', isObject(newOriCurrentRecord) && isObject(newCurrentRecord) && JSON.stringify(newOriCurrentRecord) != JSON.stringify(newCurrentRecord));
        envStore.setValue('currentEditRecord', newCurrentRecord);
        setOriCurrentRecord(newOriCurrentRecord);
    }

    const onClickCloseForm = () => {
        updateCurrentRecord(null);
    }

    const onChangeCurrentRecord = (newData: Record<string, any>) => {
        updateCurrentRecord(newData, 'changed')
    }

    const onRemoveFilter = (filter: Record<string, any>) => {
        switch (filter.type) {
            case 'search':
                {
                    if (isFunction(props.onRemoveSearch)) props.onRemoveSearch(filter, filters);
                    break;
                }
            case 'tag':
                {
                    if (isFunction(props.onRemoveTag)) props.onRemoveTag(filter, filters);
                    break;
                }
            case 'category':
                {
                    if (isFunction(props.onRemoveCategory)) props.onRemoveCategory(filter, filters);
                    break;
                }
        }
    }

    const onClickCloseListCategoriesTags = () => {
        if (sidePaneKey) {
            envStore.setValue(sidePaneKey, false);
        }
    }

    const renderListCategoriesTags = () => {
        //className={`w-full h-full absolute xl:relative z-10 border-r xl:border-0 drop-shadow-md xl:drop-shadow-none  overflow-hidden ${showSidePane ? '' : 'hidden'}`}
        return <div className={`w-full h-full overflow-hidden ${showSidePane ? '' : 'hidden'}`}
            style={supportSlitter ? {} : { width: 320 }}>
            <CurrentListCategoriesTags height={height} entityName={entity.entityName} entityType={entity.entityType} onClickClose={onClickCloseListCategoriesTags} />
        </div>
    }

    const onChangeView = (newView: string) => {
        setLocalStorage(viewCacheKey, newView);
        setView(newView);
    }


    const renderListSection = () => {
        return <div
            className={`w-full h-full flex-1 overflow-hidden  ${showSidePane ? 'border-l' : ''} ${maxListWidth != areaWidth ? 'pr-2 border-r' : ''}`}
        >
            <ListHeader
                {...props}
                context={context}
                queryTitleMaxLength={props.queryTitleMaxLength}
                // querySelectorMinWidth={props.querySelectorMinWidth}
                statusSelectorMinWidth={props.statusSelectorMinWidth}
                recordForMembership={recordForMembership}
                currentEditRecord={currentEditRecord}
                currentEditRecordChanged={currentEditRecordChanged}
                allowCreate={allowCreate}
                allowUpload={allowUpload}
                statusCodes={statusCodes}
                statusId={statusId}
                queries={queries}
                queryId={queryId}
                entity={entity}
                maxWidth={maxListWidth}
                onClickRefresh={onClickRefresh}
                onClickCreateRecord={onClickCreateRecord}
                onChangeQuery={onChangeQuery}
                onChangeStatus={onChangeStatus}
                selectedRecords={selectedRecords}
                onChangeView={onChangeView}
                view={view}
                showViewToggleButton={props.showViewToggleButton}
            />
            {filters.length > 0 && <ListFilters
                onRemoveFilter={onRemoveFilter}
                filters={filters}
                maxWidth={maxListWidth}
                onResizeHeight={(height: number) => setFilterSectionHeight(height)}
            />}
            <div className={`list-main w-full h-full flex bg-gray-30 overflow-hidden overflow-y-auto`}
                style={{ maxWidth: maxListWidth, height: tableHeight }}
                onScroll={throttle(onScrollList, 500)}
            >
                {renderTable()}
                {renderGrid()}
                {renderFirstLoading()}
                {renderFirstLoadError()}
                {renderNoData()}
                <ReactResizeDetector onResize={throttle(onResizeListDetector, 300)} />
            </div>
        </div>
    }

    const renderForm = () => {
        if (!currentEditRecord) return null;
        if (isFunction(props.renderForm)) return props.renderForm(currentEditRecord);

        return <div className="relative h-full z-10" style={{ backgroundColor: '#fafafa', minHeight: height }}>
            <ListFormResizer
                id={currentEditRecord.id}
                onChangeSize={onUpdateFormWidth}
                defaultWidth={formWidth > areaWidth ? areaWidth : formWidth}
                className="absolute top-0 right-0"
                style={{
                    height, maxWidth: maxFormWidth, minWidth: FORM_RESIZER_MIN_WIDTH + 100,
                    borderLeft: '100px solid rgba(255, 255, 255, 0.6)', borderImage: 'linear-gradient(to left,#ffffff,transparent) 10 100%',
                    right: giveRoomToRightArea
                }}>
                <div className={`list-form w-full h-full overflow-hidden border border-0 border-l drop-shadow-lg bg-white`}>
                    <ListFormHeader
                        context={context}
                        recordForMembership={recordForMembership}
                        entity={entity}
                        deleteButtonLabel={deleteButtonLabel}
                        deleteConfirmationMessage={deleteConfirmationMessage}
                        currentRecord={currentEditRecord}
                        currentRecordChanged={currentEditRecordChanged}
                        recordSaving={recordSaving}
                        onClickClose={onClickCloseForm}
                        onClickSaveRecord={onClickSaveRecord}
                        onClickDeleteRecord={onClickDeleteRecordFromForm}
                    />
                    {isObject(currentEditRecord) && <div className="list-form-body w-full flex flex-row px-8 py-4 overflow-hidden overflow-y-auto"
                        style={{ borderTop: 'solid 1rem #ffffff', borderBottom: 'solid 1rem #ffffff', height: height - formHeightAdjust }}>
                        <ListForm
                            context={context}
                            Fields={FormFields}
                            entity={entity}
                            wrapperClassName="pb-20"
                            data={currentEditRecord}
                            onChange={onChangeCurrentRecord}
                            recordForMembership={recordForMembership} />
                    </div>}
                    <ReactResizeDetector onResize={throttle(onResizeForm, 300)} />
                </div>
            </ListFormResizer>
        </div>

    }

    const onClickEditRecord = () => {
        updateCurrentRecord(currentReadRecord, 'edit');
        envStore.setValue('currentReadRecord', null);
    }

    const onClickCloseRead = () => {
        envStore.setValue('currentReadRecord', null);
    }

    const renderReader = () => {
        if (!currentReadRecord) return null;
        if (isFunction(props.renderRead)) return props.renderRead(currentReadRecord);
        console.log({ prop: currentReadRecord })
        return ListRead && <div className="relative h-full z-10" style={{ backgroundColor: '#fafafa', minHeight: height }}>
            <ListFormResizer
                id={currentReadRecord.id}
                onChangeSize={onUpdateFormWidth}
                defaultWidth={formWidth > areaWidth ? areaWidth : formWidth}
                className="absolute top-0 right-0"
                style={{
                    height, maxWidth: maxFormWidth, minWidth: FORM_RESIZER_MIN_WIDTH + 100,
                    borderLeft: '100px solid rgba(255, 255, 255, 0.6)', borderImage: 'linear-gradient(to left,#ffffff,transparent) 10 100%',
                    right: giveRoomToRightArea
                }}>
                <div className={`list-read w-full h-full overflow-hidden border border-0 border-l drop-shadow-lg bg-white`}>
                    <ListReadHeader
                        context={context}
                        entity={entity}
                        currentRecord={currentReadRecord}
                        onClickClose={onClickCloseRead}
                        onClickEdit={onClickEditRecord}
                    />
                    {isObject(currentReadRecord) && <div className="list-read-body w-full flex flex-row px-8 py-4 overflow-hidden overflow-y-auto"
                        style={{ borderTop: 'solid 1rem #ffffff', borderBottom: 'solid 1rem #ffffff', height: height - formHeightAdjust }}>
                        <ListRead
                            context={context}
                            entity={entity}
                            data={currentReadRecord}
                            recordForMembership={recordForMembership} />
                    </div>}
                    <ReactResizeDetector onResize={throttle(onResizeForm, 300)} />
                </div>
            </ListFormResizer>
        </div>

    }

    return <>
        <CSS id={`list-css-${areaWidth == 0 ? 'server' : 'client'}`} content={`
        ${LIST_CSS}
        .douhub-list .layout-pane:last-child
        {
            min-width: ${areaWidth - 350}px;
            ${!showSidePane && 'width: 100% !important;'}
        }
        `} />

        <div className={`douhub-list relative bg-white flex flex-row overflow-hidden douhub-list-${areaWidth < 650 ? 'full' : ''} douhub-list-sidepanel-${showSidePane ? 'show' : 'hidden'}`}
            style={{ backgroundColor: '#fafafa', minHeight: height }}>
            <Splitter
                secondaryInitialSize={secondaryInitialSize}
                primaryMinSize={250}
                secondaryMinSize={areaWidth - 350}>
                {renderListCategoriesTags()}
                {renderListSection()}
            </Splitter>
            {renderForm()}
            {renderReader()}
            <ReactResizeDetector onResize={throttle(onResizeAreaDetector, 300)} />
            {notification && <Notification id={notification.id} message={notification.message} description={notification.description} type={notification.type} />}
        </div>
    </>
});

export default ListBase