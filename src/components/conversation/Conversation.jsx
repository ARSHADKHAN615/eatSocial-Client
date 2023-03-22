import "./conversation.scss";
import ProfileImg from "../ProfileImg";

const Conversation = ({ conversation, CurrentConversation, onlineUsers }) => {
  return (
    <div
      className={
        CurrentConversation?.con_id === conversation?.con_id
          ? "conversation active"
          : "conversation"
      }
    >
      <div className="chatOnlineImgContainer">
        <ProfileImg user={conversation?.friend} className="conversationImg" />
        {onlineUsers.some((u) => u.userId === conversation?.friend?.id) && (
          <div className="chatOnlineBadge"></div>
        )}
      </div>
      <span className="conversationName">{conversation?.friend?.name}</span>
    </div>
  );
};

export default Conversation;
