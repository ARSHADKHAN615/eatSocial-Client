import { Form, Input, message } from "antd";
import { useAuth } from "../../context/authContext";
import "./comments.scss";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createComment, getComments } from "../../api";
import { format } from "timeago.js";
import ProfileImg from "../ProfileImg";
import NormalLoader from "../NormalLoader";

const Comments = ({ postId }) => {
  const { currentUser } = useAuth();
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  // Get Post Comments
  const {
    data: comments,
    error,
    status,
    isFetching,
  } = useQuery({
    queryKey: ["comments", postId],
    queryFn: getComments,
    enabled: !!postId,
    onError: (error) => {
      message.error(error.response?.data.error || error.message);
    },
  });

  // Handle Comment Creation
  const mutation = useMutation(
    (newComment) => createComment(postId, newComment),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries("comments");
        message.success("Comment created successfully");
        form.resetFields();
      },
      onError: (error) => {
        message.error(error.response.data.error || "Something went wrong");
      },
    }
  );
  const onFinish = (values) => {
    mutation.mutate(values);
  };

  return status === "loading" ? (
    <NormalLoader />
  ) : status === "error" ? (
    <span>Error: {error.message}</span>
  ) : (
    <>
      <div className="comments">
        <div className="write">
          <ProfileImg user={currentUser} />
          <Form
            name="basic"
            form={form}
            onFinish={onFinish}
            autoComplete="off"
            style={{ width: "100%" }}
            layout="inline"
          >
            <Form.Item
              name="description"
              rules={[{ required: true, message: "Comment can't be empty!" }]}
              style={{ width: "80%", margin: 0 }}
            >
              <Input
                bordered={false}
                placeholder="write a comment"
                style={{ width: "100%" }}
              />
            </Form.Item>
            <Form.Item style={{ marginLeft: "2%" }}>
              <button>Send</button>
            </Form.Item>
          </Form>
        </div>
        {comments.length === 0 && <span>No comments yet</span>}
        {comments.map((comment, i) => (
          <div className="comment" key={i}>
            <ProfileImg user={comment} />
            <div className="info">
              <span>{comment.name}</span>
              <p>{comment.description}</p>
            </div>
            <span className="date">{format(comment.createdAt)} </span>
          </div>
        ))}
      </div>
    </>
  );
};

export default Comments;
