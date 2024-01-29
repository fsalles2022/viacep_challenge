const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.post("/subscribe", (req, res) => {
  const { email } = req.body;

  // Configurar transporte Nodemailer (use suas próprias configurações)
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "seu_email@gmail.com",
      pass: "sua_senha",
    },
  });

  // Opções de e-mail
  const mailOptions = {
    from: "seu_email@gmail.com",
    to: "seu_email@gmail.com",
    subject: "Novo Assinante",
    html: `Um novo assinante se cadastrou. Email: ${email}`,
  };

  // Enviar e-mail
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Erro no envio do e-mail:", error);
      res.status(500).json({ success: false, message: "Erro no envio do e-mail" });
    } else {
      console.log("E-mail enviado:", info.response);
      res.json({ success: true, message: "E-mail enviado com sucesso" });
    }
  });
});

app.listen(port, () => {
  console.log(`Servidor está ouvindo na porta ${port}`);
});
