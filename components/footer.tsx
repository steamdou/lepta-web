import { isNonEmptyString } from 'douhub-helper-util';
import Logo from 'douhub-ui-web/build/cjs/controls/logo';
import { _window } from 'douhub-ui-web-basic';
import SocialIconsSection from 'douhub-ui-web/build/cjs/sections/social-icons';
import FooterColumnSection from 'douhub-ui-web/build/cjs/sections/footer/column';

const FooterDefault = (props: Record<string, any>) => {
    const { solution } = props;
    const site = solution?.site;
    const footer = site?.footer;
    return (
        <footer className="bg-white mt-8 border-t border-gray-200" aria-labelledby="footer-heading">
            <div className="flex flex-col max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex-row">
                <div className="flex flex-col flex-1 mb-12">
                    <Logo id="footer_logo" color="gray" text={site?.name} />
                    <div className="px-1">
                        {isNonEmptyString(footer?.slogan) && <p className="text-gray-500 text-base my-6">
                            {footer?.slogan}
                        </p>}
                        <SocialIconsSection data={site?.social} />
                    </div>
                </div>
                <div className="flex flex-row">
                    <div className="mr-16">
                        <FooterColumnSection data={footer?.columns[0]} />
                    </div>
                    <div className="ml-8 mr-16">
                        <FooterColumnSection data={footer?.columns[1]} />
                    </div>
                </div>
            </div>
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:py-10 lg:px-8 border-t border-gray-100">
                <p className="text-base text-gray-400 xl:text-center">&copy; {footer?.copyright ? footer?.copyright : site?.copyright}</p>
            </div>
        </footer>
    )
}


FooterDefault.displayName = 'Sections.Footer.Default';
export default FooterDefault;