import { cloneDeep, each, find, isFunction, isArray, map } from 'lodash';
import {
    doNothing, isNonEmptyString, newGuid, insertTreeItem,
    updateTreeItem, getTreeItem, isObject, removeTreeItem
} from 'douhub-helper-util';
import {
    Select, SelectOption, Popconfirm, Tooltip,
    Dropdown, Menu, TextField, TagsField
} from 'douhub-ui-web';
import { _window, CSS, SVG, callAPI } from 'douhub-ui-web-basic';
import React, { useEffect, useState } from 'react';
import { useEnvStore } from 'douhub-ui-store';
import TreeField from './tree';

const LIST_CATEGORIES_TAGS_CSS = `
    .douhub-list-categories-header .ant-select
    {
        height: 32, width: 32px;
    }

    .douhub-list-categories-header .ant-select-selector
    {
        padding: 0 !important;
        line-height: 1;
    }

    .douhub-list-categories-header .ant-select-selection-item
    {
        font-weight: bold !important;
        font-size: 1rem;
        padding-right: 32px !important;
    }
`

const ListCategoriesTags = (props: { 
    entityName: string, entityType?: string, 
    height: number, onClickClose?: any }) => {
    const envStore = useEnvStore();
   
    const { entityName, entityType, height } = props;
    const solution = _window.solution;

    const themeColor = solution?.theme?.color;
    const [categoriesExpendedIds, setCategoriesExpendedIds] = useState<Array<string>>([]);
    const [categoriesCheckedIds, setCategoriesCheckedIds] = useState<Array<string>>([]);
    const [categoriesCheckedNodes, setCategoriesCheckedNodes] = useState<Array<string>>([]);
    const [categories, setCategories] = useState<Record<string, any>>({ entityName: 'Category', regardingEntityName: entityName, regardingEntityType: entityType, data: [] });
    const [tags, setTags] = useState<Record<string, any>>({ entityName: 'Tag', regardingEntityName: entityName, regardingEntityType: entityType, data: [] });
    const [error, setError] = useState('');
    const [refresh, setRefresh] = useState('');
    const [doing, setDoing] = useState('Loading data ...');
    const [curTab, setCurTab] = useState({ key: "categories", label: "Categories", value: "categories" });
    const [selectedId, setSelectedId] = useState('');
    const [selectedNode, setSelectedNode] = useState<Record<string,any>|null>(null);
    const [op, setOp] = useState('');
    const [categoryText, setCategoryText] = useState('');
    const uiName = curTab.value == 'categories' ? 'Category' : 'Tag';
   
    // const uiCollectionName = curTab.value == 'categories' ? 'Categories' : 'Tags';

    useEffect(() => {

        if (isNonEmptyString(entityName)) {
            setDoing('Loading data ...');
            callAPI(solution, `${solution.apis.organization}retrieve-categories-tags`,
                { regardingEntityName: entityName, regardingEntityType: entityType }, 'GET')
                .then((result: Record<string, any>) => {
                    console.log({ result })

                    each(result, (row: Record<string, any>) => {
                        if (row.entityName == 'Category') setCategories(row); //{...row, data: DATA}
                        if (row.entityName == 'Tag') setTags(row);
                    })

                })
                .catch((error) => {
                    console.error(error);
                    setError('Failed to retrieve categories.');
                })
                .finally(() => {
                    setDoing('');
                })
        }
    }, [entityName, entityType, refresh])

    const onClickClose = () => {
        if (isFunction(props.onClickClose)) props.onClickClose();
    }

    const onChangeCategories = (newData: Array<Record<string, any>>) => {

        setDoing('Updating ...');

        callAPI(solution, `${solution.apis.data}${categories.id ? 'update' : 'create'}`,
            { data: { ...categories, data: newData } }, categories.id ? 'PUT' : 'POST')
            .then((result: Record<string, any>) => {
                setCategories(result);
            })
            .catch((error) => {
                console.error(error);
                setError('Failed to save categories.');
            })
            .finally(() => {
                setDoing('');
                setOp('');
            })
    }

    const onChangeTags = (newData: Array<Record<string, any>>) => {
        doNothing(newData);
    }

    const onChangeQuery = (newTab: any) => {
        setCurTab(newTab);
    }

    const onClickAddCategory = (type: 'above' | 'below' | 'children' | 'root' | 'filter') => {
        setCategoryText('');
        setOp(`add-${type}`);
    }

    const getFilterNodes = ()=>{
        if (isArray(categoriesCheckedNodes) && categoriesCheckedNodes.length>0)
        {
            return categoriesCheckedNodes;
        }
        else
        {
            if (isObject(selectedNode)) return [selectedNode];
        }
        return [];
    }

    const onClickFilterByCategory = () => {
        const filterNodes = getFilterNodes();
        envStore.setValue('categories', map(filterNodes,(node:any)=>{
            return {id: node.key, text: node.value}
        }));
    }

    const onClickFilterButton = (newSelectedNode:Record<string,any>) => {

        setCategoriesCheckedNodes([]);
        if (selectedNode && selectedNode.id==newSelectedNode.id)
        {
            envStore.setValue('categories',  []);
        }
        else
        {
            envStore.setValue('categories',  [newSelectedNode]);
        }

    }

    const onClickRefreshCategory = () => {
        setRefresh(newGuid());
    }

    const onClickSubmitCategory = (type: string) => {

        const newId = newGuid();
        const newData = cloneDeep(categories.data);
        switch (type) {
            case 'add-root':
                {
                    if (!isNonEmptyString(categoryText)) return;
                    if (!find(newData, (i: Record<string, any>) => i.text?.toLowerCase() == categoryText.toLowerCase())) {
                        onChangeCategories([{ id: newId, text: categoryText }, ...newData]);
                    }
                    break;
                }
            case 'add-above':
                {
                    if (!isNonEmptyString(categoryText)) return;
                    onChangeCategories(insertTreeItem(newData, selectedId, { id: newId, text: categoryText }, 'above'));
                    break;
                }
            case 'add-below':
                {
                    if (!isNonEmptyString(categoryText)) return;
                    onChangeCategories(insertTreeItem(newData, selectedId, { id: newId, text: categoryText }, 'below'));
                    break;
                }
            case 'add-children':
                {
                    if (!isNonEmptyString(categoryText)) return;
                    onChangeCategories(insertTreeItem(newData, selectedId, { id: newId, text: categoryText }, 'children'));
                    setCategoriesExpendedIds([...categoriesExpendedIds, selectedId]);
                    break;
                }
            case 'delete':
                {
                    onChangeCategories(removeTreeItem(newData, selectedId));
                    break;
                }
            case 'edit':
                {
                    if (!isNonEmptyString(categoryText)) return;
                    onChangeCategories(updateTreeItem(newData, selectedId, (item?: Record<string, any>) => {
                        return { ...item, text: categoryText };
                    }));
                    break;
                }
        }
        setCategoryText('');
        setOp('');
    }

    const onDropCategory = (newData: Record<string, any>[]) => {
        onChangeCategories(newData);
    }


    const onExpandCategory = (newExpendedIds: string[]) => {
        setCategoriesExpendedIds(newExpendedIds);
    }

    const onCheckCategory = (newCkeckedIds: string[], e:any ) => {
        const {checkedNodes} = e;
        setCategoriesCheckedIds(newCkeckedIds);
        setCategoriesCheckedNodes(checkedNodes);
    }

    const onSelectCategory = (newSelectId: string, e:any) => {
        const {node} = e;
        setSelectedId(newSelectId);
        setSelectedNode(node);
        setOp('');
        setCategoryText('');
    }

    const onClickEditCategory = () => {
        const newSelected = getTreeItem(categories.data, (item?: Record<string, any>) => item?.id == selectedId)
        setCategoryText(isObject(newSelected) ? newSelected?.text : '');
        setOp('edit');
    }

    return <>
        <CSS id='douhub-list-categories-header-css' content={LIST_CATEGORIES_TAGS_CSS} />
        <div className="douhub-list-categories-header h-full overflow-hidden bg-white"
            style={{ height }}>

            <div
                className="w-full flex flex-row border-b py-4 px-4 pr-8 flex flex-row items-center bg-gray-50"
                style={{ height: 68 }}
            >
                {/* <SVG src={`/icons/hide-sidepanel.svg`}
                    style={{ width: 26, height: 26, alignSelf: 'center', cursor: 'pointer' }}
                    onClick={onClickClose}
                /> */}

                <div className="flex flex-col">
                    <Select
                        // style={{ minWidth: querySelectorMinWidth }}
                        labelInValue
                        bordered={false}
                        value={curTab}
                        disabled={isNonEmptyString(doing)}
                        onChange={onChangeQuery}
                    >
                        <SelectOption key="categories" value="categories">Categories</SelectOption>
                        <SelectOption key="tags" value="tags">Tags</SelectOption>
                    </Select>
                </div>

                {!isNonEmptyString(doing) && <div className="flex-1 flex flex-row">
                    <div className="flex-1"></div>
                    {isNonEmptyString(selectedId) && <Popconfirm
                        placement="bottom"
                        title="Delete the selected category?"
                        onConfirm={() => onClickSubmitCategory('delete')}
                        okText="Delete"
                        okType="danger"
                        cancelText="Cancel">
                        <button style={{ height: 32, width: 32 }} onClick={onClickEditCategory}
                            className="flex cursor-pointer whitespace-nowrap inline-flex items-center justify-center p-2 rounded-md shadow hover:shadow-lg text-xs font-medium bg-red-50">
                            <SVG src="/icons/delete-subnode.svg" style={{ width: 18 }} color="#333333" />
                        </button>

                    </Popconfirm>}

                    {isNonEmptyString(selectedId) && <button
                        style={{ height: 32, width: 32 }} onClick={onClickEditCategory}
                        className="flex cursor-pointer whitespace-nowrap inline-flex ml-2 items-center justify-center p-2 rounded-md shadow hover:shadow-lg text-xs font-medium bg-sky-50">
                        <SVG src="/icons/edit-node.svg" style={{ width: 18 }} color="#333333" />
                    </button>}

                    {isNonEmptyString(selectedId) && <Dropdown trigger={['click']} placement="top" overlay={
                        <Menu>
                            <Menu.Item onClick={() => onClickAddCategory('above')}>
                                Above the selected
                            </Menu.Item>
                            <Menu.Item onClick={() => onClickAddCategory('below')}>
                                Below the selected
                            </Menu.Item>
                            <Menu.Item onClick={() => onClickAddCategory('children')}>
                                As a children
                            </Menu.Item>
                        </Menu>}>
                        <button
                            style={{ height: 32, width: 32 }}
                            className="flex cursor-pointer whitespace-nowrap inline-flex ml-2 items-center justify-center p-2 rounded-md shadow hover:shadow-lg text-xs font-medium bg-green-50">
                            <SVG src="/icons/add-subnode.svg" style={{ width: 18 }} color="#333333" />
                        </button>
                    </Dropdown>}

                    {getFilterNodes() && <Tooltip color="#aaaaaa" placement='bottom' title="Filter by category">
                        <button
                            style={{ height: 32, width: 32 }} onClick={onClickFilterByCategory}
                            className="flex cursor-pointer whitespace-nowrap inline-flex ml-2 items-center justify-center p-2 rounded-md shadow hover:shadow-lg text-xs font-medium bg-white">
                            <SVG src="/icons/filter.svg" style={{ width: 18 }} color="#333333" />
                        </button>
                    </Tooltip>}

                    {!isNonEmptyString(selectedId) &&
                        <button
                            style={{ height: 32, width: 32 }} onClick={() => onClickAddCategory('root')}
                            className="flex cursor-pointer whitespace-nowrap inline-flex ml-2 items-center justify-center p-2 rounded-md shadow hover:shadow-lg text-xs font-medium bg-green-50">
                            <SVG src="/icons/add-subnode.svg" style={{ width: 18 }} color="#333333" />
                        </button>
                    }

                    {!isNonEmptyString(selectedId) &&
                        <button
                            style={{ height: 32, width: 32 }} onClick={onClickRefreshCategory}
                            className="flex cursor-pointer whitespace-nowrap inline-flex ml-2 items-center justify-center p-2 rounded-md shadow hover:shadow-lg text-xs font-medium bg-white">
                            <SVG src="/icons/refresh.svg" style={{ width: 18 }} color="#333333" />
                        </button>
                    }

                </div>
                }

                <Tooltip color="#aaaaaa" placement='top' title="Close">
                    <div onClick={onClickClose} style={{ height: 30, top: 0, right: 0 }}
                        className="absolute flex self-center cursor-pointer inline-flex items-center justify-center px-1 py-1 border-0 border-b border-l text-xs font-medium text-gray-700">
                        <SVG src="/icons/close.svg" color="#333333" style={{ width: 12 }} />
                    </div>
                </Tooltip>

            </div>
            {(op.indexOf('add-') >= 0 || op == 'edit') && <div className="w-full flex flex-row py-2 items-center px-4 border-dashed border-b bg-white" style={{ height: 55 }}>
                <TextField
                    inputWrapperStyle={{ marginBottom: 0, borderBottom: 'none' }}
                    inputStyle={{ fontSize: 12, height: 30, background: 'transparent' }}
                    onChange={(v: string) => {
                        console.log({ v })
                        setCategoryText(v)
                    }}
                    type="text"
                    placeholder={`Type ${uiName.toLowerCase()} here`}
                    value={categoryText}
                />
                <button
                    style={{ height: 20 }}
                    className="mr-1 cursor-pointer inline-flex items-center self-center justify-center py-2 px-1 rounded-sm shadow hover:shadow-lg font-medium bg-gray-50 "
                    onClick={() => setOp('')}>
                    <SVG src="/icons/x.svg" style={{ width: 12 }} color="#333333" />
                </button>
                <button
                    style={{ height: 20 }}
                    className="cursor-pointer inline-flex mr-1 items-center self-center justify-center py-2 px-1 rounded-sm shadow hover:shadow-lg font-medium bg-sky-50"
                    onClick={() => onClickSubmitCategory(op)}>
                    <SVG src="/icons/checkmark.svg" style={{ width: 12 }} color="#333333" />
                </button>
            </div>}

            {isNonEmptyString(doing) && <div className="w-full flex p-4">
                <SVG src="/icons/loading.svg" className="spinner" style={{ width: 22, height: 22 }} />
                <span className="pl-2">Loading ...</span>
            </div>}

            {isNonEmptyString(error) && !isNonEmptyString(doing) &&
                <div className="w-full flex p-6">
                    <span className="text-xs text-red-700">{error}</span>
                </div>
            }

            {!isNonEmptyString(doing) && <div className="h-full flex flex-col w-full overflow-hidden bg-white p-4" style={{ height: 'calc(100% - 42px)' }}>
                {!isNonEmptyString(error) && curTab.value == 'categories' && <TreeField
                    themeColor={themeColor}
                    disabled={isNonEmptyString(doing)}
                    value={categories.data}
                    expendedIds={categoriesExpendedIds}
                    checkedIds={categoriesCheckedIds}
                    uiName="category"
                    selectedId={selectedId}
                    onExpand={onExpandCategory}
                    onCheck={onCheckCategory}
                    onDrop={onDropCategory}
                    uiCollectionName="categories"
                    size="large"
                    onSelect={onSelectCategory}
                    onClickFilterButton={onClickFilterButton}
                />}
                {!isNonEmptyString(error) && curTab.value == 'tags' && <TagsField value={tags.data}
                    uiName="tag"
                    uiCollectionName="tags"
                    onChange={onChangeTags} />}
            </div>
            }
        </div>
    </>
};

export default ListCategoriesTags
