
//because tailwind need explicit className so it can preload
//we need to provide those classNames that ia failed to preload because they come from imported libs
function Class() {
  return <div className="hidden">
    <div className="fixed cursor-pointer relative md:w-56 bottom-0 top-0 top-16 left-0 right-0 bottom-0 flex-shrink-0 order-first" />
    <div className="mx-0 mx-1 mx-2 mx-3 mx-4 mx-5 mx-6 mx-7 mx-8" />
    <div className="my-0 my-1 my-2 my-3 my-4 my-5 my-6 my-7 my-8" />
    <div className="px-0 px-1 px-2 px-3 px-4 px-5 px-6 px-7 px-8" />
    <div className="py-0 py-1 py-2 py-3 py-4 py-5 py-6 py-7 py-8" />
    <div className="pr-0 pr-1 pr-2 pr-3 pr-4 pr-5 pr-6 pr-7 pr-8" />
    <div className="pl-0 pl-1 pl-2 pl-3 pl-4 pl-5 pl-6 pl-7 pl-8" />
    <div className="flex flex-col outline-none inline-flex flex-row" />
    <div className="h-16 ounded-md rounded-lg rounded border" />
    <div className="w-full h-full border-transparent bg-white text-white" />
    <div className="font-thin	font-extralight	font-light font-normal font-medium font-semibold font-bold font-extrabold"/>
    <div className="text-2sx text-xs text-sm text-base text-lg text-xl text-2xl"/>
    <div className="shadow shadow-lg hover:shadow hover:shadow-lg"/>
    <div className="grid-rows-1 grid-rows-2 grid-rows-3 grid-rows-4 grid-rows-5 grid-rows-6 grid-rows-none"/>
    <div className="gap-0 gap-1 gap-2 gap-3 gap-4 gap-5 gap-6 gap-7 gap-8"/>

    <div className="justify-self-auto justify-self-start justify-self-end justify-self-center justify-self-stretch"/>
    <div className="justify-items-start justify-items-end justify-items-center justify-items-stretch"/>
    <div className="justify-start justify-end justify-center justify-between  justify-around  justify-evenly"/>
    <div className="items-start items-end items-center items-evenly items-baseline"/>
    <div className="content-start content-end content-center content-between  content-around  content-evenly"/>
    <div className="self-start self-end self-center self-stretch self-baseline"/>
    <div className="leading-none"/>

    <div className="bg-gray-50 bg-gray-100 bg-gray-200 bg-gray-300 bg-gray-500 bg-gray-600 bg-gray-700"/>
    
    <div className="w-16 w-32 w-48 w-56"/>
    <div className="z-10 z-20 z-30 z-40 z-50"/>
    <div className="float-left float-none float-right absolute fixed block whitespace-nowrap"/>
    
  </div>
}

export default Class
