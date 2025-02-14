const notFoundMiddleware = (req, res) => {
    res.status(404).json({
        status: 'error',
        message: 'No se ha encontrado la ruta',
    });
};

export default notFoundMiddleware;
