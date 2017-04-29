import dynamics from 'dynamics.js';

class AnimationSets {
    static fadeIn(el, callback) {
        dynamics.animate(el, {
            opacity: 1
        }, {
            type: dynamics.spring,
            duration: 250,
            complete: setTimeout(() => {
                callback
            }, 250)
        });
    }

    static fadeOut(el, callback) {
        dynamics.animate(el, {
            opacity: 0
        }, {
            type: dynamics.easeInOut,
            duration: 250,
            complete: setTimeout(() => {
                callback
            }, 250)
        });
    }

    static custom(anim, el, callback) {
        dynamics.animate(el, anim, {
            type: dynamics[_.get(anim, 'ease', 'easeIn')],
            duration: _.get(anim, 'duration', 250),
            complete: setTimeout(() => {
                callback
            }, _.get(anim, 'duration', 250))
        });
    }
}

export default AnimationSets;