const handlers = {
    arrays: require('./handlers/array-handler'),
    channels: require('./handlers/channel-handler'),
    embed: require('./handlers/embed-handler'),
    chat: require('./handlers/chat-handler'),
    time: require('./handlers/time-handler'),
    database: require('./handlers/database-handler'),
    error: require('./handlers/error-handling')
};

module.exports = handlers;
