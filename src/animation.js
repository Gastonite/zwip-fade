import Animation from 'zwip/src/animation';
import { parse as parseStyle, stringify as renderStyle } from 'style-attr';

import { isElement, isFunction, isObject, noop, round } from 'zwip/src/utils';

const FadeAnimation = (options = {}) => {

  isObject(options, 'options');

  const { element, start:_start = noop, stop:_stop = noop } = options;

  isElement(element, 'element');
  isFunction(_start, 'start');

  let style;

  const update = () => {

    style.opacity = Math.round(animation.value * 100) / 100;
  };

  const render = () => {

    element.setAttribute('style', renderStyle(style));
  };

  const start = (options) => {

    style = element.getAttribute('style');
    style = style ? parseStyle(style) : {};

    // style.opacity = animation.reverse ? 0 : 1;

    // element.style.opacity
    //   ? parseFloat(element.style.opacity)
    //   : (animation.reverse ? 0 : 1);

    _start(options);
  };

  const stop = (options) => {
    // style.opacity = animation.reverse ? 1 : 0;
    // render();
    _stop(options);
  };


  const animation =  Animation(Object.assign(options, { update, render, start, stop }));

  return animation;
};

export default FadeAnimation;