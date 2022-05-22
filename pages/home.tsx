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
import { callAPIBase, _track, _window } from 'douhub-ui-web-basic';
import { useEffect, useState } from 'react';
import { cloneDeep, isArray, isNil, isEmpty } from 'lodash';
import { getMemoryCache, setMemoryCache, isNonEmptyString } from 'douhub-helper-util';
// import ReadCardModal from 'douhub-ui-web-premium/build/cjs/read/read-card-modal';
// import ReadCardModal from '../components/areas/read/read-card';
import dynamic from 'next/dynamic';

export const getServerSideProps = async (props: Record<string, any>): Promise<Record<string, any>> => {

    const { query } = props;
    const cacheKey = query.cache != 'false' ? 'home-page' : '';
    const cacheExpireMinutes = 60;
    let result = isNonEmptyString(cacheKey) ? getMemoryCache(cacheKey) : null;

    if (isNil(result)) {
        if (_track) console.log('Home Page Reload');

        result = await callAPIBase(`${solutionProfile.apis.data}query`, {
            query: {
                scope: 'global', entityName: 'Card', orderBy: [{
                    attribute: 'isGlobalOrderBy', type: 'desc'
                }]
            }
        }, 'POST', { solutionId: solutionProfile.id });

        setMemoryCache(cacheKey, result, cacheExpireMinutes); //cache for 30 mins
    }
    else {
        console.log('Home Page From Cache');
    }

    return await getServerSidePropsForPage({ settings, solution: { ...solutionProfile, ...solutionUI }, ...props, pageProps: { data: result.data } });
}

let ReadCardModal: any = null;

const Home = (props: Record<string, any>) => {

    const { solution } = props;
    const [highlights, setHighlights] = useState<any[]>([]);
    const [data, setData] = useState<any[]>([]);
    const [currentRecord, setCurrentRecord] = useState<Record<string, any>>({});

    useEffect(() => {
        const data = props.data;
        if (isArray(data) && data.length > 0) {
            setHighlights([cloneDeep(data[0])]);
            setData(props.data);
        }

        if (!_window.ReadCardModal) _window.ReadCardModal = dynamic(() => import("douhub-ui-web-premium/build/cjs/read/read-card-modal"), { ssr: false });
        ReadCardModal = _window.ReadCardModal;
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
        <PrimarySection highlights={highlights} solution={solution} onClickCard={onClickCard} />
        <h2 className="sr-only">Latest Knowledge Cards</h2>
        <Grid
            data={data}
            srUrlTemplate={`/read/card/`}
            onClickCard={onClickCard} />
        <TestimonialCenter />
        {/* <ThreeColumnsPublicationsSection 
        title="Case Studies - For entrepreneurs and learners"
        content = "Cases studies expose us to real business dilemmas and decisions. Concepts are recalled better when they are set in a case, much as people remember words better when used in context. "
        /> */}
        {!isEmpty(currentRecord) && ReadCardModal && <ReadCardModal record={currentRecord} onClose={onCloseModal} show={true} />}
    </PageBase>
};

export default Home
