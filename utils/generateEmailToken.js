// Generate a random 8 digit number token. to gnenrate, say a 6 digit number, delete 2 0s from 90000000 andn 10000000.
const generateEmailToken = () => {
    return Math.floor(Math.random() * 90000000 + 10000000).toString();
};

module.exports = generateEmailToken;
