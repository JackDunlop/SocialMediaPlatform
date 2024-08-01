const { randUserName, randEmail, randPastDate, randFullName, randNumber, randPassword } = require('@ngneat/falso');
const { format } = require('date-fns');

module.exports = {
    generateResizeData: function (context, events, done) {
        const image = "test.jpg";
        const height = randNumber({ min: 100, max: 1000 });
        const width = randNumber({ min: 100, max: 1000 });
        context.vars.image = image;
        context.vars.height = height;
        context.vars.width = width;
        return done();
    },
    generateRotateData: function (context, events, done) {
        const image = "test.jpg";
        const degrees = randNumber({ min: 0, max: 360 });
        context.vars.image = image;
        context.vars.degrees = degrees;
        return done();
    },
    generateUserData: function (context, events, done) {
        const username = randUserName();
        const email = randEmail();
        const DOB = format(randPastDate(), 'yyyy-MM-dd');
        const fullname = randFullName();
        const password = randPassword();

        context.vars.username = username;
        context.vars.email = email;
        context.vars.DOB = DOB;
        context.vars.fullname = fullname;
        context.vars.password = password;
        return done();
    }

};
