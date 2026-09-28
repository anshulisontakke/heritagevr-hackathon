import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAdminDashboard = async (req, res) => {
  try {
    const [
      totalSites,
      totalUsers,
      totalDonations,
      successfulDonations,
      sites,
      recentDonations,
    ] = await Promise.all([
      prisma.heritageSite.count(),
      prisma.user.count(),
      prisma.donation.count(),
      prisma.donation.findMany({ where: { paymentStatus: 'success' } }),
      prisma.heritageSite.findMany({
        select: { id: true, name: true, fundingGoal: true, fundingRaised: true, preservationStatus: true, supporters: true },
      }),
      prisma.donation.findMany({
        where: { paymentStatus: 'success' },
        include: {
          user: { select: { name: true, email: true } },
          site: { select: { name: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: 20,
      }),
    ]);

    const totalRaised = successfulDonations.reduce((sum, d) => sum + d.amount, 0);
    const totalGoal = sites.reduce((sum, s) => sum + s.fundingGoal, 0);
    const totalAllocated = sites.reduce((sum, s) => sum + s.fundingRaised, 0);

    const statusCounts = {};
    sites.forEach(s => {
      statusCounts[s.preservationStatus] = (statusCounts[s.preservationStatus] || 0) + 1;
    });

    res.json({
      success: true,
      data: {
        stats: {
          totalSites,
          totalUsers,
          totalDonations,
          successfulDonations: successfulDonations.length,
          totalRaised,
          totalGoal,
          totalAllocated,
          fundsRemaining: totalGoal - totalAllocated,
          uniqueDonors: new Set(successfulDonations.map(d => d.userId)).size,
        },
        statusCounts,
        sitesFunding: sites,
        recentDonations,
      },
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({ success: false, message: 'Failed to load admin dashboard.' });
  }
};

export const getAllDonations = async (req, res) => {
  try {
    const { status, search } = req.query;
    const where = {};
    if (status) where.paymentStatus = status;

    const donations = await prisma.donation.findMany({
      where,
      include: {
        user: { select: { name: true, email: true } },
        site: { select: { name: true } },
        component: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, data: donations });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch donations.' });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        _count: { select: { donations: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch users.' });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const user = await prisma.user.update({
      where: { id: req.params.userId },
      data: { role: req.body.role },
      select: { id: true, name: true, email: true, role: true },
    });
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update user.' });
  }
};
