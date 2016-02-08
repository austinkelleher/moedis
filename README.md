moedis
===========
Cache Mongoose model properties in Redis.

## Installation
```bash
npm install moedis --save
```

## Requiring
```javascript
var Moedis = require('moedis');
```

## Usage

```javascript
var Moedis = require('moedis');
var mongoose = require('mongoose');
var redis = require('redis');

var redisClient = redis.createClient();

var UserSchema = mongoose.Schema({
    email: String,
    password: String
});

var User = new Moedis({
    modelName: 'User',
    schema: UserSchema,
    redis: redisClient,
    mongoose mongoose
});

var user = new User({
    email: 'test@test.com',
    password: 'test'
});

// Optional callback as third argument
user.set('email', user.password, function(err, reply) {
    // reply contains the reply from Redis
    if (err) {
        console.log('Error setting property: ', err);
        return;
    }

    user.get('email', function(err, reply) {
        if (err) {
            console.log('Error retrieving property: ', err);
            return;
        }

        // reply should be the password!
    });
});



```
