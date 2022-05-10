import React from 'react';
import { SubmitEmailSection } from 'douhub-ui-web';

const Introduction = (props: Record<string, any>) => {

    const solution = props.solution;
    const site = solution?.site;
    const themeColor = solution?.theme?.color;
    const colorName = themeColor.name;

    return <div>
        <div className="mt-16">
            <div className="mt-6">
                <h1 className="sr-only">{site?.title}</h1>
                <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
                    Get smarter with our daily newsletters
                </h2>
                <p className="my-6 text-xl text-gray-500 ">
                    Grow your attitude, skills and knowledge with things not taught in the school
                </p>
            </div>
            <div className="mt-12 ">
                <p className="inline text-base font-semibold tracking-tight text-sky-600">Sign up for our daily updates.</p>
            </div>
            <SubmitEmailSection
                colorName={colorName}
                recaptchaId="introduction-subscribe-beta"
                apiEndpoint={`${solution.apis.platform}subscribe-beta-access`}
                apiData={{ regarding: 'air-drop-core', solutionId: solution.id }}
                thankYouMessage="Thank you, you email has been submitted successfully, we will let you know as soon as we are ready."
                errorMessage="Sorry, we can not submit your request at the moment, please try again later or email to support@douhub.com."
                buttonText="Subscribe"
                privacyPolicyUrl="#"
            />
        </div>
    </div>
}


Introduction.displayName = 'Sections.Primary.Controls.Introduction';
export default Introduction;