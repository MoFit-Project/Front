import Main from './Config';
import { useEffect } from 'react';
import 'phaser';

export default function Index() {
  useEffect(() => {
    loadGame();
  }, []);

  const loadGame = async () => {
    if (typeof window !== 'object') {
      return;
    }

    const config = {
      type: Phaser.AUTO,
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: '#FFFFFF',
      // scale: {
      //   mode: Phaser.Scale.Fit,
      //   autoCenter: Phaser.Scale.CENTER_BOTH,
      //   width: 1920,
      //   height: 1080
      // },
      scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
      },
      physics :{
        default :'arcade',
        arcade:{
          debug : true,
          // gravity:{y:200}
        }
      }

    };

    const game = new Phaser.Game(config);

    game.scene.add('main', Main);
    game.scene.start('main');
  };

  return null;
}
