import React from 'react';
import { isFunction, map, cloneDeep } from 'lodash';
import { LabelField, Tree, TreeNode } from 'douhub-ui-web';
import { isNonEmptyString } from 'douhub-helper-util';
import { CSS, _window, SVG } from 'douhub-ui-web-basic';

const TREE_CSS = `
.field-tree {
    display: flex;
    flex-direction: column !important;
}

.field-tree-wrapper input{
    font-size: 13px !important
}

.field-tree-wrapper .ant-tree-draggable-icon,
.field-tree-wrapper .ant-tree-switcher
{
    line-height: 1.4;
}

.field-tree-wrapper .ant-tree .ant-tree-node-content-wrapper
{
    border-radius: 3px;
    margin-right: 3px;
}

.field-tree-wrapper .ant-tree-draggable-icon
{
    min-width: 18px;
    max-width: 18px;
    width: 18px;
}

.field-tree-wrapper-large .ant-tree-treenode
{
    padding: 0 0 12px 0 !important;
    font-size: 1.1rem !important;
}

.field-tree-wrapper-large .ant-tree-draggable-icon, 
.field-tree-wrapper-large .ant-tree-switcher
{
    display: flex;
    margin-top: 6px;
    flex-direction: column;
    cursor: move;
}

.field-tree-wrapper-large .ant-tree-checkbox
{
    margin: 6px 8px 0 0;
}

.field-tree-wrapper-large .ant-tree-switcher
{
    display: flex;
    margin-top: 6px;
    flex-direction: column;
    cursor: move;
}

.field-tree-wrapper-large .ant-tree-node-selected
{
    padding: 2px 6px;
}
`

const TreeFieldNode = (props: Record<string, any>) => {
    const { item, selected, themeColor } = props;
    const { text } = item;

    const onClickFilterButton = () => {
        if (isFunction(props.onClickFilterButton)) props.onClickFilterButton(item);
    }

    const color = themeColor && isNonEmptyString(themeColor["500"]) ? themeColor["500"] : '#333333'

    return <div className="flex">
        <div className="flex-1 flex flex-col justify-center">{text}</div>
        {isFunction(props.onClickFilterButton) && <div className="flex flex-col justify-center shadow hover:shadow-lg hover:bg-white p-1 rounded-lg" style={selected?{margin:3, marginRight:0}:{margin:3, marginRight:2 }}  onClick={onClickFilterButton}>
            {selected?<SVG src="/icons/filter.svg" style={{ width: 12 }} color={color} />:<SVG src="/icons/filter.svg" style={{ width: 12 }} color="#BBBBBB" />}
        </div>}
    </div>
}

const TreeField = (props: Record<string, any>) => {

    const { label, disabled, labelStyle, alwaysShowLabel, expendedIds, size, doing, selectedId, checkedIds, value, themeColor } = props;
    const hideLabel = props.hideLabel || !isNonEmptyString(label);
    const placeholder = isNonEmptyString(props.placeholder) ? props.placeholder : '';
    const TREE_ITEM_CSS = `
        .field-tree-wrapper .ant-tree .ant-tree-node-content-wrapper.ant-tree-node-selected
        {
            background-color: ${themeColor && isNonEmptyString(themeColor["50"]) ? themeColor["50"] : '#EFEFEF'} ;
            border-radius: 8px !important;
        }
    `;
    const onDragEnter = (info: Record<string, any>) => {
        console.log(info);
    };




    const onDrop = (info: Record<string, any>) => {
        const dropKey = info.node.id;
        const dragKey = info.dragNode.id;
        const dropPos = info.node.pos.split('-');
        const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);

        const loop = (data: Array<Record<string, any>>, id: string, callback: any) => {
            for (let i = 0; i < data.length; i++) {
                if (data[i].id === id) {
                    return callback(data[i], i, data);
                }
                if (data[i].items) {
                    loop(data[i].items, id, callback);
                }
            }
        };
        const data = cloneDeep(value);

        // Find dragObject
        let dragObj: Record<string, any> = {};
        loop(data, dragKey, (item: Record<string, any>, index: number, arr: Array<Record<string, any>>) => {
            arr.splice(index, 1);
            dragObj = item;
        });

        if (!info.dropToGap) {
            loop(data, dropKey, (item: Record<string, any>) => {
                item.items = item.items || [];
                item.items.unshift(dragObj);
            });
        } else if (
            (info.node.props.items || []).length > 0 && // Has children
            info.node.props.expanded && // Is expanded
            dropPosition === 1 // On the bottom gap
        ) {
            loop(data, dropKey, (item: Record<string, any>) => {
                item.items = item.items || [];
                item.items.unshift(dragObj);
            });
        } else {
            let ar: Array<Record<string, any>> = [];
            let i = 0;

            loop(data, dropKey, (item: Record<string, any>, index: number, arr: Array<Record<string, any>>) => {
                item == null;
                ar = arr;
                i = index;
            });

            if (dropPosition === -1) {
                ar.splice(i, 0, dragObj);
            } else {
                ar.splice(i + 1, 0, dragObj);
            }
        }

        if (isFunction(props.onDrop)) props.onDrop(data);
    }

    const onSelect = (selectedKeys: React.Key[], e: any) => {
        if (isFunction(props.onSelect)) props.onSelect(selectedKeys.length > 0 ? `${selectedKeys[0]}` : '', e);
    };

    const onCheck = (checkedKeys: any, e: any) => {
         if (isFunction(props.onCheck)) props.onCheck(map(checkedKeys, (key: any) => `${key}`), e);
    };

    const onExpand = (expendedKeys: React.Key[], e: any) => {
        if (isFunction(props.onExpand)) props.onExpand(map(expendedKeys, (key: any) => `${key}`), e);
    };


    const renderTreeNodes = (items: Record<string, any>) => {
        return map(items, (item) => {
            if (item.items) {
                return (
                    <TreeNode title={<TreeFieldNode themeColor={themeColor} item={item} />} key={item.id}>
                        {renderTreeNodes(item.items)}
                    </TreeNode>
                )
            }

            return <TreeNode title={<TreeFieldNode themeColor={themeColor} item={item} selected={item.id == selectedId} onClickFilterButton={props.onClickFilterButton} />} key={item.id} />
        });
    }

    return <>
        <CSS id='tree-field-css' content={TREE_CSS} />
        {isNonEmptyString(TREE_ITEM_CSS) && <CSS id={`tree-field-item-css-${themeColor}`} content={TREE_ITEM_CSS} />}
        {isNonEmptyString(label) && <LabelField text={label} disabled={disabled} style={labelStyle}
            hidden={!(!hideLabel && (alwaysShowLabel || isNonEmptyString(value) || !isNonEmptyString(placeholder)))}
        />}
        <div className={`field-tree-wrapper field-tree-wrapper-${size == 'large' ? 'large' : 'base'} h-full overflow-hidden`}>
            <div className="field-tree overflow-hidden overflow-y-auto" style={{ height: 'calc(100% - 28px)' }}>
                <Tree
                    disabled={isNonEmptyString(doing)}
                    checkable
                    multiple={false}
                    // fieldNames={{title:'text', key: 'id', children: 'items' }}
                    defaultExpandedKeys={[]}
                    defaultSelectedKeys={[]}
                    defaultCheckedKeys={[]}
                    draggable
                    blockNode
                    selectedKeys={isNonEmptyString(selectedId) ? [selectedId] : []}
                    expandedKeys={expendedIds}
                    checkedKeys={checkedIds}
                    onExpand={onExpand}
                    onDragEnter={onDragEnter}
                    onDrop={onDrop}
                    onSelect={onSelect}
                    onCheck={onCheck}
                // treeData={value}
                >
                    {renderTreeNodes(value)}
                </Tree>
            </div>

        </div>

    </>
}

export default TreeField;


