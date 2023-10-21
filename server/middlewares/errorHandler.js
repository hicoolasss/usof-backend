import buildResponse from "../utils/buildResponse.js";

function handleError(error, req, res, next) {
    // Здесь форматируем вывод ошибки для консоли
    console.error("Error:", error.message); // Теперь выводим только сообщение об ошибке

    let statusCode = 500;
    let success = false;
    let errorMessage = error.message;

    switch (errorMessage) {
        //posts
        case 'Post not found':
            statusCode = 404;
            break;
        case 'You cannot update posts of other users':
        case 'Not authorized to delete this post':
        case 'You have already reacted to this post':
            statusCode = 403;
            break;
        //auth
        case 'Login already exists!':
            statusCode = 409;
            break;
        case 'Email already exists!':
            statusCode = 409;
            break;
        case 'User not found!':
            statusCode = 404;
            break;
        case 'Incorrect password!':
            statusCode = 401;
            break;
        case 'Invalid or expired password reset token!':
            statusCode = 400;
            break;
        case 'Invalid arguments provided for hashing':
            statusCode = 400;
            break;
        
        //tokens
        case 'No token provided':
            statusCode = 401;
            break;
        case 'Invalid token':
            statusCode = 401;
            break;
        case 'Can`t find token':
            statusCode = 404;
            break;

        //users
        case 'User not found':
            statusCode = 404;
            break;

        case 'Error uploading user avatar':
            statusCode = 500;
            break;
        





        // По умолчанию мы можем оставить сообщение об ошибке таким, какое оно есть, 
        // или установить его в 'Internal Server Error', если оно должно быть скрыто от пользователя.
        default:
            errorMessage = process.env.NODE_ENV === 'production' ? 'Internal Server Error' : errorMessage;
            break;
    }

    const response = buildResponse(success, null, errorMessage);

    return res.status(statusCode).json(response);
}

export default handleError;