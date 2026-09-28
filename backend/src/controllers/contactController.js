import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const submitContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    const contact = await prisma.contactMessage.create({
      data: { name, email, subject, message },
    });
    res.status(201).json({ success: true, message: 'Message sent successfully. We will get back to you soon.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to send message.' });
  }
};

export const getMessages = async (req, res) => {
  try {
    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch messages.' });
  }
};
