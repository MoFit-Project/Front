import Main3 from './Config';
import {useEffect, useRef} from 'react';
import 'phaser';

export default function Index() {
    const gameRef = useRef(null);
    useEffect(() => {
        loadGame();
        return (() => {
            if (gameRef.current)
                gameRef.current.destroy();
        })
    }, []);

    const loadGame = async () => {
        if (typeof window !== 'object') {
            return;
        }

        const config = {
            // type: Phaser.Scale.FIT,

            // width: window.innerWidth * window.devicePixelRatio,
            // height: window.innerHeight * window.devicePixelRatio,
            backgroundColor: '#ffffff',
            scale: {
                // mode: Phaser.Scale.CENTER_BOTH,
                // autoCenter:Phaser.Scale.CENTER_BOTH,
                parent: "game-container",
                width: 1900,
                height: 1000,
                zoom: Phaser.Scale.MAX_ZOOM
            },
            physics: {
                default: 'arcade',
                arcade: {
                    // debug : true,
                    // gravity:{y:200}
                }
            },
        };

        // const game = new Phaser.Game(config);
        gameRef.current = new Phaser.Game(config);

        gameRef.current.scene.add('main', Main3);
        gameRef.current.scene.start('main');
        gameRef.current.scale.setMaxZoom();
    };

    return null;
}