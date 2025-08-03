const data = require('../../constant/requests');
const errorHandler = (err,req,res,next) =>{
    const statusCode = res.statusCode ? res.statusCode:500;

    switch(statusCode) {
        case data.SERVER_ERROR:
            res.json({title:'server error',message:err.message ,stackTrace:err.stack})
            break;
        case data.UN_AUTHORIZED:
            res.json({title:'Trying to access unauthorized content', message:err.message, stackTrace:err.stack})
            break;
        case data.FORBIDEEN:
            res.json({title:'can not access this content',message:err.message,stackTrace:err.stack})
            break;
        case data.NOT_FOUND:
            res.json({message:err.message,stackTrace:err.stack})
            break;
        case data.REQUEST_TIMEOUT:
            res.json({message:err.message, stackTrace:err.stack})
            break;
        default:
            console.log('switch case didt catch the error');
    }

}

module.exports = errorHandler;