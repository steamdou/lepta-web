import { getServerSidePropsForPage } from 'douhub-ui-web/build/cjs/pages/server';
import PageBase from 'douhub-ui-web/build/cjs/pages/base';

import PrimarySection from '../components/primary/section';
import Header from '../components/header';
import Footer from '../components/footer';
import Row from '../components/row';
import { settings } from '../settings';

import solutionProfile from '../metadata/solution.json';
import solutionUI from '../metadata/ui.json';
import TestimonialCenter from '../components/testimonial';

export const getServerSideProps = async (props: Record<string, any>): Promise<Record<string, any>> => {
    return await getServerSidePropsForPage({ settings, solution:{...solutionProfile, ...solutionUI}, ...props });
}

const Home = (props: Record<string, any>) => {
    
    return <PageBase
        {...props}
        slug="home"
        Header={Header}
        Footer={Footer}
        >
        <PrimarySection />
        <Row/>
        <TestimonialCenter /> 
        {/* <ThreeColumnsPublicationsSection 
        title="Case Studies - For entrepreneurs and learners"
        content = "Cases studies expose us to real business dilemmas and decisions. Concepts are recalled better when they are set in a case, much as people remember words better when used in context. "
        /> */}
    </PageBase>
};

export default Home
