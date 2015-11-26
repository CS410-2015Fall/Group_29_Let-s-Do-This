var mockToken = '"yJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InNoYXliZWF1IiwidXNlcl9pZCI6NiwiZW1haWwiOiIiLCJleHAiOjE0NDg1NjI4NDF9.fqBQIh9p6V8LUWr9e6X25ISzwR87PD3wDHqsgP6XgFM"';

var testResponses = {
    createUserStampy: {
        success: {
            status: 200,
            responseText: '{"username": "Stampy", "password": "", "email": "bawoo@test.com", "phone": "6045555555", "friends": []}'
        }
    },
    logInStampy: {
        success: {
            status: 200,
            responseText: '{"token": '+mockToken+'}'
        },
        error: {
            status: 400
        }
    },
    userIdStampy: {
        success: {
            status: 200,
            responseText: '{"id": 123}'
        },
        error: {
            status: 401
        }
    },
    userInfoStampy: {
        success: {
            status: 200,
            responseText: '{"username": "Stampy", "email": "bawoo@test.com", "phone": "6045555555", "friends": []}'
        },
        error: {
            status: 401
        }
    }
};