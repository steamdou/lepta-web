
//because tailwind need explicit className so it can preload
//we need to provide those classNames that ia failed to preload because they come from imported libs
function Class() {
  return <>
    <div className="fixed relative md:w-56 bottom-0 top-0 hidden" />
    <div className="mx-1 mx-2 mx-3 mx-4 mx-5 mx-6 mx-7 mx-8 hidden" />
    <div className="my-1 my-2 my-3 my-4 my-5 my-6 my-7 my-8 hidden" />
    <div className="px-1 px-2 px-3 px-4 px-5 px-6 px-7 px-8 hidden" />
    <div className="py-1 py-2 py-3 py-4 py-5 py-6 py-7 py-8 hidden" />
    <div className="text-2xs text-xs text-sm text-base text-lg text-xl text-2xl" />
  </>
}

export default Class
