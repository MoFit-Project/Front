import Main from './Config';
import { useEffect } from 'react';
import 'phaser';
import { useRecoilState } from "recoil";
import { leftPlayerThrow, rightPlayerThrow } from "../../recoil/PlayerThrow";

export default function Index() {
  const [isleftPlayerThrow, setLeftPlayerThrow] = useRecoilState(leftPlayerThrow);
  const [isrightPlayerThrow, setRightPlayerThrow] = useRecoilState(rightPlayerThrow);
  useEffect(() => {
    loadGame();
    console.log(isleftPlayerThrow);
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
      },
    };

    const game = new Phaser.Game(config);

    game.scene.add('main', Main);
    game.scene.start('main');
  };

  return null;
}
