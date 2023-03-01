import Main from './Config';
import { useEffect, useRef } from 'react';
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
      type: Phaser.AUTO,
      width: window.innerWidth,
      height: window.innerHeight,
      // width: window.innerWidth * window.devicePixelRatio,
      // height: window.innerHeight * window.devicePixelRatio,
      backgroundColor: '#FFFFFF',
      // scale: {
      //   mode: Phaser.Scale.Fit
      // },
      physics :{
        default :'arcade',
        arcade:{
          debug : true,
          // gravity:{y:200}
        }
      }
    };

    // const game = new Phaser.Game(config);
    gameRef.current = new Phaser.Game(config);

    gameRef.current.scene.add('main', Main);
    gameRef.current.scene.start('main');
  };

  return null;
}