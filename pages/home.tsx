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
import { callAPIBase } from 'douhub-ui-web-basic';
import { useEffect, useState } from 'react';
import { cloneDeep, isArray } from 'lodash';
import 'antd/dist/antd.css';

export const getServerSideProps = async (props: Record<string, any>): Promise<Record<string, any>> => {


    const result = await callAPIBase(`${solutionProfile.apis.data}query`, {
        query: {
            scope: 'global', entityName: 'Card', orderBy: [{
                attribute: 'isGlobalOrderBy', type: 'desc'
            }]
        }
    }, 'POST', { solutionId: solutionProfile.id });
    return await getServerSidePropsForPage({ settings, solution: { ...solutionProfile, ...solutionUI }, ...props, pageProps:{data: result.data }});
}

const Home = (props: Record<string, any>) => {
    const [highlights,setHeightlights] = useState<any[]>([]);
    const [data,setData] = useState<any[]>([])

    useEffect(()=>{
        const data = props.data;
        if (isArray(data) && data.length>0)
        {
            setHeightlights([cloneDeep(data[0])]);
            setData(props.data);
        }
    }, [props.data])
   
    return <PageBase
        {...props}
        slug="home"
        Header={Header}
        Footer={Footer}
    >
        <PrimarySection highlights={highlights}/>
        <Grid data={data}/>
        <TestimonialCenter />
        {/* <ThreeColumnsPublicationsSection 
        title="Case Studies - For entrepreneurs and learners"
        content = "Cases studies expose us to real business dilemmas and decisions. Concepts are recalled better when they are set in a case, much as people remember words better when used in context. "
        /> */}
    </PageBase>
};

export default Home
