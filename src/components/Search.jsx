import React from 'react';
// import PropTypes from 'prop-types';
import UserCard from './UserCard';
import { endSearch } from './../redux/userSlice';
import { useSelector, useDispatch } from 'react-redux';
const Search = ({ listUsers, searchText }) => {
    const { user } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    let usersMatches = null;
    usersMatches = listUsers.filter(
        (e) => e.fullname.toLocaleLowerCase().includes(searchText.toLocaleLowerCase()) && user._id !== e._id
    );
    if (searchText === '') usersMatches = [];
    const onHide = () => {
        dispatch(endSearch());
    };

    return usersMatches?.map((e, idx) => {
        return (
            <UserCard
                userId={user._id}
                targetId={e._id}
                avatar={e.avatar}
                fullname={e.fullname}
                onHide={onHide}
                key={idx}
            />
        );
    });
};

Search.propTypes = {};

export default Search;
