const authService = require('./authService');


async function login(req, res) {

    try {

        const { email, senha } = req.body;


        const resultado =
            await authService.login(
                email,
                senha
            );


        res.status(200).json(resultado);


    } catch (error) {

        console.error(error);


        res.status(401).json({
            erro: error.message
        });

    }

}


module.exports = {
    login
};