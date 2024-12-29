import { FC } from "react";
import { Message } from "../lib/types";

interface Props {
    id: string;
    message: Message;
}
const MessageView: FC<Props> = ({ id, message }) => {
    const messageParts = message.content.split('\n');

    return (
        <div key={id} className="">
            <span className="">{message.role}</span>
            <span className="">{
                messageParts.map((part, index) => {
                    return (
                        <p key={index}>{part}</p>
                    )
                })
                }</span>
        </div>
    )
}

export default MessageView;