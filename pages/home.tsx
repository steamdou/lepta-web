import { getServerSidePropsForPage } from 'douhub-ui-web/build/cjs/pages/server';
import PageBase from 'douhub-ui-web/build/cjs/pages/base';

import PrimarySection from '../components/primary/section';
import Header from '../components/header';
import Footer from '../components/footer';
import Grid from '../components/primary/controls/grid';
import { settings } from '../settings';

import solutionProfile from '../metadata/solution.json';
import solutionUI from '../metadata/ui.json';
import TestimonialCenter from '../components/testimonial';
import { callAPIBase, Nothing } from 'douhub-ui-web-basic';
import { useEffect, useState } from 'react';
import { cloneDeep, isArray, isNil, isEmpty } from 'lodash';
import { getMemoryCache, setMemoryCache } from 'douhub-helper-util';
import ReadCardModal from '../components/areas/read/card-modal';
export const getServerSideProps = async (props: Record<string, any>): Promise<Record<string, any>> => {

    const { query } = props;
    const cacheKey = 'home-page';
    let result = getMemoryCache(cacheKey);
    if (isNil(result) || query.cache == 'false') {
        console.log('Home Page Reload')
        result = await callAPIBase(`${solutionProfile.apis.data}query`, {
            query: {
                scope: 'global', entityName: 'Card', orderBy: [{
                    attribute: 'isGlobalOrderBy', type: 'desc'
                }]
            }
        }, 'POST', { solutionId: solutionProfile.id });

        setMemoryCache(cacheKey, result, 30); //cache for 30 mins
    }
    else {
        console.log('Home Page From Cache');
    }

    return await getServerSidePropsForPage({ settings, solution: { ...solutionProfile, ...solutionUI }, ...props, pageProps: { data: result.data } });
}

const Home = (props: Record<string, any>) => {
    const [highlights, setHeightlights] = useState<any[]>([]);
    const [data, setData] = useState<any[]>([]);
    const [currentRecord, setCurrentRecord] = useState<Record<string, any>>({});

    useEffect(() => {
        const data = props.data;
        if (isArray(data) && data.length > 0) {
            setHeightlights([cloneDeep(data[0])]);
            setData(props.data);
        }
    }, [props.data])

    const onClickCard = (newCurrentCard: any) => {
        console.log(newCurrentCard)
        setCurrentRecord(newCurrentCard);
    }


    const onCloseModal = () => {
        setCurrentRecord({});
    }

    return <PageBase
        {...props}
        slug="home"
        Header={Header}
        Footer={Footer}
    >
        <PrimarySection highlights={highlights}  onClickCard={onClickCard}/>
        <h2 className="sr-only">Latest Knowledge Cards</h2>
        <Grid data={data} onClickCard={onClickCard} />
        <TestimonialCenter />
        {/* <ThreeColumnsPublicationsSection 
        title="Case Studies - For entrepreneurs and learners"
        content = "Cases studies expose us to real business dilemmas and decisions. Concepts are recalled better when they are set in a case, much as people remember words better when used in context. "
        /> */}
         {!isEmpty(currentRecord) && <ReadCardModal record={currentRecord} onClose={onCloseModal} show={true}/>}
    </PageBase>
};

export default Home
