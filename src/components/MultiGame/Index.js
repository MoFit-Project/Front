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
      // type: Phaser.Scale.FIT,

      // width: window.innerWidth * window.devicePixelRatio,
      // height: window.innerHeight * window.devicePixelRatio,
      // backgroundColor: '#FFFFFF',
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter:Phaser.Scale.CENTER_BOTH,
        parent:"StyledMultiGame",
        width: 1920,
        height: 1080,
        zoom:Phaser.Scale.MAX_ZOOM
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
    game.scale.setMaxZoom();
  };

  return null;
}
