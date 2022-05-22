import React, { useEffect, useState } from 'react';
import { isArray, isEmpty } from 'lodash';
import { Tags, _window, Img, Div, CSS } from 'douhub-ui-web-basic';
import { isNonEmptyString, isObject } from 'douhub-helper-util';
import dynamic from 'next/dynamic';


const CSS_CONTENT = `
.read-card h1
{ 
    font-size: 2.25rem;
    font-weight: 700;
    line-height: 1.375;
    margin-top: 1.35rem;
    margin-bottom: 2.25rem;
    display: inline-block;
}


.read-card h2
{ 
    font-size:  1.8rem;
    font-weight: 500;
    line-height: 1.2;
    margin-top: 1.08rem;
    margin-bottom: 1.8rem;
    display: inline-block;
}

.read-card h3
{ 
    font-size: 1.4rem;
    font-weight: 500;
    line-height: 1.2;
    margin-top: 0.84rem;
    margin-bottom: 1.4rem;
    display: inline-block;
}

.read-card img
{ 
   width: 100%;
   margin-bottom: 1.8rem;
}

.read-card a
{
    text-decoration: underline;
    border: none !important;
    outline: none !important;
}`

let ReadCardHtml = Div;

export const ReadCard = (props: Record<string, any>) => {
    const { wrapperStyle } = props;
    const data = isObject(props.data) ? props.data : {};
    const [loadReadCardHtmlReady, setLoadReadCardHtmlReady] = useState(false);
    const [readCardHtmlReady, setReadCardHtmlReady] = useState(false);
    const { tags, media, content, title } = data;
    const solution = _window.solution;
    const themeColor = solution?.theme?.color;
    const color = themeColor && isNonEmptyString(themeColor["500"]) ? themeColor["500"] : 'black';

    useEffect(() => {
        if (!_window._ReadCardHTML) _window._ReadCardHTML = dynamic(() => import("./read-card-html"), { ssr: false });
        ReadCardHtml = _window._ReadCardHTML;
        setLoadReadCardHtmlReady(true);
    }, [])

    const onReady = () => {
        setReadCardHtmlReady(true);
    }

    return !isEmpty(data) ? <>
        <CSS id='read-card' content={CSS_CONTENT} />
        <div className="flex-1 flex flex-col mb-12 p-8" style={wrapperStyle}>
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
            <div className="sr-only" dangerouslySetInnerHTML={{ __html: content }} />

            {(!readCardHtmlReady || !loadReadCardHtmlReady) && <div className="w-full mt-2 text-xl text-gray-800 leading-relaxed">
                <div className="w-full mx-auto">
                    <div className="animate-pulse flex space-x-4">
                        <div className="flex-1 space-y-6 py-1">
                            <div className="h-2 bg-gray-200 rounded"></div>
                            <div className="space-y-3">
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="h-2 bg-gray-200 rounded col-span-1"></div>
                                    <div className="h-2 bg-gray-200 rounded col-span-1"></div>
                                    <div className="h-2 bg-gray-200 rounded col-span-1"></div>
                                </div>
                            </div>
                            <div className="h-2 bg-gray-200 rounded"></div>
                            <div className="space-y-3">
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="h-2 bg-gray-200 rounded col-span-1"></div>
                                    <div className="h-2 bg-gray-200 rounded col-span-1"></div>
                                    <div className="h-2 bg-gray-200 rounded col-span-1"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>}
            <div className="article w-full">
                <ReadCardHtml data={data} onReady={onReady} />
            </div>
        </div></> : <></>
}

export default ReadCard;