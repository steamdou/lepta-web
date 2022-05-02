
import Highlights from './controls/highlights'
import Introduction from './controls/introduction';
import { isArray, isFunction } from 'lodash';

const PrimarySection = (props: Record<string, any>) => {

    const highlights = isArray(props.highlights) ? props.highlights : [];

    const onClickCard = (clickedCard: any) => {
        if (isFunction(props.onClickCard)) props.onClickCard(clickedCard);
    }


    return <div className="bg-white pb-0 md:pb-8">
        <div className="py-4 lg:py-12 lg:relative">
            <div className="mx-auto px-4 sm:px-8 lg:px-12 lg:max-w-7xl lg:grid lg:grid-cols-2 lg:gap-24">
                <Introduction />
            </div>

            <div className="px-4 sm:px-8 sm:mx-auto max-w-3xl">
                <div className="py-12 pb-0 sm:pb-4 md:pb-12 sm:relative px-0 sm:mt-12 sm:py-16 lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
                    <div className="hidden sm:block">
                        <div className="absolute inset-y-0 left-1/2 w-screen bg-gray-50 rounded-l-3xl lg:left-80 lg:right-0 lg:w-full" />
                        <svg
                            className="absolute top-8 right-1/2 -mr-3 lg:m-0 lg:left-0"
                            width={404}
                            height={392}
                            fill="none"
                            viewBox="0 0 404 392"
                        >
                            <defs>
                                <pattern
                                    id="837c3e70-6c3a-44e6-8854-cc48c737b659"
                                    x={0}
                                    y={0}
                                    width={20}
                                    height={20}
                                    patternUnits="userSpaceOnUse"
                                >
                                    <rect x={0} y={0} width={4} height={4} className="text-gray-200" fill="currentColor" />
                                </pattern>
                            </defs>
                            <rect width={404} height={392} fill="url(#837c3e70-6c3a-44e6-8854-cc48c737b659)" />
                        </svg>
                    </div>
                    <div className="relative sm:mx-auto sm:max-w-3xl sm:px-0 lg:max-w-none lg:h-full lg:px-8  xl:px-12">
                        <Highlights data={highlights} onClickCard={onClickCard} />
                    </div>
                </div>
            </div>
        </div>
    </div>

}

PrimarySection.displayName = 'Sections.PrimarySection';
export default PrimarySection;