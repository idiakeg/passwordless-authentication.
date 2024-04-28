// email token expires in 10mins,
const emailTokenExpiration = () => {
    return new Date(new Date().getTime() + 10 * 60 * 1000);
};

// api token expires in 1 day; 24 hours
const apiTokenExpiration = () => {
    return new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
};

module.exports = {
    emailTokenExpiration,
    apiTokenExpiration,
};
