


module.exports = options => {
    return async function permission(ctx, next) {
        await next();
    };
};
