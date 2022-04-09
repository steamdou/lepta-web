import React, { useEffect, useState } from 'react';
import { cloneDeep, isArray, isFunction, without } from 'lodash';
import { getBaseDomain, isNonEmptyString, isObject, newGuid } from 'douhub-helper-util';
import {  _window } from 'douhub-ui-web-basic';
import { PreviewButton } from './page';
import { FormBase, HtmlField } from 'douhub-ui-web';

const DISPLAY_NAME = 'CardForm';

const CardForm = (props: Record<string, any>) => {

    const [data, setData] = useState<Record<string, any>>({});
    const [showPublishInfo, setShowPublishInfo] = useState('');

    useEffect(() => {
        const newData = isObject(props.data) ? cloneDeep(props.data) : {};
        if (!isArray(newData.sections)) newData.sections = [];
        //for backward compatibility, content will be put into sections
        if (isNonEmptyString(newData.content) && newData.sections.length == 0) {
            newData.sections = [{
                type: "html",
                wrapperStyle: { minHeight: 200 },
                layoutClassName: "article",
                placeholder: "Type the content of the card below",
                value: newData.content
            },
            {
                type: "html",
                wrapperStyle: { minHeight: 200 },
                layoutClassName: "article",
                placeholder: "Type the content of the card below",
                value: newData.content
            }]
        }
        setData(newData);
    }, [props.data]);

    const onChange = (changedData: Record<string, any>) => {
        const newData = changedData ? cloneDeep(changedData) : {};
        setData(newData);
        if (isFunction(props.onChange)) props.onChange(newData);
    }

    const url = getBaseDomain(`${_window.location}`).replace('/list', `/go/${data?.slug}`);
    const noteForPublish = `
        <p>You will need to publish your card for other people to find and read it online. </p>
        <p>Published card are readable for everybody on the Internet. Although you can unpublish it 
        by unselecting the 'Publish the card' checkbox at any time, the content may have been cached by search engines.</p>
        Below is the link you can share to the readers<br/> 
        <a href="${url}">${url}</a>`

    const form = {
        rows: without([
            {
                fields: [
                    {
                        name: 'isGlobal',
                        type: 'checkbox',
                        label: "Publish the card",
                        defaultValue: false,
                        size: 'small',
                        colStyle: { width: 'auto', minWidth: 150 },
                        onClickInfo: () => { setShowPublishInfo(isNonEmptyString(showPublishInfo) ? '' : newGuid()) }
                    },
                    {
                        name: 'previewButton',
                        type: 'custom',
                        content: PreviewButton
                    }
                ]
            },
            isNonEmptyString(showPublishInfo) ? {
                fields: [
                    {
                        name: 'publishTheCard',
                        type: 'alert-info',
                        description: noteForPublish,
                        onClose: () => { setShowPublishInfo('') }
                    }
                ]
            } : null,
            {
                fields: [
                    {
                        name: 'updateFrequency',
                        label: 'Daily',
                        groupValue: 'daily',
                        type: 'checkbox',
                        size: 'small',
                        colStyle: { width: 'auto' }
                    },
                    {
                        name: 'updateFrequency',
                        label: 'Weekly',
                        groupValue: 'weekly',
                        type: 'checkbox',
                        size: 'small',
                        colStyle: { width: 'auto' }
                    },
                    {
                        name: 'updateFrequency',
                        label: 'Monthly',
                        groupValue: 'monthly',
                        type: 'checkbox',
                        size: 'small',
                        colStyle: { width: 'auto' }
                    }
                ]
            }, 
            {
                fields: [
                    {
                        name: 'content',
                        title: "Content",
                        subTitle: "Please provide the content of the page below",
                        type: "section"
                    }
                ]
            },
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
                        placeholder: "Type the title of the card here"
                    }
                ]
            },
            {
                fields: [
                    {
                        name: 'content',
                        label: "Card Content",
                        type: 'html',
                        placeholder: "Type the content of the card here"
                    }
                ]
            }
        ], null)
    }

    const onChangeData = (field: Record<string, any>, value: any) => {

        let newData: any = cloneDeep(data);
        newData[field.name] = value;

        if (isFunction(field.onChange)) {
            newData = field.onChange(field, value, newData);
        }

        onChange(newData);
    }

    const htmlField = {
        name: 'test',
        label: "Test",
        type: 'html',
        placeholder: "Type the test of the page here"
    }

    return <div className="flex flex-col w-full">
        <FormBase {...props} data={data} form={{ ...form, id: showPublishInfo }} wrapperClassName="pb-1" onChange={onChange} />
        <HtmlField {...htmlField} value={data.test} record={data}
            onChange={(v: string) => onChangeData(htmlField, v)} />
    </div>
};

CardForm.displayName = DISPLAY_NAME;
export default CardForm;