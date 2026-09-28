import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getFundOverview = async (req, res) => {
  try {
    const sites = await prisma.heritageSite.findMany({
      select: {
        id: true, name: true, fundingGoal: true, fundingRaised: true,
        preservationStatus: true, supporters: true,
      },
    });

    const transactions = await prisma.fundTransaction.findMany({
      include: { site: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
    });

    const totalRaised = sites.reduce((sum, s) => sum + s.fundingRaised, 0);
    const totalGoal = sites.reduce((sum, s) => sum + s.fundingGoal, 0);

    const allocated = transactions
      .filter(t => t.type === 'fund_allocated')
      .reduce((sum, t) => sum + t.amount, 0);

    const underRestoration = sites.filter(s => s.preservationStatus === 'Under Restoration').length;
    const completed = sites.filter(s => s.preservationStatus === 'Restored').length;

    res.json({
      success: true,
      data: {
        totalRaised,
        totalGoal,
        totalAllocated: allocated,
        underRestoration,
        completedProjects: completed,
        totalDonors: sites.reduce((sum, s) => sum + s.supporters, 0),
        sites,
        transactions,
      },
    });
  } catch (error) {
    console.error('Fund overview error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch fund data.' });
  }
};
