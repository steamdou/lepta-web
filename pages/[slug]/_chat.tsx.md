import React, { useState, useEffect, useRef } from 'react';
import { map, isArray, delay, each, cloneDeep, isEmpty, orderBy, uniqBy, find, isFunction } from 'lodash';
import { observer } from 'mobx-react-lite';
import { useEnvStore } from 'douhub-ui-store';
import { useRouter } from 'next/router';
import { useRealtimeSession } from 'douhub-ui-realtime';
import { useContextStore } from 'douhub-ui-store';
import { Tooltip, InputTextArea, Checkbox } from 'douhub-ui-web';
import { _window, callAPI, Avatar, SVG, CSS } from 'douhub-ui-web-basic';
import { isNonEmptyString, newGuid } from 'douhub-helper-util';

const CSS_CHAT_RIGHT_AREA = `
.scrollbar-w-2::-webkit-scrollbar {
  width: 0.25rem;
  height: 0.25rem;
}

.scrollbar-track-blue-lighter::-webkit-scrollbar-track {
  --bg-opacity: 1;
  background-color: #f7fafc;
  background-color: rgba(247, 250, 252, var(--bg-opacity));
}

.scrollbar-thumb-blue::-webkit-scrollbar-thumb {
  --bg-opacity: 1;
  background-color: #edf2f7;
  background-color: rgba(237, 242, 247, var(--bg-opacity));
}

.scrollbar-thumb-rounded::-webkit-scrollbar-thumb {
  border-radius: 0.25rem;
}
`;


const Footer = (props: Record<string, any>) => {

    const { ready, roomId, entity, currentRecord } = props;
    const solution = _window.solution;
    const [message, setMessage] = useState('');
    const [sending, setSending] = useState(false);
    const [error, setError] = useState('');
    const [returnToSubmit, setReturnToSubmit] = useState(true);


    const onSubmit = () => {

        //  createList(solution, {id:"oreo-chat"}, {})
        //  .then((list)=>{console.log({list})})
        //  .catch((error)=>{console.log({error})});

        // retrieveList(solution, "demo-chat", {})
        //  .then((list)=>{console.log({list})})
        //  .catch((error)=>{console.log({error})})

        // createListItem(solution, {listId: "demo-chat", id:newGuid(), name:'Gary'}, {})
        //  .then((list)=>{console.log({list})})
        //  .catch((error)=>{console.log({error})})

        setSending(true);
        setError('');
        const messageId = newGuid();
        callAPI(solution, `${solution.apis.chat}send-message`, {
            data: { id: messageId, roomId, content: message, regardingEntityName: entity.entityName, regardingEntityType: entity.entityType, regardingId: currentRecord?.id }
        }, 'POST')
            .then((newMessage: any) => {
                setMessage('');
                if (isFunction(props.onSendMessage)) props.onSendMessage(newMessage);
            })
            .catch((error: any) => {
                console.log({ error });
                setError('Sorry, we have trouble to send message.')
            })
            .finally(() => {
                setSending(false);
            });


        // retrieveListItems(solution, 'demo-chat', {order:'desc'})
        //  .then((list)=>{console.log({list})})
        //  .catch((error)=>{console.log({error})})

        // callAPI(solution, `${solution.apis.chat}delete-message`, {id:'demo-chat', index:0}, 'DELETE')
        //   .then((list) => { console.log({ list }) })
        //   .catch((error) => { console.log({ error }) });
    }

    const onPressEnter = (e: any) => {
        e.preventDefault();
        if (returnToSubmit) onSubmit();
        return false;
    }

    const onChange = (e: any) => {
        setMessage(e.target.value);
    }

    return <>
        {isNonEmptyString(error) && <div className="text-red-500">{error}</div>}
        {ready && !sending && <div className="flex py-2 ">
            <InputTextArea autoSize={{ minRows: 1, maxRows: 6 }}
                onPressEnter={onPressEnter}
                value={message}
                onChange={onChange}
                placeholder="Write Something"
                className="flex-1 bg-transparent focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600" />
        </div>}
        <div className="right-0 items-center inset-y-0 hidden sm:flex">
            {ready && !sending && <Checkbox checked={returnToSubmit} onChange={() => setReturnToSubmit(!returnToSubmit)} className="flex flex-row">
                <span className="ml-1 text-xs">Return key to submit</span>
            </Checkbox>}
            {!ready ?
                <div className="flex-1 pr-3 text-right focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 py-3">Connecting ...</div>
                : <div className="flex-1"></div>
            }
            {ready && sending &&
                <div className="flex-1 text-right focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 py-3">Sending Message ...</div>
            }

            {ready && !sending && <div className="flex-1"></div>}

            {ready && !sending &&
                <button type="button" className="inline-flex items-center justify-center rounded-full h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-100 focus:outline-none">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6 text-gray-600">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path>
                    </svg>
                </button>}
            {ready && !sending && <button type="button" className="inline-flex items-center justify-center rounded-full h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-100 focus:outline-none">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6 text-gray-600">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
            </button>}
            {ready && !sending && <button type="button" className="inline-flex items-center justify-center rounded-full h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-100 focus:outline-none">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6 text-gray-600">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
            </button>}
            {!sending && <button type="button" onClick={onSubmit}
                className={`inline-flex ml-2 ${!ready ? '' : (isNonEmptyString(message) ? 'cursor-pointer' : 'cursor-not-allowed')} text-blue-500 items-center justify-center transition duration-500 ease-in-out  focus:outline-none`}>
                {ready ?
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-6 w-6 transform rotate-90">
                        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
                    </svg> :
                    <SVG src="/icons/loading.svg" className="spinner" color="#333333" style={{ width: 20 }} />}
            </button>}
        </div>
    </>

};

const Message = (props: Record<string, any>) => {

    const { view, pos, user } = props;
    const messages: Array<Record<string, any> | string> = isArray(props.messages) ? props.messages : [];

    const classNameMessageBody = pos == 'left' ?
        "flex items-end" :
        (view == 'slack' ? 'flex items-end justify-start pl-12' : 'flex items-end justify-end');

    const classNameMessageWrapper = pos == 'left' ?
        `flex flex-col space-y-2 text-xs ${view == 'slack' ? 'flex-1' : 'max-w-xs'} mx-2 order-2 items-start` :
        `flex flex-col space-y-2 text-xs ${view == 'slack' ? '' : 'max-w-xs'} mx-2 items-end`
        ;
    const classNameMessageLine = pos == 'left' ?
        (view == 'slack' ? 'flex items-end w-full' : 'flex items-end mr-9') :
        'px-4 py-2 rounded-lg inline-block bg-blue-600 text-white';

    const classNameMessageLineLast = pos == 'left' ?
        `rounded-lg inline-block rounded-bl-none bg-gray-100 text-gray-600 ${view == 'slack' ? 'w-full' : 'mr-9'}` :
        'px-4 py-2 rounded-lg inline-block rounded-br-none bg-blue-600 text-white ';

    const classNameMessageLineContent = pos == 'left' ?
        `px-4 py-2 rounded-lg inline-block bg-gray-100 text-gray-600 ${view == 'slack' ? 'w-full' : ''}` :
        (view == 'slack' ? 'flex items-end justify-start pl-12' : 'flex items-end justify-end');

    const classNameAvatar = pos == 'left' ?
        'w-6 h-6 rounded-full order-1' :
        'w-6 h-6 rounded-full order-2';

    const renderMessages = () => {
        const messageCount = messages.length;

        return map(messages, (message: Record<string, any>, index: number) => {

            const data = message.data;
            const content = data.content;
            return <div key={index} className={index < messageCount - 1 ? classNameMessageLine : classNameMessageLineLast}>
                <span className={classNameMessageLineContent}>
                    {content}
                </span>
            </div>

        });
    }

    return <div className="chat-message">
        <div className={classNameMessageBody}>
            <div className={classNameMessageWrapper}>
                {renderMessages()}
            </div>
            <Avatar className={classNameAvatar} data={user} realtimeStatus={false} nameToColor={true} size={32} />
        </div>
    </div>
}

export const ChatRightArea = observer((props: Record<string, any>) => {

    const { roomId, messageLayout, title, subTitle, entity, currentRecord } = props;
    const solution = _window.solution;
    const router = useRouter();
    const [messages, setMessages] = useState<Array<Record<string, any>>>([]);
    const [refresh, setRefresh] = useState('');
    const [latestMessage, setLatestMessage] = useState<Record<string, any>>({});
    const { view } = router.query;
    const messagesElem: any = useRef(null);
    const contextStore = useContextStore();
    const context = JSON.parse(contextStore.data);
    const [ready, setReady] = useState(false);
    const [error, setError] = useState('asd as asd asd ');
    const envStore = useEnvStore(props.envStore);
    const height = envStore.height - 64;
    const groupMessage = messageLayout == 'group';
    const me = context?.user;

    useEffect(() => {
        if (!isEmpty(latestMessage) && latestMessage.data.listId == roomId) {
            appendMessage(latestMessage);
        }
    }, [latestMessage])


    const scrollToLatestMessage = () => {
        delay(() => {
            if (messagesElem?.current) messagesElem.current.scrollTop = messagesElem?.current?.scrollHeight;
        }, 300);
    }

    const appendMessage = (newMessage: Record<string, any>) => {
        if (!find(messages, (message: any) => {
            return message.data.id == newMessage.data.id;
        })) {
            setMessages([...messages, newMessage]);
            scrollToLatestMessage();
        }

    }

    //the messages inside the function is snapshot when use hook,
    //This is wrong
    const onChatMessage = (message: Record<string, any>) => {
        const data = cloneDeep(message?.data?.descriptor?.data);
        setLatestMessage({ user: data.ownedBy_info, data });
    }

    const onChatError = (error: Record<string, any>) => {
        console.log({ error });
    }

    useRealtimeSession("List", roomId, onChatMessage, onChatError);

    const retrieveMessages = (toRefresh: boolean) => {
        if (!isNonEmptyString(roomId)) return setError('Please provide a room name.')
        setError('');
        callAPI(solution, `${solution.apis.chat}retrieve-messages`, { roomId, pageSize: 100, order: 'desc', create: true }, 'GET')
            .then((messages: any) => {
                setMessages(orderBy(messages, (m) => {
                    return (new Date(m.data.ownedOn)).getTime();
                }));
                scrollToLatestMessage();
            })
            .catch((error) => {
                console.error(error);
                setError('Sorry, we have trouble to retrieve messages.')
            })
            .finally(() => {
                if (toRefresh) setRefresh('');
                setReady(true);
            })
    }

    useEffect(() => {
        if (isNonEmptyString(refresh)) retrieveMessages(true);
    }, [refresh])

    useEffect(() => {
        retrieveMessages(false);
    }, [me?.id, roomId])

    const processMessage = (messages: Array<Record<string, any>>): Array<Record<string, any>> => {

        const processedMessages: Array<Record<string, any>> = [];
        let curUserMessages: Array<Record<string, any>> = [];
        let curUser: Record<string, any> = {};

        each(uniqBy(messages, (message: any) => {
            return message?.data?.id;
        }), (message: Record<string, any>) => {
            if (curUser?.id != message.user?.id || !groupMessage) {
                if (curUserMessages.length > 0) {
                    processedMessages.push({
                        user: curUser, messages: curUserMessages
                    });
                }
                curUser = message.user;
                curUserMessages = [message];
            }
            else {
                curUserMessages.push(message);
            }
        });

        if (curUserMessages.length > 0) {
            processedMessages.push({
                user: curUser, messages: curUserMessages
            });
        }

        return processedMessages;
    }

    const onSendMessage = (newMessage: any) => {
        setLatestMessage(newMessage);
    }

    const renderMessages = () => {
        return map(processMessage(messages), (message: Record<string, any>, index: number) => {
            return <Message key={index} pos={message.user?.id == me.id ? 'right' : 'left'} view={view} user={message.user} messages={message.messages} />
        });
    }

    const onClickRefresh = () => {
        setRefresh(newGuid());
    }

    return (
        <div className="flex-1 flex flex-col h-screen overflow-hidden w-full" style={{ height }}>
            <CSS id="chat-right-area-css" content={CSS_CHAT_RIGHT_AREA} />
            <div style={{ height: 68 }}
                className="chat-room-header relative bg-gray-50 w-full flex flex-row pl-5 pr-8 py-3 border border-0 border-b">
                {isNonEmptyString(title) && <div className="flex-1 truncate mr-4">
                    <p className="pb-0 mb-0 text-xs uppercase">{subTitle ? subTitle : 'Room'}</p>
                    <h1 className="text-lg text-black mb-0 whitespace-nowrap" title={title}>{title}</h1>
                </div>}
                <div onClick={onClickRefresh}
                    className="flex cursor-pointer whitespace-nowrap inline-flex my-1 items-center justify-center px-1 py-1 ml-2 rounded-md shadow hover:shadow-lg text-xs font-medium bg-white">
                    <SVG id="list-refresh-icon" src="/icons/refresh.svg" style={{ width: 22 }} color="#333333" />
                </div>
                <Tooltip color="#aaaaaa" placement='top' title="Close">
                    <div onClick={() => { isFunction(props.onClickClose) && props.onClickClose() }} style={{ height: 30, top: 0, right: 0 }}
                        className="absolute flex self-center cursor-pointer inline-flex items-center justify-center px-1 py-1 border-0 border-b border-l text-xs font-medium text-gray-700">
                        <SVG src="/icons/close.svg" color="#333333" style={{ width: 12 }} />
                    </div>
                </Tooltip>
            </div>
            <div ref={messagesElem} className="flex-1 overflow-y-auto">
                <div className="chat-room-body flex flex-col justify-end space-y-4 p-5" style={{ minHeight: '100%' }}>
                    {renderMessages()}
                </div>
            </div>
            <div className="chat-room-footer border-t border-gray-200 pt-2 mb-2 sm:mb-0 py-2 px-5">
                {isNonEmptyString(error) && <div className="text-red-500">{error}</div>}
                {!isNonEmptyString(error) && <Footer ready={ready} user={me} roomId={roomId} entity={entity} currentRecord={currentRecord} onSendMessage={onSendMessage} />}
            </div>

        </div>

    )
});

export default ChatRightArea;