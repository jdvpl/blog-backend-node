const nodemailer=require('nodemailer');

// mailtrap
const emailRegister=async(datos={})=>{
  const {email,name,token}=datos;

  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIl_PORT,
    auth: {
      user: process.env.EMAIl_USER,
      pass: process.env.EMAIl_PASSWORD
    }
  });
  // Infor de correo
  const info=await transport.sendMail({
    from:'"BlogApp -Administrador de proyectos" <jdvpl@BlogApp.com>',
    to:email,
    subject:'Confirmacion de tu cuenta - BlogApp',
    text:'Confirmacion de tu cuenta- BlogApp',
    html:`<p>Hola <b>${name}</b>, confirma tu cuenta en BlogApp</p>
    <p>Tu cuenta esta ya casi lista, solo debes comprobarla en el siguiente enlace <a href="${process.env.F1_URL}/confirm/${token}">Confirmar cuenta</a></p>

    <p>Si tu no creaste esta cuenta, puede ignorar el mensaje.</p>
    `
  })
}
const emailPassword=async(datos={})=>{
  const {email,name,token}=datos;

  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIl_PORT,
    auth: {
      user: process.env.EMAIl_USER,
      pass: process.env.EMAIl_PASSWORD
    }
  });
  // Infor de correo
  const info=await transport.sendMail({
    from:'"BlogApp -Administrador de proyectos" <jdvpl@BlogApp.com>',
    to:email,
    subject:'Resstblece tu contraseña - BlogApp',
    text:'Resstblece tu contraseña- BlogApp',
    html:`<p>Hola <b>${name}</b>, has solicitado actualizar tu contraseña</p>
    <p>Sigue el siguiente enlace para generar una nueva contraseña<a href="${process.env.F1_URL}/forget-password/${token}">Actualizar contraseña</a></p>

    <p>Si tu no solicitaste este email, puede ignorar el mensaje.</p>
    `
  })
}
const addingCollaborator=async(datos={})=>{
  const {email,projectName,messageSubject,messageText,messageHtml}=datos;

  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIl_PORT,
    auth: {
      user: process.env.EMAIl_USER,
      pass: process.env.EMAIl_PASSWORD
    }
  });
  // Infor de correo
  const info=await transport.sendMail({
    from:'"BlogApp -Administrador de proyectos" <jdvpl@BlogApp.com>',
    to:email,
    subject:`${messageSubject} ${projectName}`,
    text:`${messageText}`,
    html:`
    <p>
    ${messageHtml}
    </p>
    `
  })
}
const sendEmailTask=async(datos={})=>{
  const {email,messageSubject,messageText,messageHtml}=datos;

  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIl_PORT,
    auth: {
      user: process.env.EMAIl_USER,
      pass: process.env.EMAIl_PASSWORD
    }
  });
  // Infor de correo
  const info=await transport.sendMail({
    from:'"BlogApp -Administrador de proyectos" <jdvpl@BlogApp.com>',
    to:email,
    subject:`${messageSubject}`,
    text:`${messageText}`,
    html:`
    <p>
    ${messageHtml}
    </p>
    `
  })
}

module.exports ={emailRegister,emailPassword,addingCollaborator,sendEmailTask};