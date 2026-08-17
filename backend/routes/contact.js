const router      = require('express').Router();
const nodemailer  = require('nodemailer');

function makeTransport() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

router.post('/', async (req, res) => {
  const { from_name, from_email, company, machine, message } = req.body || {};

  if (!from_name || !from_email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required.' });
  }

  const subject = machine
    ? `New enquiry from ${from_name} — ${machine}`
    : `New enquiry from ${from_name}`;

  const lines = [
    `Name:    ${from_name}`,
    `Email:   ${from_email}`,
    company ? `Company: ${company}` : null,
    machine ? `Machine: ${machine}` : null,
    '',
    'Message:',
    message,
  ].filter(l => l !== null).join('\n');

  try {
    await makeTransport().sendMail({
      from:    `"Skylitho Website" <${process.env.EMAIL_USER}>`,
      replyTo: from_email,
      to:      process.env.EMAIL_USER,
      subject,
      text:    lines,
    });
    res.json({ ok: true });
  } catch (err) {
    console.error('Mail error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
