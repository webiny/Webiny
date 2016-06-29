class AnimationSets {
    static fadeIn(el, callback) {
        dynamics.animate(el, {
            opacity: 1
        }, {
            type: dynamics.spring,
            duration: 250,
            complete: callback
        });
    }

    static fadeOut(el, callback) {
        dynamics.animate(el, {
            opacity: 0
        }, {
            type: dynamics.easeInOut,
            duration: 250,
            complete: callback
        });
    }

    static custom(anim, el, callback) {
        dynamics.animate(el, anim, {
            type: dynamics[_.get(anim, 'ease', 'easeIn')],
            duration: _.get(anim, 'duration', 250),
            complete: callback
        });
    }
}

export default AnimationSets;