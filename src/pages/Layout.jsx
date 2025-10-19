import React from 'react';
import Header1 from '../components/Header1';
import Footer1 from '../components/Footer1';
import { Outlet } from 'react-router-dom';




const Layout = () => {
    return (
        <>
            <Header1 />
            <Outlet />
            <Footer1 />
        </>
    );
};

export default Layout;