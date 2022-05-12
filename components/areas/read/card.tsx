import React from 'react';
import { isArray } from 'lodash';
import { Tags, _window, Img } from 'douhub-ui-web-basic';
import { isNonEmptyString } from 'douhub-helper-util';

export const FullCard = (props: Record<string, any>) => {
    const { record, wrapperStyle } = props;
    const { tags, media, content, title } = record;
    const solution = _window.solution;
    const themeColor = solution?.theme?.color;
    const color = themeColor && isNonEmptyString(themeColor["500"]) ? themeColor["500"] : 'black';

    return <div className="flex-1 flex flex-col mb-12 p-8" style={wrapperStyle}>
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
        <div className="w-full mt-2 text-xl text-gray-800 leading-relaxed" dangerouslySetInnerHTML={{ __html: content }} />
    </div>
}


const ReadCard = (props: Record<string, any>) => {

    const { record, wrapperStyle } = props;

    return <div className={`read-card mx-auto w-full flex flex-row pt-6 max-w-4xl`} >
        <FullCard record={record} wrapperStyle={wrapperStyle} />
    </div>
}

export default ReadCard;