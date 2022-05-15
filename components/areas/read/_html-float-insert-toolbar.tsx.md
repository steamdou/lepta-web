import React from 'react';
import { SVG } from 'douhub-ui-web-basic';
import { newGuid } from 'douhub-helper-util';
import { FloatingMenu } from '@tiptap/react';
import { each } from 'lodash';
import { Uploader } from 'douhub-ui-web';

const FLOAT_MENU_STYLE = {
    border: 'solid 1px #333333',
    backgroundColor: '#ffffff',
    padding: 2,
    marginLeft: 10,
    fontSize: 14,
    display: 'flex'
}

const HtmlFieldFloatInsertToolbar = (props: {
    editor: any,
    attributeName: string,
    recordId: string,
    entityName: string
}) => {

    const { editor, attributeName, recordId, entityName } = props;


    const onUploadPhoto = (photoInfo: Record<string, any>) => {
        const src = photoInfo.cfSignedResult.signedUrl;
        const rawSrc = photoInfo.cfSignedRawResult.signedUrl;
        editor.commands.setImage({ src });
        each(document.getElementsByTagName('img'), (img: any) => {
            if (img.src == src) {
                img.onerror = function () {
                    console.log("USING RAW FILE");
                    this.rawSrc = rawSrc;
                    this.src = rawSrc;
                };
            }
        });
    }

    return <FloatingMenu editor={editor}>
        <button style={FLOAT_MENU_STYLE}
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
            H2
        </button>
        <button style={FLOAT_MENU_STYLE}
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >
            H3
        </button>
        <button style={FLOAT_MENU_STYLE}
            onClick={() => editor.chain().focus().toggleBulletList().run()}

        >
            <SVG src="/icons/material-bullet-list.svg" style={{ width: 20 }} />
        </button>
        <button style={FLOAT_MENU_STYLE}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}

        >
            <SVG src="/icons/material-numbered-list.svg" style={{ width: 20 }} />
        </button>
        <button style={FLOAT_MENU_STYLE}>
            <Uploader
                iconStyle={{ width: 20, height: 20 }}
                hideLabel={true}
                entityName={entityName}
                attributeName={attributeName}
                fileType="Photo"
                signedUrlSize={960}
                onSuccess={onUploadPhoto}
                recordId={recordId}
                fileNamePrefix={newGuid()}
                uiFormat="icon" iconUrl="/icons/image.svg"
                wrapperStyle={{ width: 20, height: 20, border: 'none' }} />
        </button>
    </FloatingMenu>
};

export default HtmlFieldFloatInsertToolbar;