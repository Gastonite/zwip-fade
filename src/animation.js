import Animation from 'zwip/src/animation';
import { parse as parseStyle, stringify as renderStyle } from 'style-attr';

import { isElement, isFunction, isObject, noop } from 'zwip/src/utils';

const FadeAnimation = (options = {}) => {

  isObject(options, 'options');

  const { element, start:_start = noop } = options;

  isElement(element, 'element');
  isFunction(_start, 'start');

  let style;

  const update = () => ({ opacity: Math.round(animation.value * 100) / 100 });

  const render = ({ opacity }) => element.style.opacity = opacity; //setAttribute('style', renderStyle(style));

  const start = ({ reverse }) => {
    console.log('FadeAnimation.start();');

    _start();

    style = element.getAttribute('style');
    style = style ? parseStyle(style) : {};

    return  { opacity: reverse ? 1 : 0 }
  };

  const animation =  Animation(Object.assign(options, { update, render, start }));

  return animation;
};

export default FadeAnimation;