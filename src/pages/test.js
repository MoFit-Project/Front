import Head from 'next/head'
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic'
import SingleGameResult from '../components/SingleGameResult'
import MultiGameResult from '../components/MultiGameResult'
import MultiGameResultLose from '../components/MultiGameResultLose'
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
<MultiGameResult/>
        </div>
    );
};

export default Home;
