import React, { useContext, useEffect, useState } from "react";
import profileImage from "../images/profile.jpg";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";
import { postContext } from "./contexts/PostContext";

export function Post(props) {
  let post = props.post;
  let { posts, setPosts } = useContext(postContext);

  // console.log(post);
  let [period, setPeriod] = useState("");
  let setDate = () => {
    const currentDate = new Date();
    const postDate = new Date(post.created_at);

    const timeDiff = currentDate.getTime() - postDate.getTime();
    const seconds = Math.floor(timeDiff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) {
      setPeriod(`${seconds}s`);
    } else if (minutes < 60) {
      setPeriod(`${minutes}m`);
    } else if (hours < 24) {
      setPeriod(`${hours}h`);
    } else {
      setPeriod(`${days}d`);
    }
  };

  let [like, setLike] = useState(false);

  let [postData, setPostData] = useState({
    content: post.content,
    like: post.like,
  });

  const toggleLike = () => {
    const updatedPostData = { ...postData };
    if (!like) {
      updatedPostData.like += 1;
    } else {
      updatedPostData.like -= 1;
    }
    setPostData(updatedPostData);
    setLike(!like);

    axios
      .put(`http://localhost:8000/post/${post.id}`, updatedPostData)
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  let [showEditModal, setShowEditModal] = useState(false);
  let [editedContent, setEditedContent] = useState(post.content);
  // Open the edit modal
  const openEditModal = () => {
    setEditedContent(postData.content);
    setShowEditModal(true);
  };

  // Close the edit modal
  const closeEditModal = () => {
    setShowEditModal(false);
  };

  // Save the edited content
  const saveEditedContent = () => {
    const updatedPostData = { ...postData, content: editedContent };
    setPostData(updatedPostData);
    setShowEditModal(false);
    axios
      .put(`http://localhost:8000/post/${post.id}`, updatedPostData)
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  let deletePost = () => {
    axios.delete(`http://localhost:8000/post/${post.id}`);
    setPosts(posts.filter((post) => post.id !== post.id));
  };

  useEffect(() => {
    setDate();
  }, [period, like, postData]);

  return (
    <div>
      <div
        className="row mb-3 p-4 mt-4 shadow-lg"
        style={{
          backgroundColor: "white",
          borderRadius: "30px",
        }}
      >
        <div className="col-auto pt-1">
          <img
            src={profileImage}
            alt="Profile"
            className="rounded-circle "
            style={{
              height: "50px",
              left: "24px",
              objectFit: "cover",
              top: "24px",
              width: "50px",
            }}
          />
        </div>
        <div className="col-auto pb-2">
          <div className="fs-5 fw-semibold">{post.creator}</div>
          <div className="row">
            <div className="col-auto">
              {period}{" "}
              <i className="bi bi-globe-americas material-symbols px-1"></i>
            </div>
          </div>
        </div>
        <div className="col pb-2 text-end">
          <button
            type="button"
            className={`btn btn-icon text-decoration-none p-0 pt-1`}
            onClick={openEditModal}
          >
            <i class="bi bi-pencil-square fs-5 mx-3"></i>
          </button>
          <button
            type="button"
            className={`btn btn-icon text-decoration-none p-0 pt-1`}
            onClick={deletePost}
          >
            <i className="bi bi-x-lg fs-5 "></i>
          </button>
        </div>

        <div className="row pt-3 pb-3">
          <div className="col-auto text-start">
            {/* Add content for the second row within the middle column */}
            {postData.content}
          </div>
        </div>
        <div className="row pt-3 pb-3">
          <div className="col-auto text-start">
            {/* Add content for the second row within the middle column */}
            <img
            src={profileImage}
            alt="Profile"
            // className="rounded-circle "
            style={{
              height: "400px",
              // left: "24px",
              objectFit: "contain",
              // top: "24px",
              width: "550px",
            }}
          />
          </div>
        </div>
        <div className="row justify-content-between pb-0 pt-2">
          <div className="col-auto ">
            <i className="bi bi-hand-thumbs-up mdi-like px-2"></i>
            <span>{postData.like}</span>
          </div>
          <div className="col-auto ">
            <i className="bi bi-chat px-2"></i>
            <span>{post.comment.length}</span>
          </div>
        </div>
        <div className="row justify-content-center pb-0">
          <hr className="row mb-3 mt-3" />
          <div className="col-lg-4">
            <button
              type="button"
              className={`btn btn-icon text-decoration-none ${
                like ? "btn-outline-primary" : ""
              }`}
              onClick={toggleLike}
            >
              <i className="bi bi-hand-thumbs-up mdi-like px-2 fs-5"></i>
              Like
            </button>
          </div>
          <div className="col-lg-4">
            <button type="button" className="btn btn-icon text-decoration-none">
              <i className="bi bi-chat px-2 fs-5"></i>
              Comment
            </button>
          </div>
        </div>
      </div>
      {/* Edit post modal */}
      <Modal show={showEditModal} onHide={closeEditModal} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Post</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <textarea
            className="form-control"
            rows={4}
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
          ></textarea>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeEditModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={saveEditedContent}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}