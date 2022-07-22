import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MdClose } from 'react-icons/md';
import { BsUnlock, BsMicMute, BsTrash, BsFileEarmarkPdfFill, BsFileTextFill, BsDownload } from 'react-icons/bs';
import './../pages/Home/Home.css';
import { closeChatInfo } from './../redux/chatSlice';
import { Link } from 'react-router-dom';
import chatImg1 from './../assets/img/chat-img-1.jpg';
import chatImg2 from './../assets/img/chat-img-2.jpg';
import chatImg3 from './../assets/img/chat-img-3.jpg';
import chatImg4 from './../assets/img/chat-img-4.jpg';

import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);
dayjs.locale('vi');

const RightSidebar = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.user);
    if (!user) return null;

    // console.log(user)
    const [currentChat] = user.chatgroups.filter((e) => e._id === window.location.pathname.split('/').pop());
    if (!currentChat) return null;
    const [receiverInfo] = currentChat.members.filter((e) => e._id !== user._id);
    console.log(receiverInfo);
    const onCloseChatInfo = () => {
        dispatch(closeChatInfo());
    };

    return (
        <div className="right-sidebar">
            <div className="d-flex justify-content-between">
                <h4>Thông tin hội thoại</h4>
                <div
                    className="right-header-icon d-flex justify-content-center align-items-center"
                    onClick={onCloseChatInfo}
                >
                    <MdClose fontSize={'20px'} className="d-inline-block ms-1" />.
                </div>
            </div>

            <div>
                <div className="avatar avatar-lg mx-auto mt-4">
                    <img src={receiverInfo.avatar} alt="" />
                </div>
            </div>

            <div className="text-center mt-3">
                <h4 className="mx-auto overflow-hidden d-inline-block right-sidebar-name">{receiverInfo.fullname}</h4>
            </div>

            <div className="online-profile text-center mt-1">
                <span className="position-relative ">Đang hoạt động</span>
            </div>

            <div className="scroll-bar mt-5 right-sidebar-info-wrapper">
                <div className="right-sidebar-info pt-4 mb-5">
                    <h5>Thông tin</h5>
                    <div className="right-sidebar-info-item mt-4">
                        <p className="mb-1">Tên</p>
                        <h5>{receiverInfo.fullname}</h5>
                    </div>

                    <div className="right-sidebar-info-item mt-4">
                        <p className="mb-1">Ngày sinh</p>
                        <h5>{dayjs(receiverInfo.birthDay).format('DD/MM/YYYY')}</h5>
                    </div>

                    <div className="right-sidebar-info-item mt-4">
                        <p className="mb-1">Địa chỉ</p>
                        <h5>
                            {receiverInfo?.address &&
                                `${receiverInfo.address.street}, ${receiverInfo.address.wards}, ${receiverInfo.address.district}, ${receiverInfo.address.city} `}
                        </h5>
                    </div>
                </div>

                <div className="right-sidebar-media pt-4">
                    <div className="d-flex justify-content-between align-items-center ">
                        <h5>Ảnh/Video</h5>
                        <Link to="#">Xem tất cả</Link>
                    </div>
                    <div className="mt-4">
                        <ul className="d-flex right-sidebar-media-list">
                            <li>
                                <img src={chatImg1} alt="" width={'100%'} />
                            </li>
                            <li>
                                <img src={chatImg2} alt="" width={'100%'} />
                            </li>
                            <li>
                                <img src={chatImg3} alt="" width={'100%'} />
                            </li>
                            <li>
                                <img src={chatImg4} alt="" width={'100%'} />
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="right-sidebar-file pt-4 mb-4">
                    <div className="d-flex justify-content-between align-items-center">
                        <h5>Files</h5>
                        <Link to="#">Xem tất cả</Link>
                    </div>

                    <div className="mt-3">
                        <ul className="d-flex right-sidebar-file-list w-100 flex-column mt-4">
                            <li className="mb-3 p-3 w-100">
                                <div className="d-flex w-100  justify-content-between ">
                                    <div className="file-icon">
                                        <BsFileEarmarkPdfFill fontSize={'20px'} />
                                    </div>
                                    <div>
                                        <h5 className="mb-2">Learn Python the hard way</h5>
                                        <span>1.15MB</span>
                                    </div>
                                    <div>
                                        <BsDownload fontSize={'18px'} />
                                        <BsTrash fontSize={'18px'} />
                                    </div>
                                </div>
                            </li>

                            <li className="mb-2 p-3 w-100">
                                <div className="d-flex w-100  justify-content-between ">
                                    <div className="file-icon">
                                        <BsFileTextFill fontSize={'20px'} />
                                    </div>
                                    <div>
                                        <h5 className="mb-2">Learn Python the hard way</h5>
                                        <span>1.15MB</span>
                                    </div>
                                    <div>
                                        <BsDownload fontSize={'18px'} />
                                        <BsTrash fontSize={'18px'} />
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="right-sidebar-security pt-4">
                    <h5 className="mb-4 ps-4">Thiết lập bảo mật</h5>
                    <p className="d-flex align-items-end gap-3 p-3 ps-4">
                        <BsUnlock fontSize={'20px'} />
                        Mã hoá đầu cuối
                    </p>
                    <p className="d-flex align-items-end gap-3 p-3 ps-4">
                        <BsMicMute fontSize={'20px'} />
                        Tắt thông báo
                    </p>
                    <p className="d-flex align-items-end gap-3 p-3 ps-4 danger">
                        <BsTrash fontSize={'20px'} />
                        Xoá đoạn chat
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RightSidebar;
