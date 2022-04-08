
import React from 'react';
import Header from '../../components/header';
import Footer from '../../components/footer';
import 'antd/dist/antd.min.css';
import { settings } from '../../settings';
import solutionProfile from '../../metadata/solution.json';
import solutionUI from '../../metadata/ui.json';
import { getServerSidePropsForSignIn, SignInPage as SignInPageInternal } from 'douhub-ui-web-platform';

export const getServerSideProps = async (props: Record<string, any>): Promise<Record<string, any>> => {
    return await getServerSidePropsForSignIn(props, { settings, solutionProfile, solutionUI });
}

const SignInPage = (props: Record<string, any>) => {
    return <SignInPageInternal {...props} Header={Header} Footer={Footer} />
};

export default SignInPage
