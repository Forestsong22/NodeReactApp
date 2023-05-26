if(process.env.NODE_ENV === "production"){
    module.exports = require('./prod');
} else {
    module.exports = require('./dev');
}

/**
 * 만약 개발환경이 production이라면 prod.js에서 가져오고
 * 로컬이라면 dev.js에서 가져온다.
 */