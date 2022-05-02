import React, { Fragment, useEffect, useState, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { isFunction, isArray, map, isNil } from 'lodash';
import { SVG, _window, Div } from 'douhub-ui-web-basic';
import { isNonEmptyString, isObject } from 'douhub-helper-util';
import { useEnvStore } from 'douhub-ui-store';
import { isNumber } from 'util';


const BasicModal = (props: Record<string, any>) => {
    //const [open, setOpen] = useState(true)
    const { show, title, content, Content, titleClassName, className, id } = props;
    const buttons = isArray(props.buttons) ? props.buttons : [];
    const [processing, setProcessing] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const overlayClosable: any = props.overlayClosable == true ? true : false;
    const envStore = useEnvStore();
    const winHeight = envStore.height;
    const dialogId = `modal-${id}`;
    const contentClassName = isNonEmptyString(props.contentClassName) ? props.contentClassName : '';
    const contentStyle = isObject(props.contentStyle) ? props.contentStyle : {};
    const modalStyle = isObject(props.modalStyle) ? props.modalStyle : {};
    const ButtonWrapper = isNil(props.ButtonWrapper) ? Div : props.ButtonWrapper;
    const showHeader = isNonEmptyString(title);
    const showFooter = buttons.length > 0 || isNonEmptyString(processing) || isNonEmptyString(error);
    const contentHeightAdjust = isNumber(props.contentHeightAdjust) ? props.contentHeightAdjust : (showHeader ? 40 : 0);
    const modalHeightAdjust= isNumber(props.modalHeightAdjust) ? props.modalHeightAdjust : (showFooter ? 62 : 0);
    const width = isNil(props.width) ? '100%' : props.width;
    const height = isNil(props.height) ? '100%' : props.height;
    const maxWidth = isNil(props.maxWidth) ? '100%' : props.maxWidth;
    const maxHeight = isNil(props.maxHeight) ? '100%' : props.maxHeight;
    const style = { width, height, maxWidth, maxHeight, padding: 34, margin:'auto', ...props.style };
    const contentRef:any = useRef(null);

    useEffect(() => {
       if (contentRef.current) contentRef.current.scrollTo({top: 0, behavior: 'smooth'});
    }, [show, contentRef.current])

    useEffect(() => {
        setProcessing(props.processing);
    }, [props.processing]);

    useEffect(() => {
        setError(props.error);
    }, [props.error]);

    const onClose = (fromOverlay?: boolean) => {
        if (isFunction(props.onClose)) props.onClose(fromOverlay);
    }

    const onSubmit = () => {
        if (isFunction(props.onSubmit)) props.onSubmit();
    }

    const renderProcessing = () => {
        if (isNil(processing)) return null;

        return <div className="flex py-2">
            <span className="mr-2 text-blue-400">{processing}</span>
            <SVG src="/icons/loading.svg" className="spinner" color="rgb(96 165 250)" style={{ width: 20, height: 20 }} />
        </div>
    }

    const renderError = () => {
        if (!isNonEmptyString(error)) return null;
        return <div className="flex py-2"><div className="text-red-600 text-right">{error}</div></div>
    }

    const renderButtons = () => {
        if (isNonEmptyString(processing) || isNonEmptyString(error)) return null;
        const totalButtons = buttons.length;
        return map(buttons, (button: any, index: number) => {
            const text = isNonEmptyString(button.text) ? button.text : '...';
            const disabled = button == button.disabled;
            switch (button.type) {
                case 'warning': {
                    if (!isFunction(button.onClick)) button.onClick = onSubmit;
                    return <ButtonWrapper {...button}><button
                        key={text}
                        type="button"
                        disabled={disabled}
                        className={`outline-none ${totalButtons == index + 1 ? 'ml-2' : 'mx-2'} inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-orange-600 text-base font-medium text-white hover:bg-orange-700 focus:ring-orange-500 sm:text-sm disabled:bg-gray-200 disabled:text-gray-300 disabled:cursor-not-allowed  ${button.className ? button.className : ''}`}
                        onClick={button.onClick}
                    >
                        {button.text}
                    </button></ButtonWrapper>
                }
                case 'danger': {
                    if (!isFunction(button.onClick)) button.onClick = onSubmit;
                    return <ButtonWrapper {...button}><button
                        key={text}
                        type="button"
                        disabled={disabled}
                        className={`outline-none ${totalButtons == index + 1 ? 'ml-2' : 'mx-2'} inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:ring-red-500 sm:text-sm disabled:bg-gray-200 disabled:text-gray-300 disabled:cursor-not-allowed  ${button.className ? button.className : ''}`}
                        onClick={button.onClick}
                    >
                        {button.text}
                    </button></ButtonWrapper>
                }
                case 'cancel': {
                    if (!isFunction(button.onClick)) button.onClick = onClose;
                    return <ButtonWrapper {...button}><button
                        key={text}
                        type="button"
                        disabled={disabled}
                        className={`outline-none ${totalButtons == index + 1 ? 'ml-2' : 'mx-2'} inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-gray-100 text-base font-medium text-gray-800 hover:bg-gray-200 focus:ring-gray-100 sm:text-sm disabled:text-gray-200 disabled:cursor-not-allowed  ${button.className ? button.className : ''}`}
                        onClick={button.onClick}
                    >
                        {button.text}
                    </button></ButtonWrapper>
                }
                default:
                    {
                        if (!isFunction(button.onClick)) button.onClick = onSubmit;
                        return <ButtonWrapper {...button}><button
                            key={text}
                            type="button"
                            disabled={disabled}
                            className={`outline-none ${totalButtons == index + 1 ? 'ml-2' : 'mx-2'} inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:ring-blue-500 sm:text-sm disabled:bg-gray-200 disabled:text-gray-300 disabled:cursor-not-allowed ${button.className ? button.className : ''}`}
                            onClick={button.onClick}
                        >
                            {button.text}
                        </button></ButtonWrapper>
                    }
            }
        })
    }

    return <>
        <Transition.Root show={show} as={Fragment}>
            <Dialog
                as="div"
                className="fixed z-50 inset-0 overflow-hidden"
                onClose={() => overlayClosable && onClose(true)}>
                <div className="flex justify-center p-4 md:p-8 lg:p-12" style={{ height: winHeight }}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                    </Transition.Child>

                    {/* This element is to trick the browser into centering the modal contents. */}
                    <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
                        &#8203;
                    </span>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        enterTo="opacity-100 translate-y-0 sm:scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                        leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    >
                        <div
                            className={`inline-block relative align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all ${className ? className : ''}`}
                            style={style}
                        >
                            <div className="overflow-hidden text-left" style={{ height: `calc(100% - ${modalHeightAdjust}px)`, ...modalStyle }}>
                                {/* {isNonEmptyString(icon) && <div className="mx-auto flex items-center justify-center">
                                    <SVG src={icon} size={20} />
                                </div>} */}
                                {showHeader && <Dialog.Title as="h3" style={{ height: 40 }}
                                    className={`text-lg leading-6 mb-0 font-medium text-gray-900 ${titleClassName ? titleClassName : ''}`}>
                                    {title}
                                </Dialog.Title>}
                                {dialogId && <div ref={contentRef}
                                    className={`text-align overflow-hidden overflow-y-auto ${contentClassName}`}
                                    style={{ height: `calc(100% - ${contentHeightAdjust}px)`, ...contentStyle }}>
                                    {content}
                                    {Content && <Content {...props} />}
                                </div>}
                            </div>

                            {showFooter && <div className="flex mt-6">
                                <div className="flex-1"></div>
                                {renderButtons()}
                                {renderProcessing()}
                                {renderError()}
                            </div>}
                            {!isNil(props.showCloseIcon) && <div
                                className={`absolute top-0 cursor-pointer right-0 p-2 hover:shadow ${props.closeIconWrapperClassName ? props.closeIconWrapperClassName : ''}`}
                                style={props.closeIconWrapperStyle ? props.closeIconWrapperStyle : {}}
                                onClick={() => onClose()}>
                                <SVG src="/icons/x.svg" style={{ width: 18, ...(props.closeIconStyle ? props.closeIconStyle : {}) }} color={props.closeIconColor ? props.closeIconColor : '#000000'} />
                            </div>}
                        </div>
                    </Transition.Child>
                </div>

            </Dialog>
        </Transition.Root>
    </>
}

export default BasicModal;