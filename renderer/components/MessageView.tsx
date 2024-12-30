import { FC } from "react";
import { Message } from "../lib/types";

interface Props {
    id: string;
    message: Message;
}
const MessageView: FC<Props> = ({ id, message }) => {
    const messageParts = message.content.split('\n');

    // should render as chat bubbles, user and assistant messages should have different background colors
    return (
        <div key={id} className={`chat ${message.role === 'user' ? 'chat-start' : 'chat-end'}`}>
            <div className="chat-header">{message.role}</div>
            <div className={`chat-bubble ${message.role === 'user' ? 'chat-bubble-info' : 'chat-bubble-accent'}`}>{messageParts.map((part, index) => {
                return (
                    <p key={index}>{part}</p>
                )
            })}</div>
        </div>
    ) 


    // return (
    //     <div key={id} className="">
    //         <span className="">{message.role}</span>
    //         <span className="">{
    //             messageParts.map((part, index) => {
    //                 return (
    //                     <p key={index}>{part}</p>
    //                 )
    //             })
    //             }</span>
    //     </div>
    // )
}

export default MessageView;