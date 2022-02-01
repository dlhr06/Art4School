const express = require("express");
const nodemailer = require("nodemailer")
const { google } = require("googleapis")
const OAuth2 = google.auth.OAuth2
const router = express.Router();
const config = require("../config/config")
const User = require('../models/InicioSesionBD');


router.post("/send-email", async(req, res) => {
    const { email} = (req.body)
    usuario = await User.findOne({ email:email })
    console.log(usuario)


    const OAuth2_client = new OAuth2(
        config.clientId,
        config.clientSecret,
        config.uriEmail
    );
    OAuth2_client.setCredentials({ refresh_token: config.refreshToken })


    if (usuario) {
        const contentHTML = `
    <h2> Hola ${usuario.name} </h2>
    <h3> Hemos recibido tu solicitud para restablecer tu contraseña. Como primer paso, debes iniciar sesion, por ello te enviamos la informacion para iniciar sesion </h3>

    <ul>
        <li> Correo electronico de registro      : ${usuario.email} </li>
        <li> Contraseña     : ${usuario.password} </li>
        <li> Tipo de Usuaio : ${usuario.TipoUsuario} </li>
    </ul>

    <h4> Si deseas cambiar la contraseña, deberas iniciar sesion y cambiarla desde las opciones para el usuario</h4>
    https://isart4school.herokuapp.com

    <h4>Recuerda que Art4School es hecho por alumnos ¡Y PARA ALUMNOS! y el equipo de soporte esta trabajando para mejorar tu experiencia en la plataforma  </h4>

    `;
        async function sendMail() {
            try {
                const accessToken = await OAuth2_client.getAccessToken()
                const transporter = nodemailer.createTransport({
                    service: "gmail",
                    auth: {
                        type: "OAuth2",
                        user:  config.userEmail,
                        clientId: config.clientId,
                        clientSecret: config.clientSecret,
                        refreshToken: config.refreshToken,
                        accessToken: accessToken
                    },
                });
                const mail_options = {
                    from: `Art4School Support <${config.userEmail}>`,
                    to: usuario.email,
                    subject: 'Recuperacion de Cuenta',
                    html: contentHTML
                };
                const result = await transporter.sendMail(mail_options)
                return result;

            } catch (err) {
                console.log(err);
            }
        }
        sendMail()
        res.redirect("/IniciaSesion")

    } else {
        res.redirect("/IniciaSesion")

    }
})

module.exports = router