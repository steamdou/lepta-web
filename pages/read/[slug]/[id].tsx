import { getServerSidePropsForPage } from 'douhub-ui-web/build/cjs/pages/server';
import PageBase from 'douhub-ui-web/build/cjs/pages/base';


import Header from '../../../components/header';
import Footer from '../../../components/footer';
import Grid from '../../../components/primary/controls/grid';
import { settings } from '../../../settings';

import solutionProfile from '../../../metadata/solution.json';
import solutionUIProfile from '../../../metadata/ui.json';
import { callAPIBase, _window } from 'douhub-ui-web-basic';
import { useEffect, useState } from 'react';
import { isEmpty, isArray } from 'lodash';
import 'antd/dist/antd.css';
import { getEntityBySlug, isObject,  getRecordDisplay, getRecordAbstract, getRecordMedia } from 'douhub-helper-util';
import dynamic from 'next/dynamic';

// import { ReadCard, ReadCardModal} from 'douhub-ui-web-premium';

// import ReadCard from '../../../components/areas/read/read-card';
// import ReadCardModal from '../../../components/areas/read/card-modal';

export const getServerSideProps = async (props: Record<string, any>): Promise<Record<string, any>> => {

    const { query, resolvedUrl } = props;
    const solution: Record<string,any> = solutionProfile;
    const solutionUI: Record<string,any> = solutionUIProfile;
    const entity = getEntityBySlug(solution, query?.slug);
    const recordSlug = query?.id;

    let result: Record<string, any> = {};

    if (entity) {
        const { entityName, entityType } = entity;
        const cacheKey = query.cache != 'false' ? `read-${entityName}-${recordSlug}` : '';
        const cacheExpireMinutes = 60;
        result = await callAPIBase(`${solution.apis.data}query-plus`, {
            cacheExpireMinutes, cacheKey,
            slug: recordSlug,
            entityName, entityType,
            recordToken: query.token,
            query: {
                scope: 'global', entityName: entity.entityName, orderBy: [{
                    attribute: 'isGlobalOrderBy', type: 'desc'
                }]
            }
        }, 'POST', { solutionId: solution.id });
    }

    const {data, record } = result;

    return await getServerSidePropsForPage({
        settings,
        solution: { ...solution, ...solutionUI },
        ...props,
        pageProps: {
            data, record, entity,
            headProps: {
                type: 'article',
                url: resolvedUrl,
                title: `${getRecordDisplay(record)} - ${solutionUI?.site?.name}`,
                description: getRecordAbstract(record, 128, true),
                image: getRecordMedia(record)
            }
        },

    });
}

let ReadCardModal:any = null;
let ReadCard:any = null;

const Read = (props: Record<string, any>) => 
{
    const {entity} = props;

    const [data, setData] = useState<any[]>([])
    const [pageRecord, setPageRecord] = useState<Record<string, any>>({});
    const [currentRecord, setCurrentRecord] = useState<Record<string, any>>({});

    console.log({pageRecord})

    useEffect(() => {
        const data = props.data;
        if (isArray(data) && data.length > 0) {
            setData(props.data);
        }
        if (!_window.ReadCardModal) 
        {
            _window.ReadCardModal = dynamic(() => import("douhub-ui-web-premium/build/cjs/read/read-card-modal"), { ssr: false });
            _window.ReadCard = dynamic(() => import("douhub-ui-web-premium/build/cjs/read/read-card"), { ssr: false });
        }
        ReadCardModal = _window.ReadCardModal;
        ReadCard = _window.ReadCard;
    }, [props.data])

    useEffect(() => {
        if (isObject(props.record)) {
            setPageRecord(props.record);
        }
    }, [props.record])

    const onClickCard = (newCurrentCard: any) => {
        setCurrentRecord(newCurrentCard);
    }

    const onCloseModal = () => {
        setCurrentRecord({});
    }

    return <PageBase
        {...props}
        Header={Header}
        Footer={Footer}>
        {!isEmpty(pageRecord) && 
        <div className={`read-card mx-auto w-full flex flex-row pt-6 max-w-xl text-xl`} >
            <ReadCard data={pageRecord}/>
        </div>}
        <h2 className="sr-only">Related Knowledge Cards</h2>
        <Grid 
        data={data} 
        onClickCard={onClickCard}
        srUrlTemplate={`/read/${entity.slug}/`}
        />
        {!isEmpty(currentRecord) && <ReadCardModal record={currentRecord} onClose={onCloseModal} />}
    </PageBase>
};

export default Read
