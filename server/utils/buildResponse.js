function buildResponse(success, data, error) {
    return {
        success: success,
        data: data || null,
        error: error || null
    };
}

export default buildResponse;