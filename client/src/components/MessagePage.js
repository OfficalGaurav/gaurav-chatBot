import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import Avatar from './Avatar';
import { HiDotsVertical } from "react-icons/hi";
import { FaAngleLeft } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa6";
import { FaImage } from "react-icons/fa6";
import { FaVideo } from "react-icons/fa6";
import uploadFile from '../helpers/uploadFile';
import { IoClose } from "react-icons/io5";
import Loading from './Loading';
import backgroundImage from '../assets/wallapaper.jpeg';
import { IoMdSend } from "react-icons/io";
import moment from 'moment';

const MessagePage = () => {
  const params = useParams();
  const socketConnection = useSelector(state => state?.user?.socketConnection);
  const user = useSelector(state => state?.user);
  const [dataUser, setDataUser] = useState({
    name: "",
    email: "",
    profile_pic: "",
    online: false,
    _id: ""
  });
  const [openImageVideoUpload, setOpenImageVideoUpload] = useState(false);
  const [message, setMessage] = useState({
    text: "",
    imageUrl: "",
    videoUrl: ""
  });
  const [loading, setLoading] = useState(false);
  const [allMessage, setAllMessage] = useState([]);
  const currentMessage = useRef(null);

  useEffect(() => {
    if (currentMessage.current) {
      currentMessage.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [allMessage]);

  const handleUploadImageVideoOpen = () => {
    setOpenImageVideoUpload(preve => !preve);
  };

  const handleUploadImage = async (e) => {
    const file = e.target.files[0];
    setLoading(true);
    const uploadPhoto = await uploadFile(file);
    setLoading(false);
    setOpenImageVideoUpload(false);
    setMessage(preve => ({
      ...preve,
      imageUrl: uploadPhoto.url
    }));
  };

  const handleClearUploadImage = () => {
    setMessage(preve => ({
      ...preve,
      imageUrl: ""
    }));
  };

  const handleUploadVideo = async (e) => {
    const file = e.target.files[0];
    setLoading(true);
    const uploadPhoto = await uploadFile(file);
    setLoading(false);
    setOpenImageVideoUpload(false);
    setMessage(preve => ({
      ...preve,
      videoUrl: uploadPhoto.url
    }));
  };

  const handleClearUploadVideo = () => {
    setMessage(preve => ({
      ...preve,
      videoUrl: ""
    }));
  };

  useEffect(() => {
    if (socketConnection) {
      socketConnection.emit('message-page', params.userId);
      socketConnection.emit('seen', params.userId);
      socketConnection.on('message-user', (data) => {
        setDataUser(data);
      });
      socketConnection.on('message', (data) => {
        setAllMessage(data);
      });
    }
  }, [socketConnection, params?.userId, user]);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setMessage(preve => ({
      ...preve,
      text: value
    }));
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.text || message.imageUrl || message.videoUrl) {
      if (socketConnection) {
        socketConnection.emit('new message', {
          sender: user?._id,
          receiver: params.userId,
          text: message.text,
          imageUrl: message.imageUrl,
          videoUrl: message.videoUrl,
          msgByUserId: user?._id
        });
        setMessage({
          text: "",
          imageUrl: "",
          videoUrl: ""
        });
      }
    }
  };

  return (
    <div style={{ backgroundImage: `url(${backgroundImage})` }} className='bg-no-repeat bg-cover min-h-screen'>
      {/* Header */}
      <header className='sticky top-0 h-16 bg-gradient-to-r from-purple-600 to-blue-500 flex justify-between items-center px-4 shadow-lg'>
        <div className='flex items-center gap-4'>
          <Link to={"/"} className='lg:hidden'>
            <FaAngleLeft size={25} className='text-white hover:text-gray-200' />
          </Link>
          <div>
            <Avatar
              width={50}
              height={50}
              imageUrl={dataUser?.profile_pic}
              name={dataUser?.name}
              userId={dataUser?._id}
            />
          </div>
          <div>
            <h3 className='font-semibold text-lg my-0 text-ellipsis line-clamp-1 text-white'>{dataUser?.name}</h3>
            <p className='-my-2 text-sm'>
              {dataUser.online ? (
                <span className='text-green-300'>online</span>
              ) : (
                <span className='text-gray-300'>offline</span>
              )}
            </p>
          </div>
        </div>
        <div>
          <button className='cursor-pointer hover:text-gray-200'>
            <HiDotsVertical className='text-white' />
          </button>
        </div>
      </header>

      {/* Message Section */}
      <section className='h-[calc(100vh-128px)] overflow-x-hidden overflow-y-scroll scrollbar relative bg-slate-200 bg-opacity-50'>
        {/* All Messages */}
        <div className='flex flex-col gap-2 py-2 mx-2' ref={currentMessage}>
          {allMessage.map((msg, index) => (
            <div
              key={index}
              className={`p-2 rounded-lg w-fit max-w-[280px] md:max-w-sm lg:max-w-md ${
                user._id === msg?.msgByUserId
                  ? "ml-auto bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                  : "bg-white"
              } shadow-md`}
            >
              <div className='w-full relative'>
                {msg?.imageUrl && (
                  <img
                    src={msg?.imageUrl}
                    className='w-full h-full object-scale-down rounded-lg'
                  />
                )}
                {msg?.videoUrl && (
                  <video
                    src={msg.videoUrl}
                    className='w-full h-full object-scale-down rounded-lg'
                    controls
                  />
                )}
              </div>
              <p className='px-2'>{msg.text}</p>
              <p className='text-xs ml-auto w-fit text-gray-300'>{moment(msg.createdAt).format('hh:mm')}</p>
            </div>
          ))}
        </div>

        {/* Upload Image Display */}
        {message.imageUrl && (
          <div className='w-full h-full sticky bottom-0 bg-slate-700 bg-opacity-30 flex justify-center items-center rounded overflow-hidden'>
            <div className='w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-red-600'>
              <IoClose size={30} onClick={handleClearUploadImage} />
            </div>
            <div className='bg-white p-3 rounded-lg shadow-lg'>
              <img
                src={message.imageUrl}
                alt='uploadImage'
                className='aspect-square w-full h-full max-w-sm m-2 object-scale-down'
              />
            </div>
          </div>
        )}

        {/* Upload Video Display */}
        {message.videoUrl && (
          <div className='w-full h-full sticky bottom-0 bg-slate-700 bg-opacity-30 flex justify-center items-center rounded overflow-hidden'>
            <div className='w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-red-600'>
              <IoClose size={30} onClick={handleClearUploadVideo} />
            </div>
            <div className='bg-white p-3 rounded-lg shadow-lg'>
              <video
                src={message.videoUrl}
                className='aspect-square w-full h-full max-w-sm m-2 object-scale-down'
                controls
                muted
                autoPlay
              />
            </div>
          </div>
        )}

        {/* Loading Indicator */}
        {loading && (
          <div className='w-full h-full flex sticky bottom-0 justify-center items-center'>
            <Loading />
          </div>
        )}
      </section>

      {/* Send Message Section */}
      <section className='h-16 bg-gradient-to-r from-purple-600 to-blue-500 flex items-center px-4 shadow-lg'>
        <div className='relative'>
          <button
            onClick={handleUploadImageVideoOpen}
            className='flex justify-center items-center w-11 h-11 rounded-full hover:bg-white hover:text-purple-600 transition-all duration-300'
          >
            <FaPlus size={20} className='text-white hover:text-purple-600' />
          </button>

          {/* Image and Video Upload Options */}
          {openImageVideoUpload && (
            <div className='bg-white shadow-lg rounded-lg absolute bottom-14 w-36 p-2'>
              <form>
                <label htmlFor='uploadImage' className='flex items-center p-2 px-3 gap-3 hover:bg-slate-200 cursor-pointer rounded-lg'>
                  <div className='text-purple-600'>
                    <FaImage size={18} />
                  </div>
                  <p>Image</p>
                </label>
                <label htmlFor='uploadVideo' className='flex items-center p-2 px-3 gap-3 hover:bg-slate-200 cursor-pointer rounded-lg'>
                  <div className='text-blue-500'>
                    <FaVideo size={18} />
                  </div>
                  <p>Video</p>
                </label>

                <input
                  type='file'
                  id='uploadImage'
                  onChange={handleUploadImage}
                  className='hidden'
                />
                <input
                  type='file'
                  id='uploadVideo'
                  onChange={handleUploadVideo}
                  className='hidden'
                />
              </form>
            </div>
          )}
        </div>

        {/* Input Box */}
        <form className='h-full w-full flex gap-2' onSubmit={handleSendMessage}>
          <input
            type='text'
            placeholder='Type here message...'
            className='py-1 px-4 outline-none w-full h-full rounded-lg bg-white bg-opacity-20 text-white placeholder-gray-300 focus:bg-opacity-30 transition-all duration-300'
            value={message.text}
            onChange={handleOnChange}
          />
          <button className='text-white hover:text-gray-200 transition-all duration-300'>
            <IoMdSend size={28} />
          </button>
        </form>
      </section>
    </div>
  );
};

export default MessagePage;