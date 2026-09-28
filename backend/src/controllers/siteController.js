import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllSites = async (req, res) => {
  try {
    const { search, status, location, period, featured } = req.query;

    const where = {};
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { location: { contains: search } },
        { description: { contains: search } },
      ];
    }
    if (status) where.preservationStatus = status;
    if (location) where.location = { contains: location };
    if (period) where.period = { contains: period };
    if (featured === 'true') where.featured = true;

    const sites = await prisma.heritageSite.findMany({
      where,
      include: {
        _count: { select: { components: true, donations: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, data: sites });
  } catch (error) {
    console.error('Get sites error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch heritage sites.' });
  }
};

export const getSiteById = async (req, res) => {
  try {
    const site = await prisma.heritageSite.findUnique({
      where: { id: req.params.id },
      include: {
        components: true,
        vrExperiences: true,
        fundTransactions: { orderBy: { createdAt: 'desc' } },
        _count: { select: { donations: true } },
      },
    });

    if (!site) {
      return res.status(404).json({ success: false, message: 'Heritage site not found.' });
    }

    res.json({ success: true, data: site });
  } catch (error) {
    console.error('Get site error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch site details.' });
  }
};

export const createSite = async (req, res) => {
  try {
    const site = await prisma.heritageSite.create({
      data: {
        name: req.body.name,
        location: req.body.location,
        description: req.body.description,
        historicalInfo: req.body.historicalInfo || '',
        currentCondition: req.body.currentCondition || '',
        period: req.body.period || 'Unknown',
        fundingGoal: parseFloat(req.body.fundingGoal) || 0,
        fundingRaised: parseFloat(req.body.fundingRaised) || 0,
        preservationStatus: req.body.preservationStatus || 'At Risk',
        heroImage: req.body.heroImage || null,
        thenImage: req.body.thenImage || null,
        nowImage: req.body.nowImage || null,
        modelUrl: req.body.modelUrl || null,
        audioUrl: req.body.audioUrl || null,
        latitude: req.body.latitude ? parseFloat(req.body.latitude) : null,
        longitude: req.body.longitude ? parseFloat(req.body.longitude) : null,
        featured: req.body.featured || false,
      },
    });

    res.status(201).json({ success: true, message: 'Heritage site created successfully.', data: site });
  } catch (error) {
    console.error('Create site error:', error);
    res.status(500).json({ success: false, message: 'Failed to create heritage site.' });
  }
};

export const updateSite = async (req, res) => {
  try {
    const existing = await prisma.heritageSite.findUnique({ where: { id: req.params.id } });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Heritage site not found.' });
    }

    const updateData = {};
    const fields = ['name', 'location', 'description', 'historicalInfo', 'currentCondition', 'period',
      'preservationStatus', 'heroImage', 'thenImage', 'nowImage', 'modelUrl', 'audioUrl', 'galleryImages'];

    fields.forEach(field => {
      if (req.body[field] !== undefined) updateData[field] = req.body[field];
    });

    if (req.body.fundingGoal !== undefined) updateData.fundingGoal = parseFloat(req.body.fundingGoal);
    if (req.body.fundingRaised !== undefined) updateData.fundingRaised = parseFloat(req.body.fundingRaised);
    if (req.body.latitude !== undefined) updateData.latitude = parseFloat(req.body.latitude);
    if (req.body.longitude !== undefined) updateData.longitude = parseFloat(req.body.longitude);
    if (req.body.featured !== undefined) updateData.featured = req.body.featured;

    const site = await prisma.heritageSite.update({
      where: { id: req.params.id },
      data: updateData,
    });

    res.json({ success: true, message: 'Heritage site updated.', data: site });
  } catch (error) {
    console.error('Update site error:', error);
    res.status(500).json({ success: false, message: 'Failed to update heritage site.' });
  }
};

export const deleteSite = async (req, res) => {
  try {
    const existing = await prisma.heritageSite.findUnique({ where: { id: req.params.id } });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Heritage site not found.' });
    }

    await prisma.heritageSite.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Heritage site deleted.' });
  } catch (error) {
    console.error('Delete site error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete heritage site.' });
  }
};

export const getSiteComponents = async (req, res) => {
  try {
    const components = await prisma.heritageComponent.findMany({
      where: { siteId: req.params.id },
      orderBy: { name: 'asc' },
    });
    res.json({ success: true, data: components });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch components.' });
  }
};

export const createComponent = async (req, res) => {
  try {
    const component = await prisma.heritageComponent.create({
      data: {
        siteId: req.params.id,
        name: req.body.name,
        description: req.body.description || '',
        type: req.body.type || 'stone',
        restorationCost: parseFloat(req.body.restorationCost) || 0,
        amountFunded: parseFloat(req.body.amountFunded) || 0,
        condition: req.body.condition || 'Deteriorating',
        status: req.body.status || 'Needs Restoration',
      },
    });
    res.status(201).json({ success: true, data: component });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create component.' });
  }
};

export const updateComponent = async (req, res) => {
  try {
    const component = await prisma.heritageComponent.update({
      where: { id: req.params.componentId },
      data: {
        ...(req.body.name && { name: req.body.name }),
        ...(req.body.description && { description: req.body.description }),
        ...(req.body.type && { type: req.body.type }),
        ...(req.body.restorationCost !== undefined && { restorationCost: parseFloat(req.body.restorationCost) }),
        ...(req.body.amountFunded !== undefined && { amountFunded: parseFloat(req.body.amountFunded) }),
        ...(req.body.condition && { condition: req.body.condition }),
        ...(req.body.status && { status: req.body.status }),
      },
    });
    res.json({ success: true, data: component });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update component.' });
  }
};

export const deleteComponent = async (req, res) => {
  try {
    await prisma.heritageComponent.delete({ where: { id: req.params.componentId } });
    res.json({ success: true, message: 'Component deleted.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete component.' });
  }
};
