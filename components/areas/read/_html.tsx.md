import React, { useEffect, useState } from 'react';
import { isFunction } from 'lodash';
import { LabelField } from 'douhub-ui-web';
import { SVG, CSS, _window } from 'douhub-ui-web-basic';
import { isNonEmptyString, newGuid } from 'douhub-helper-util';
import { useEditor, EditorContent, BubbleMenu, ReactNodeViewRenderer, FloatingMenu } from '@tiptap/react';
import Typography from '@tiptap/extension-typography';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Dropcursor from '@tiptap/extension-dropcursor';
import StarterKit from '@tiptap/starter-kit';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import HtmlFieldCode from 'douhub-ui-web/build/cjs/fields/html-code';
import Highlight from '@tiptap/extension-highlight';
import { Color } from '@tiptap/extension-color';

import { HTML_FIELD_CSS } from 'douhub-ui-web/build/cjs/fields/html-css';
import { HTML_FIELD_CODE_CSS } from 'douhub-ui-web/build/cjs/fields/html-code-css';
import lowlight from 'lowlight';
import { ARTICLE_CSS } from './article-css';

import HtmlFieldFloatEditToolbar from './html-float-edit-toolbar';
import HtmlFieldFloatInsertToolbar from './html-float-insert-toolbar';
import HtmlFieldFloatHighlightToolbar from './html-float-highlight-toolbar';

// load specific languages only
// import lowlight from 'lowlight/lib/core'
// import javascript from 'highlight.js/lib/languages/javascript'
// lowlight.registerLanguage('javascript', javascript)


const HtmlField = (props: Record<string, any>) => {

    const { label, disabled, style,
        labelStyle, alwaysShowLabel,
        name, wrapperStyle, supportSourceCode,
        highlightColors, onClickCreateNote,
        hideH1, hideH2, hideH3, supportHighlight,
        readonly,
        hideH4, record } = props;
    const hideLabel = props.hideLabel || !isNonEmptyString(label);

    const defaultValue = isNonEmptyString(props.defaultValue) ? props.defaultValue : '';
    const placeholder = isNonEmptyString(props.placeholder) ? props.placeholder : '';
    const [value, setValue] = useState(isNonEmptyString(props.value) ? props.value : defaultValue);
    const [id] = useState(newGuid());
    const layoutClassName = props.layoutClassName ? props.layoutClassName : '';

    useEffect(() => {
        const newValue = isNonEmptyString(props.value) ? props.value : defaultValue;
        setValue(newValue);
    }, [props.value, defaultValue]);

    const onEvent = (editor: any, action?: string) => {

        const html = editor.getHTML();
        let fieldEditor: any = document.getElementsByClassName(`field-html-${id}`);
        fieldEditor = fieldEditor.length > 0 && fieldEditor[0];

        if (action == 'init' && readonly) {
            setTimeout(() => {
                if (readonly) {
                    const editorDiv = fieldEditor?.children[0]?.children;
                    if (editorDiv && editorDiv.length > 0) {
                        editorDiv[0].setAttribute('contenteditable', 'false');

                        //remove empty br
                        const fieldEmptyBr: any = fieldEditor.getElementsByClassName(`ProseMirror-trailingBreak`);
                        for (let i = 0; i < fieldEmptyBr.length; i++) {
                            if (fieldEmptyBr[i].tagName == 'BR' && fieldEmptyBr[i].parentElement.children.length == 1) {
                                fieldEmptyBr[i].parentElement.remove();
                            }
                        }

                        if (isFunction(props.onReady)) props.onReady();
                    }
                }
            }, 200);
        }

        if ((action == 'init' || action == 'blur') && (html == '<p></p>' || html == '<p></p><p></p>')) {
            if (fieldEditor) fieldEditor.className = `${fieldEditor.className} is-placeholder field-html-${id}-is-placeholder`;
            editor?.commands?.setContent(`<p>${placeholder}</p>`);
        }

        if (action == 'focus' && html == `<p>${placeholder}</p>`) {
            if (fieldEditor) fieldEditor.className = fieldEditor.className.replace(`field-html-${id}-is-placeholder`, '').replace(`is-placeholder`, '').trim();
            editor?.commands?.setContent(`<p></p><p></p>`);
        }

        if ((action == 'selection' || action == 'focus') && fieldEditor) {
            if (html == `<p></p>`) {
                if (fieldEditor.className.indexOf('is-empty') < 0) fieldEditor.className = `${fieldEditor.className} is-empty`;
            }
            else {
                if (fieldEditor.className.indexOf('is-empty') > 0) fieldEditor.className = fieldEditor.className.replace(`is-empty`, '');
            }
        }

        if (action == 'update') {
            if (fieldEditor) fieldEditor.className = fieldEditor.className.replace(`field-html-${id}-is-placeholder`, '').replace(`is-placeholder`, '').trim();
            document.getElementById(`field-html-for-sync-${id}`)?.click();
        }
    }


    const editor: any = useEditor({
        content: value,
        extensions: [
            StarterKit,
            Highlight.configure({ multicolor: true }),
            Color,
            Link.configure({
                openOnClick: false,
            }),
            Image,
            Dropcursor,
            Typography,
            CodeBlockLowlight
                .extend({
                    addNodeView() {
                        return ReactNodeViewRenderer((props: any) => {
                            return <HtmlFieldCode {...props} readonly={readonly} />
                        })
                    },
                })
                .configure({ lowlight }),
        ],
        onBeforeCreate() {
            //const { editor } = createParams;
        },
        onCreate({ editor }) {
            //the line below has to be done here, do not move inside onEvent
            document.getElementById(`field-html-for-init-${id}`)?.click();
            onEvent(editor, 'init');
        },
        onUpdate: (updateParams) => {

            const { editor } = updateParams;
            //const transaction: Record<string, any> = updateParams?.transaction;

            onEvent(editor, 'update');
        },
        onSelectionUpdate({ editor }) {
            onEvent(editor, 'selection');
            // editor.chain().focus().setImage({ src: url }).run()
            // The selection has changed.
        },
        onTransaction({ editor }) {
            onEvent(editor, 'transaction');
            // The editor state has changed.
        },
        onFocus({ editor }) {
            onEvent(editor, 'focus');
        },
        onBlur({ editor }) {
            onEvent(editor, 'blur');
        },
        onDestroy() {
            // The editor is being destroyed.
        }
    }, [record?.id]);


    const onInitValue = () => {
        const curValue = editor?.getHTML();
        if (curValue != value) {
            editor?.commands?.setContent(value);
        }
    }

    const onSyncValue = () => {
        let newValue = editor?.getHTML();
        if (newValue == '' || newValue == '<p></p>') newValue = "<p></p><p></p>";
        setValue(newValue);
        if (isFunction(props.onChange)) props.onChange(isNonEmptyString(newValue) ? newValue : null);
    }

    return <div className="flex flex-col w-full relative" style={wrapperStyle}>
        <CSS id="html-field-css" content={HTML_FIELD_CSS} />
        <CSS id="html-field-code-css" content={HTML_FIELD_CODE_CSS} />
        <CSS id="html-field-article-css" content={ARTICLE_CSS} />
        <LabelField text={label} disabled={disabled} style={labelStyle}
            hidden={!(!hideLabel && (alwaysShowLabel || isNonEmptyString(value) || !isNonEmptyString(placeholder)))}
        />
        <div className={`w-full field-html article field-html-${id} ${layoutClassName}`} style={style}>
            {editor && !readonly && <HtmlFieldFloatInsertToolbar
                recordId={record.id ? record.id : newGuid()}
                entityName={record.entityName}
                attributeName={name}
                editor={editor}
            />}

            {editor && !readonly && <HtmlFieldFloatEditToolbar
                editor={editor}
                hideH1={hideH1}
                hideH2={hideH2}
                hideH3={hideH3}
                hideH4={hideH4}
                supportSourceCode={supportSourceCode}
            />}

            {editor && readonly && supportHighlight && <HtmlFieldFloatHighlightToolbar
                editor={editor}
                colors={highlightColors}
                onClickCreateNote={onClickCreateNote}
            />}

            <EditorContent editor={editor} className={`field-html-editor ${readonly == true ? 'readonly' : ''}`} />
            <div id={`field-html-for-init-${id}`} onClick={onInitValue} />
            <div id={`field-html-for-sync-${id}`} onClick={onSyncValue} />
        </div>
    </div>
};

export default HtmlField;