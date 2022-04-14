import React, { useEffect, useState } from 'react';
import { cloneDeep,  isFunction } from 'lodash';
import {  isObject } from 'douhub-helper-util';
import { _window } from 'douhub-ui-web-basic';
import { FormBase } from 'douhub-ui-web';

const DISPLAY_NAME = 'BookForm';
export const BOOK_FORM = {
    rows: [
        {
            fields: [
                {
                    uploaderLabel: 'Upload Photo',
                    name: 'media',
                    autoPreviewResize: true,
                    allowEditUrl: true,
                    type: 'upload-photo',
                    placeholder: "Upload a photo here"
                }
            ]
        },
        {
            fields: [
                {
                    name: 'title',
                    type: 'textarea',
                    headFontSize: "h2",
                    placeholder: "Type the title here"
                }
            ]
        },
        {
            fields: [
                {
                    name: 'url',
                    type: 'text',
                    headFontSize: "Url",
                    placeholder: "Type the url here",
                    alwaysShowLabel: true
                }
            ]
        },
        {
            fields: [
                {
                    name: 'categoryIds',
                    label: "Categories",
                    type: 'tree-multi-select',
                    entityName: 'Book',
                    placeholder: "Select categories",
                    alwaysShowLabel: true
                }
            ]
        },
        {
            fields: [
                {
                    name: 'tags',
                    label: "Tags",
                    type: 'tags',
                    placeholder: "Type the tags here",
                    alwaysShowLabel: true
                }
            ]
        },
        {
            fields: [
                {
                    name: 'introduction',
                    label: "Introduction",
                    type: 'html',
                    placeholder: "Type the introduction here",
                    alwaysShowLabel: true
                }
            ]
        }
    ]
}

const BookForm = (props: Record<string, any>) => {

    const [data, setData] = useState<Record<string, any>>({});

    useEffect(() => {
        const newData = isObject(props.data) ? cloneDeep(props.data) : {};
        setData(newData);
    }, [props.data]);


    const onChange = (changedData: Record<string, any>) => {
        const newData = changedData ? cloneDeep(changedData) : {};
        setData(newData);
        if (isFunction(props.onChange)) props.onChange(newData);
    }

    return <div className="flex flex-col w-full">
        <FormBase {...props} data={data} form={BOOK_FORM} wrapperClassName="pb-1" onChange={onChange} />
    </div>
};

BookForm.displayName = DISPLAY_NAME;
export default BookForm;