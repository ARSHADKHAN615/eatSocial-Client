import { format } from 'timeago.js'
import './messageField.scss'

const MessageField = ({message,own}) => {
  return (
    <div className={own ? "own" : "message"}>
    <div className="messageTop">
      <img
        className="messageImg"
        src={message?.sender?.profilePic || `https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=${message?.sender?.name}`}
      />
      <p className="messageText">{message.text}</p>
    </div>
    <div className="messageBottom">{format(message.createdAt)} </div>
  </div>
  )
}

export default MessageField