import Head from 'next/head'
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic'

const DynamicComponentWithNoSSR = dynamic(
    () => import('../components/SingleGame/Index'),
    { ssr: false }
)

const Home = () => {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true)
    }, []);
    const a = () => {
        if (typeof window !== 'undefined') {
            const gameState = JSON.parse(localStorage.getItem('gameState'));
            console.log(gameState);
        }
    };
    return (
        <div>
            <Head>
                <title>Phaser Starter</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div key={Math.random()} id="game"></div>
            {loading ? <DynamicComponentWithNoSSR /> : null}
        </div>
    );
};

export default Home;
