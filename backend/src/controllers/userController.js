import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getUserDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user stats
    const donations = await prisma.donation.findMany({
      where: { userId, paymentStatus: 'success' },
      include: {
        site: { select: { name: true, heroImage: true } },
        component: { select: { name: true, type: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const totalDonated = donations.reduce((sum, d) => sum + d.amount, 0);
    const uniqueSites = new Set(donations.map(d => d.siteId)).size;
    const adoptions = donations.filter(d => d.donationType === 'adoption');
    const uniqueAdoptions = new Set(adoptions.map(d => d.componentId)).size;

    res.json({
      success: true,
      data: {
        stats: {
          totalDonated,
          sitesSupported: uniqueSites,
          componentsAdopted: uniqueAdoptions,
          donationsCount: donations.length,
        },
        donations,
        adoptions,
      },
    });
  } catch (error) {
    console.error('User dashboard error:', error);
    res.status(500).json({ success: false, message: 'Failed to load dashboard.' });
  }
};

export const getUserDonations = async (req, res) => {
  try {
    const donations = await prisma.donation.findMany({
      where: { userId: req.user.id },
      include: {
        site: { select: { name: true, heroImage: true } },
        component: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: donations });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch donations.' });
  }
};

export const getUserAdoptions = async (req, res) => {
  try {
    const adoptions = await prisma.donation.findMany({
      where: {
        userId: req.user.id,
        donationType: 'adoption',
        paymentStatus: 'success',
        componentId: { not: null },
      },
      include: {
        site: { select: { name: true } },
        component: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: adoptions });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch adoptions.' });
  }
};
