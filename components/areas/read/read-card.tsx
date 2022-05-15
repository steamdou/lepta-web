import React, { useEffect, useState } from 'react';
import { isArray, isEmpty } from 'lodash';
import { Tags, _window, Img, Div } from 'douhub-ui-web-basic';
import { isNonEmptyString, isObject } from 'douhub-helper-util';
import dynamic from 'next/dynamic';

let ReadCardHtml = Div;

export const ReadCard = (props: Record<string, any>) => {
    const { wrapperStyle } = props;
    const data = isObject(props.data) ? props.data : {};
    const [readCardHtmlReady, setReadCardHtmlReady] = useState(false);
    const { tags, media, content, title } = data;
    const solution = _window.solution;
    const themeColor = solution?.theme?.color;
    const color = themeColor && isNonEmptyString(themeColor["500"]) ? themeColor["500"] : 'black';

    useEffect(() => {
        if (!_window._ReadCardHTML) _window._ReadCardHTML = dynamic(() => import("./read-card-html"), { ssr: false });
        ReadCardHtml = _window._ReadCardHTML;
        console.log({ReadCardHtml})
        setTimeout(()=>setReadCardHtmlReady(true),1000);
    }, [])

    return !isEmpty(data) ? <div className="flex-1 flex flex-col mb-12 p-8" style={wrapperStyle}>
        {isNonEmptyString(media) && <Img src={media} alt="" />}
        <h1 className="w-full text-gray-900 " dangerouslySetInnerHTML={{ __html: title }} />
        {isArray(tags) && tags.length > 0 && <div className="w-full mb-6">
            <Tags
                tags={tags}
                textClassName="text-base"
                tagClassName="bg-gray-100"
                tagStyle={{ padding: 20, marginBottom: 10, marginRight: 10 }}
                selectedTags={tags}
                tooltipColor={color} />
        </div>}
        <div className="w-full mt-2 text-xl text-gray-800 leading-relaxed">
            <div className="sr-only" dangerouslySetInnerHTML={{ __html: content }} />
            <ReadCardHtml data={data} ready={readCardHtmlReady}/>
        </div>
    </div> : <></>
}

export default ReadCard;