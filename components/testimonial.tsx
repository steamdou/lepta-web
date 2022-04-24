/* This example requires Tailwind CSS v2.0+ */
const TestimonialCenter = () => {
  return (
    <section className="py-4 overflow-hidden md:py-6 lg:py-8">
      <div className="relative max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
        <svg
          className="absolute top-full right-full transform translate-x-1/3 -translate-y-1/4 lg:translate-x-1/2 xl:-translate-y-1/2"
          width={404}
          height={404}
          fill="none"
          viewBox="0 0 404 404"
          role="img"
          aria-labelledby="svg-workcation"
        >
          <defs>
            <pattern
              id="ad119f34-7694-4c31-947f-5c9d249b21f3"
              x={0}
              y={0}
              width={20}
              height={20}
              patternUnits="userSpaceOnUse"
            >
              <rect x={0} y={0} width={4} height={4} className="text-gray-200" fill="currentColor" />
            </pattern>
          </defs>
          <rect width={404} height={300} fill="url(#ad119f34-7694-4c31-947f-5c9d249b21f3)" />
        </svg>

        <div className="relative">
          <blockquote className="mt-10 px-2 sm:px-4 md:px-8 lg:px-12">
            <div className="max-w-3xl mx-auto text-center text-2xl leading-9 font-medium text-gray-900">
              <p>
                “It is important to view knowledge as sort of a semantic tree — make sure you understand the fundamental principles, i.e. the trunk and big branches, before you get into the leaves/details or there is nothing for them to hang on to.”
              </p>
            </div>
            <footer className="max-w-xl lg:max-w-3xl mx-auto mt-12 justigy-center">
              <div className="flex flex-row w-full justify-center">
                <div className="md:flex-shrink-0">
                  <img
                    className="mx-auto h-10 w-10 rounded-full"
                    src="https://pbs.twimg.com/profile_images/1503591435324563456/foUrqiEw_400x400.jpg"
                    alt=""
                    style={{minWidth:36, minHeight:36}}
                  />
                </div>
                <div className="max-w-md flex flex-col text-left ml-4">
                  <div className="text-base font-medium text-gray-900">Elon Musk - Founder,CEO</div>
                  <div className="max-w-sm text-sm font-base text-gray-500">
                    @SpaceX, @Tesla, @The Boaring Company, @Neuralink, @Open AI, @PayPal</div>
                </div>
              </div>
            </footer>
          </blockquote>
        </div>
      </div>
    </section>
  )
}

export default TestimonialCenter