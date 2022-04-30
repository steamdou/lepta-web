import { getServerSidePropsForPage } from 'douhub-ui-web/build/cjs/pages/server';
import PageBase from 'douhub-ui-web/build/cjs/pages/base';


import Header from '../../../components/header';
import Footer from '../../../components/footer';
import Grid from '../../../components/primary/controls/grid';
import { settings } from '../../../settings';

import solutionProfile from '../../../metadata/solution.json';
import solutionUI from '../../../metadata/ui.json';
import { callAPIBase } from 'douhub-ui-web-basic';
import { useEffect, useState } from 'react';
import { isEmpty, isArray } from 'lodash';
import 'antd/dist/antd.css';
import { getEntityBySlug, isObject, isEmail } from 'douhub-helper-util';
import ReadCard from '../../../components/areas/read/card';
import ReadCardModal from '../../../components/areas/read/card-modal';

export const getServerSideProps = async (props: Record<string, any>): Promise<Record<string, any>> => {

    const { query } = props;
    const entity = getEntityBySlug(solutionProfile, query?.slug);
    let result: Record<string, any> = {};

    if (entity) {
        const { entityName, entityType } = entity;
        result = await callAPIBase(`${solutionProfile.apis.data}query-plus`, {
            slug: query?.id,
            entityName, entityType,
            recordToken: query.token,
            query: {
                scope: 'global', entityName: entity.entityName, orderBy: [{
                    attribute: 'isGlobalOrderBy', type: 'desc'
                }]
            }
        }, 'POST', { solutionId: solutionProfile.id });
    }
    return await getServerSidePropsForPage({ settings, solution: { ...solutionProfile, ...solutionUI }, ...props, pageProps: { data: result.data, record: result.record } });
}

const Read = (props: Record<string, any>) => {
    const [data, setData] = useState<any[]>([])
    const [pageRrecord, setPageRecord] = useState<Record<string, any>>({});
    const [currentRecord, setCurrentRecord] = useState<Record<string, any>>({});

    useEffect(() => {
        const data = props.data;
        if (isArray(data) && data.length > 0) {
            setData(props.data);
        }
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
        {!isEmpty(pageRrecord) && <ReadCard record={pageRrecord} />}
        <Grid data={data} onClickCard={onClickCard} />
        {!isEmpty(currentRecord) && <ReadCardModal record={currentRecord} onClose={onCloseModal} />}
    </PageBase>
};

export default Read
