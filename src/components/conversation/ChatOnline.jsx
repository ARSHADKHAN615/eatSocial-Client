import "./chatOnline.scss";

const ChatOnline = ({ onlineUsers, currentId, setCurrentChat }) => {
  return (
    <div className="chatOnline">
      {onlineUsers.map(
        (o) =>
          o.userId != currentId && (
            <div className="chatOnlineFriend" key={o.userId}>
              <div className="chatOnlineImgContainer">
                <img
                  className="chatOnlineImg"
                  src={
                    o.profilePic ||
                    `https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=${o.name}`
                  }
                  alt=""
                />
                <div className="chatOnlineBadge"></div>
              </div>
              <span className="chatOnlineName">{o.name}</span>
            </div>
          )
      )}
    </div>
  );
};

export default ChatOnline;
