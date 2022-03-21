const handlers = {
    arrays: require('./handlers/array-handler'),
    channels: require('./handlers/channel-handler'),
    chat: require('./handlers/chat-handler'),
    time: require('./handlers/time-handler'),
    database: require('./handlers/database-handler')
};

module.exports = handlers;
