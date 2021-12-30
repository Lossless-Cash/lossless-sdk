const sinon = require('sinon');

beforeEach(() => {
    // Clear cache
    Object.keys(require.cache).forEach(key => delete require.cache[key]);
    sinon.restore();
});
