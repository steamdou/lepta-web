import React from 'react';
import { getServerSidePropsForPage, PageBase, PageLoader } from 'douhub-ui-web';
import { DefaultMainArea, DetaultLeftArea, PageBase as AppPageBase } from 'douhub-ui-web-platform';

import { useCurrentContext, _window } from 'douhub-ui-web-basic';
import Header from '../components/areas/header';
import { settings } from '../settings';
import 'antd/dist/antd.min.css';

import solutionProfile from '../metadata/solution.json';
import solutionUI from '../metadata/ui.json';

export const getServerSideProps = async (props: Record<string, any>): Promise<Record<string, any>> => {
    return await getServerSidePropsForPage({ settings, solution: { ...solutionProfile, ...solutionUI }, ...props });
}

const DashboardPage = (props: Record<string, any>) => {

    const { solution } = props;
    const context = useCurrentContext(solution, { signInUrl: '/auth/sign-in' });
    return <PageBase solution={solution}>
        <div className="h-full flex flex-col">
            {context ? <><Header {...props} />
                <AppPageBase
                    {...props}
                    context={context}
                    slug="dashboard"
                    MainArea={DefaultMainArea}
                    LeftArea={DetaultLeftArea}
                    RightArea={null}
                /></> :
                <PageLoader {...props}/>
            }
        </div>
    </PageBase>
};

export default DashboardPage
