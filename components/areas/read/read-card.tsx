import React, { useEffect, useState } from 'react';
import { isArray, isEmpty } from 'lodash';
import { Tags, _window, Img, Div } from 'douhub-ui-web-basic';
import { isNonEmptyString, isObject } from 'douhub-helper-util';
import dynamic from 'next/dynamic';

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


    console.log({ loadReadCardHtmlReady, readCardHtmlReady })

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
        <div className="article w-full text-xl">
            <ReadCardHtml data={data} onReady={onReady} />
        </div>
    </div> : <></>
}

export default ReadCard;