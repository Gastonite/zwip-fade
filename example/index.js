import 'zwip/src/polyfills';
import 'pwet/src/polyfills';
import Component from 'pwet/src/component';
import ZwipPlayer from 'zwip-player';
import { renderDiv } from 'idom-util';
import FadeAnimation from '../src/animation';

Component.define(ZwipPlayer);

document.addEventListener('DOMContentLoaded', () => {

  const zwipPlayer = document.createElement('zwip-player');

  zwipPlayer.update({
    makeAnimation(scene) {

      return FadeAnimation({
        element: scene.firstChild,
        duration: 1000,
        easing: 'easeInCirc'
      });
    },
    renderScene() {

      renderDiv(null, null, 'class', 'circle', null);
    },
  });

  document.body.insertBefore(zwipPlayer, document.body.firstChild);
});