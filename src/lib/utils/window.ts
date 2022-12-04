export const getWindowWidth = function() {
    try {
        return window.innerWidth ||
            (document.documentElement && document.documentElement.clientWidth) ||
            (document.body && document.body.clientWidth) ||
            0;
    } catch (e) {
        return 500;
    }
};
