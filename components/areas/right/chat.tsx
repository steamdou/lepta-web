import { useState, useEffect, useRef } from 'react';
import { map, isArray, delay, each, cloneDeep, isEmpty, orderBy, uniqBy, find, isNil, isObject } from 'lodash';
import { observer } from 'mobx-react-lite';
import { useEnvStore } from 'douhub-ui-store';
import { useRouter } from 'next/router';
import ChatInputPart from './chat-input';
import { useRealtimeSession } from 'douhub-ui-realtime';
import { useContextStore } from 'douhub-ui-store';
import { _window, callAPI, Avatar } from 'douhub-ui-web-basic';
import { getEntityBySlug } from 'douhub-helper-util';

const CSS = () => <style global jsx>{`
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
  // const el = document.getElementById('messages')
  // el.scrollTop = el.scrollHeight

`}</style>;

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
            <Avatar className={classNameAvatar} data={user} realtimeStatus={false} nameToColor={true} />
        </div>
    </div>
}

const ChatPart = observer((props: Record<string, any>) => {

   
    const { entity, groupMessage } = props;
    const solution = _window.solution;
    const router = useRouter();
    const [messages, setMessages] = useState<Array<Record<string, any>>>([]);
    const [latestMessage, setLatestMessage] = useState<Record<string, any>>({});
    const { view } = router.query;
    const messagesElem: any = useRef(null);
    const contextStore = useContextStore();
    const context = JSON.parse(contextStore.data);

    const envStore = useEnvStore(props.envStore);
    const height = envStore.height - 64;

    const me = context?.user;
    const roomId = 'demo-chat'

    useEffect(()=>{
        if (!isEmpty(latestMessage)) 
        {
            appendMessage(latestMessage);
        }
    }, [latestMessage])

    const scrollToLatestMessage = () => {
        delay(() => {
            if (messagesElem?.current) messagesElem.current.scrollTop = messagesElem?.current?.scrollHeight;
        }, 300);
    }

    const appendMessage = (newMessage:Record<string,any>)=>{
        if (!find(messages, (message:any)=>{
            return message.data.id==newMessage.data.id;
        }))
        {
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

    const realtimeSession = useRealtimeSession("List", roomId, onChatMessage, onChatError);
    const ready = realtimeSession && me?.id;

    useEffect(() => {
        callAPI(solution, `${solution.apis.chat}retrieve-messages`, { roomId, pageSize: 100, order: 'desc' }, 'GET')
            .then((messages: any) => {
                setMessages(orderBy(messages, (m) => {
                    return (new Date(m.data.ownedOn)).getTime();
                }));
                scrollToLatestMessage();
            })
            .catch((error) => { console.error({ error }) });

    }, [ready])


    useEffect(() => {
        if (!isEmpty(latestMessage)) {
            setMessages([...messages, latestMessage]);
            scrollToLatestMessage();
        }

    }, [latestMessage?.data?.id])

    const processMessage = (messages: Array<Record<string, any>>): Array<Record<string, any>> => {

        const processedMessages: Array<Record<string, any>> = [];
        let curUserMessages: Array<Record<string, any>> = [];
        let curUser: Record<string, any> = {};

        each(uniqBy(messages, (message:any)=>{
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

    const onSendMessage=(newMessage:any)=>{
       setLatestMessage(newMessage);
    }

    const renderMessages = () => {
        return map(processMessage(messages), (message: Record<string, any>, index: number) => {
             return <Message key={index} pos={message.user?.id == me.id ? 'right' : 'left'} view={view} user={message.user} messages={message.messages} />
        });
    }

    return (
        <div className="flex-1 justify-between flex flex-col h-screen overflow-hidden" style={{ height, minWidth: 330 }}>
            <CSS />
            <div ref={messagesElem} className="flex flex-col space-y-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch">
                {renderMessages()}
            </div>
            <ChatInputPart ready={ready} user={me} roomId={roomId} onSendMessage={onSendMessage}/>
        </div>

    )
});

export default ChatPart;