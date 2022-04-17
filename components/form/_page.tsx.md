import React, { useEffect, useState } from 'react';
import { cloneDeep, isArray, isFunction, without } from 'lodash';
import { getBaseDomain, isNonEmptyString, isObject, newGuid } from 'douhub-helper-util';
import { FormBase, FormPreviewButton } from 'douhub-ui-web';
// import FormBase from './base';
import {  _window } from 'douhub-ui-web-basic';
import SectionsField from './sections';

const DISPLAY_NAME = 'PageForm';

const PageForm = (props: Record<string, any>) => {

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
                placeholder: "Type the content of the page below",
                value: newData.content
            },
            {
                type: "html",
                wrapperStyle: { minHeight: 200 },
                layoutClassName: "article",
                placeholder: "Type the content of the page below",
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

    const onChangeSections = (sections: Record<string, any>[]) => {
        onChange({ ...data, sections: cloneDeep(sections) });
    }

    const url = getBaseDomain(`${_window.location}`).replace('/list', `/go/${data?.slug}`);
    const noteForPublish = `
        <p>You will need to publish your page for other people to find and read it online. </p>
        <p>Published page are readable for everybody on the Internet. Although you can unpublish it 
        by unselecting the 'Publish the page' checkbox at any time, the content may have been cached by search engines.</p>
        Below is the link you can share to the readers<br/> 
        <a href="${url}">${url}</a>`

    const form = {
        rows: without([
            {
                fields: [
                    {
                        name: 'isGlobal',
                        type: 'checkbox',
                        label: "Publish the page",
                        defaultValue: false,
                        size: 'small',
                        colStyle: { width: 'auto', minWidth: 150 },
                        onClickInfo: () => { setShowPublishInfo(isNonEmptyString(showPublishInfo) ? '' : newGuid()) }
                    },
                    {
                        name: 'previewButton',
                        type: 'custom',
                        content: FormPreviewButton
                    }
                ]
            },
            isNonEmptyString(showPublishInfo) ? {
                fields: [
                    {
                        name: 'publishThePage',
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
                        colStyle: { width: 'auto' },
                        value: data?.updateFrequency,
                    },
                    {
                        name: 'updateFrequency',
                        label: 'Weekly',
                        groupValue: 'weekly',
                        type: 'checkbox',
                        size: 'small',
                        colStyle: { width: 'auto' },
                        value: data?.updateFrequency,
                    },
                    {
                        name: 'updateFrequency',
                        label: 'Monthly',
                        groupValue: 'monthly',
                        type: 'checkbox',
                        size: 'small',
                        colStyle: { width: 'auto' },
                        value: data?.updateFrequency,
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
                        name: 'title',
                        type: 'textarea',
                        headFontSize: "h2",
                        placeholder: "Type the title of the page here",
                        value: data?.title
                    }
                ]
            },
            isNonEmptyString(data?.title) ? {
                fields: [
                    {
                        name: 'showTitle',
                        label: "Show the page title on the page",
                        type: 'checkbox',
                        defaultValue: true,
                        size: 'small'
                    }
                ]
            } : null,
            {
                fields: [
                    {
                        name: 'description',
                        label: "Page Description",
                        type: 'textarea',
                        placeholder: "Type the description of the page here"
                    }
                ]
            },
            isNonEmptyString(data?.description) ? {
                fields: [
                    {
                        name: 'showDescription',
                        label: "Show the page description on the page",
                        type: 'checkbox',
                        defaultValue: true,
                        size: 'small'
                    }
                ]
            } : null,
            {
                fields: [
                    {
                        name: 'sections',
                        title: "Sections",
                        subTitle: "Please provide the sections of the page below",
                        type: "section"
                    }
                ]
            }
            // ,
            // {
            //     fields: [
            //         {
            //             name: 'content',
            //             type: "html",
            //             wrapperStyle: { minHeight: 200 },
            //             layoutClassName: "article",
            //             placeholder: "Type the content of the page below"
            //         }
            //     ]
            // }
        ], null)
    }

    return <div className="flex flex-col w-full">
        <FormBase {...props} data={data} form={form} wrapperClassName="pb-1" onChange={onChange} />
        <SectionsField record={data} name="sections" onChange={onChangeSections} />
    </div>
};

PageForm.displayName = DISPLAY_NAME;
export default PageForm;