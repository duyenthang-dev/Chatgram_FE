import React from 'react';
import PropTypes from 'prop-types';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
import { FreeMode, Pagination } from 'swiper';

const Slider = ({ slidersPerView = 1 ,list }) => {
    return (
        <div>
            <Swiper
                slidesPerView={slidersPerView}
                // spaceBetween={5}
                freeMode={true}
                pagination={{
                    clickable: true,
                }}
                modules={[FreeMode, Pagination]}
                className="mySwiper"
            >
                {list.map((e) => (
                    <SwiperSlide key={e.id}>{e}</SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

Slider.propTypes = {};

export default Slider;
