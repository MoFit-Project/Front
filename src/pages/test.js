import Head from 'next/head'
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic'
import SingleGameResult from '../components/SingleGameResult'
// import styled from 'styled-components';

const DynamicComponentWithNoSSR = dynamic(
    () => import('../components/MultiGame2/Index'),
    { ssr: false }
)

const Home = () => {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
    }, []);

    return (

        <div id="multigame">
<SingleGameResult/>
        </div>
    );
};

export default Home;
