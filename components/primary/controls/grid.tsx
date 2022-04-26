import StackGrid from "react-stack-grid";
import { useEffect, useState } from "react";
import { isArray, map, throttle, without, debounce } from "lodash";
import { getRecordMedia, getRecordAbstract, getRecordDisplay, isNonEmptyString, newGuid } from 'douhub-helper-util'
import { Card, _window } from 'douhub-ui-web-basic';
import ReactResizeDetector from 'react-resize-detector';

// const post = {
//     title: 'Boost your conversion rate',
//     href: '#',
//     category: { name: 'Article', href: '#' },
//     tags: ["ipsum dolor", 'Architecto accusantium', 'amet consectetur'],
//     description:
//         'Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto accusantium praesentium eius, ut atque fuga culpa, similique sequi cum eos quis dolorum.',
//     date: 'Mar 16, 2020',
//     datetime: '2020-03-16',
//     media:
//         'https://images.unsplash.com/photo-1496128858413-b36217c2ce36?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1679&q=80',
//     readingTime: '6 min',
//     author: {
//         name: 'Roel Aufderehar',
//         href: '#',
//         imageUrl:
//             'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
//     }
// }

const Grid = (props: Record<string, any>) => {

    const [width, setWidth] = useState(0);
    const [data, setData] = useState<Record<string, any>[]>([]);
    const filterByTags: any[] = [];
    const filterByCategories: any[] = [];
    const [refreshGrid, setRefreshGrid] = useState('');
    const themeColor = _window.solution?.theme?.color;
    const color = themeColor && isNonEmptyString(themeColor["500"]) ? themeColor["500"] : 'black';


    useEffect(() => {
        setData(isArray(props.data) ? props.data : [])
    }, [props.data])


    // useEffect(() => {
    //     setData(Array(30).fill(post));

    // }, [])

    const onResizeDetector = (width?: number) => {
        setWidth(width ? width : 0);
        setRefreshGrid(newGuid());
    }

    const guterWidth = 30;

    const getGridColumnWidth = () => {
        let count = width < 500 ? 1 : Math.floor(width / 250);
        return (width - guterWidth * (count + 1)) / count;
    }

    const colWidth = getGridColumnWidth();

    const onRefreshGrid = debounce(() => {
        setRefreshGrid(newGuid());
    }, 200);

    return (
        <div className="w-full flex flex-col">
            <div className="mx-auto w-full max-w-7xl">
                <StackGrid
                    enableSSR={true}
                    itemComponent="div"
                    gutterWidth={guterWidth}
                    gutterHeight={guterWidth}
                    columnWidth={colWidth}
                    style={{ marginTop: guterWidth, marginBottom: guterWidth, paddingLeft: guterWidth / 2, paddingRight: guterWidth / 2 }}
                    className={`w-full stack-grid-${refreshGrid}`}
                    >
                    {without(map(data, (item, i) => {
                        const media = getRecordMedia(item);
                        const display = getRecordDisplay(item);
                        let content = '';

                        if (isArray(item?.highlight?.searchContent) && item?.highlight?.searchContent?.length > 0) {
                            content = item.highlight.searchContent[0];
                        }
                        else {
                            content = getRecordAbstract(item, 128, true);
                        }

                        return i==0 && width>500?null: <Card key={i}
                            onLoadImage={onRefreshGrid}
                            tooltipColor={color}
                            media={media}
                            item={item}
                            tags={filterByTags}
                            categories={filterByCategories}
                            display={display}
                            content={content} />
                    }),null)}
                </StackGrid>
                <ReactResizeDetector onResize={throttle(onResizeDetector, 300)} />
            </div>
        </div>
    )
}

export default Grid;