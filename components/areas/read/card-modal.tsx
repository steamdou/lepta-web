import React, { useEffect, useState } from 'react';
import { isFunction, isArray, map, each, without, isNil } from 'lodash';
import { Tags, _window, } from 'douhub-ui-web-basic';
import { observer } from 'mobx-react-lite';
import { isNonEmptyString } from 'douhub-helper-util';
import ReadCard from './read-card';
//import BasicModal from './modal';
import {BasicModal} from 'douhub-ui-web-basic';

const ReadCardModal = observer((props: Record<string, any>) => {

    const { record, buttons } = props;
    const [showModal, setShowModal] = useState('');

    useEffect(() => {
        if (isNonEmptyString(record?.id)) setShowModal(record?.id);
    }, [record])


    const onClose = () => {
        setShowModal('');
        if (isFunction(props.onClose)) props.onClose();
    }

    const renderContent = () => {
        return <div className={`read-card w-full flex flex-col md:flex-row text-left`}>
            <div className="flex-1">
                <ReadCard data={record} wrapperStyle={{ padding: 0 }} />
            </div>
            {/* <div className="bg-gray-100 mt-8 md:ml-8 md:mt-0" style={{minWidth:380, minHeight:50}}>

            </div> */}
        </div>
    }

    return <>
        <BasicModal
            buttons={buttons}
            onClose={onClose}
            overlayClosable={true}
            show={isNonEmptyString(showModal)}
            showCloseIcon={true}
            contentStyle={{ margin: 0 }}
            maxWidth={600}
            content={renderContent()}
        />
    </>
})

export default ReadCardModal;