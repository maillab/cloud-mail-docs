export default {
    fetch(request :any, env :any) {
        return env.ASSETS.fetch(request);
    },
};