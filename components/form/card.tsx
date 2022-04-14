import React, { useEffect, useState } from 'react';
import { cloneDeep,  isFunction, without } from 'lodash';
import { getBaseDomain, isNonEmptyString, isObject, newGuid } from 'douhub-helper-util';
import { _window } from 'douhub-ui-web-basic';
import { FormBase, FormPreviewButton} from 'douhub-ui-web';

const DISPLAY_NAME = 'CardForm';

const CardForm = (props: Record<string, any>) => {

    const [data, setData] = useState<Record<string, any>>({});
    const [showPublishInfo, setShowPublishInfo] = useState<boolean>(false);
    const [formVersion, setFormVersion] = useState<number>(0);

    useEffect(() => {
        const newData = isObject(props.data) ? cloneDeep(props.data) : {};
        setData(newData);
        setFormVersion(1);
    }, [props.data]);

  
    const url = getBaseDomain(`${_window.location}`).replace('/list', `/go/${data?.slug}`);
    const noteForPublish = `
        <p>You will need to publish your card for other people to find and read it online. </p>
        <p>Published card are readable for everybody on the Internet. Although you can unpublish it 
        by unselecting the 'Publish the card' checkbox at any time, the content may have been cached by search engines.</p>
        Below is the link you can share to the readers<br/> 
        <a href="${url}">${url}</a>`;

    const CARD_FORM = {
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
                        onClickInfo: () => {
                            setShowPublishInfo(!showPublishInfo);
                            setFormVersion(formVersion + 1);
                        }
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
                        name: 'publishTheCard',
                        type: 'alert-info',
                        description: noteForPublish,
                        onClose: () => {
                            setShowPublishInfo(false);
                            setFormVersion(formVersion + 1);
                        }
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
                        name: 'contentSection',
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
                        name: 'categoryIds',
                        label: "Categories",
                        type: 'tree-multi-select',
                        entityName: 'Card',
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
                        placeholder: "Type the tags of the card here",
                        alwaysShowLabel: true
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
            },
            {
                fields: [
                    {
                        name: 'sourceSection',
                        title: "Source of content",
                        subTitle: "Please provide the source of the content below",
                        type: "section"
                    }
                ]
            },
            {
                fields: [
                    {
                        name: 'sourceType',
                        type: 'picklist',
                        label: 'Type',
                        options: [
                            { value: 'book', text: 'Book' },
                            { value: 'article', text: 'Article' },
                            { value: 'video', text: 'Video' },
                            { value: 'audio', text: 'Audio' },
                        ],
                        alwaysShowLabel: true
                    }
                ]
            },
            data.sourceType == 'book' ? {
                fields: [
                    {
                        label: 'Book of the source',
                        name: 'sourceBookId',
                        type: 'lookup',
                        entityName: 'Book',
                        placeholder: "Select a book",
                        alwaysShowLabel: true
                    }
                ]
            } : null,
            data.sourceType != 'book' ? {
                fields: [
                    {
                        label: 'Url of the source',
                        name: 'sourceUrl',
                        type: 'text',
                        alwaysShowLabel: true
                    }
                ]
            } : null
        ], null)
    }


    const onChange = (changedData: Record<string, any>) => {
        const updateForm = changedData.sourceType!=data.sourceType;
        const newData = changedData ? cloneDeep(changedData) : {};
        setData(newData);
        if (updateForm) setFormVersion(formVersion+1);
        if (isFunction(props.onChange)) props.onChange(newData);
    }

    const field = {
        label: 'Book of the source',
        name: 'sourceBookId',
        type: 'lookup',
        entityName: 'Book',
        placeholder: "Select a book",
        alwaysShowLabel: true
    };
    return <div className="flex flex-col w-full">
        <FormBase {...props}
            data={data}
            form={{ ...CARD_FORM, version: formVersion }}
            wrapperClassName="pb-1"
            onChange={onChange} />
    </div>
};

CardForm.displayName = DISPLAY_NAME;
export default CardForm;