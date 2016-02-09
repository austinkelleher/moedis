/**
* Generates a normalized Cache key for Redis
* @param modelName - Name of the Mongoose model
* @param prop - Property to cache
* @param entity - Value of the property (prop)
*/
function getCacheKey(modelName, prop, entity) {
    return modelName + '-' + prop + ':' + entity;
}

module.exports = function(options) {
    var modelName = options.modelName;
    var schema = options.schema;
    var redis = options.redis;
    var mongoose = options.mongoose;

    if (!modelName || !schema || !redis || !mongoose) {
        throw new Error('Required argument missing!');
    }

    /**
    * Cache a Mongoose model property into Redis
    * @param prop {string} - Mongoose schema property to cache
    * @param value {string} - Value to set
    * @param callback
    */
    schema.methods.cacheSet = function(prop, value, callback) {
        var entity = this[prop];

        if (!entity) {
            throw new Error('Invalid property or undefined value.');
        }

        var key = getCacheKey(modelName, prop, entity);

        if (callback) {
            redis.set(key, value, function(err, reply) {
                callback(err, reply);
            });
        } else {
            redis.set(key, value);
        }
    };

    /**
    * Fetch a cached property from Redis
    * @param prop {string} - Mongoose schema property to fetch from cache
    * @param callback {function}
    */
    schema.methods.cacheGet = function(prop, callback) {
        var entity = this[prop];

        if (!entity) {
            throw new Error('Invalid property or undefined value.');
        }

        var key = getCacheKey(modelName, prop, entity);

        if (callback) {
            redis.get(key, function(err, reply) {
                callback(err, reply);
            });
        } else {
            redis.get(key);
        }
    };

    return mongoose.model(modelName, schema);
};
