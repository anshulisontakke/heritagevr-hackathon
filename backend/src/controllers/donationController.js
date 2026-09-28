import { PrismaClient } from '@prisma/client';
import Razorpay from 'razorpay';
import crypto from 'crypto';

const prisma = new PrismaClient();

// Initialize Razorpay (will fail gracefully if credentials are placeholder)
let razorpay = null;
try {
  if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_ID !== 'rzp_test_placeholder') {
    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
} catch (e) {
  console.warn('⚠️  Razorpay not configured. Payment features will use demo mode.');
}

export const createOrder = async (req, res) => {
  try {
    const { siteId, componentId, amount, donationType, message, anonymous } = req.body;

    if (!amount || amount < 1) {
      return res.status(400).json({ success: false, message: 'Amount must be at least ₹1.' });
    }

    // Verify site exists
    const site = await prisma.heritageSite.findUnique({ where: { id: siteId } });
    if (!site) {
      return res.status(404).json({ success: false, message: 'Heritage site not found.' });
    }

    // Verify component if specified
    if (componentId) {
      const component = await prisma.heritageComponent.findUnique({ where: { id: componentId } });
      if (!component) {
        return res.status(404).json({ success: false, message: 'Component not found.' });
      }
    }

    let razorpayOrder = null;

    if (razorpay) {
      // Real Razorpay order
      razorpayOrder = await razorpay.orders.create({
        amount: Math.round(amount * 100), // Razorpay expects paise
        currency: 'INR',
        receipt: `hvr_${Date.now()}`,
        notes: {
          siteId,
          componentId: componentId || '',
          userId: req.user.id,
        },
      });
    } else {
      // Demo mode order
      razorpayOrder = {
        id: `order_demo_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        amount: Math.round(amount * 100),
        currency: 'INR',
      };
    }

    // Create pending donation
    const donation = await prisma.donation.create({
      data: {
        userId: req.user.id,
        siteId,
        componentId: componentId || null,
        amount: parseFloat(amount),
        razorpayOrderId: razorpayOrder.id,
        paymentStatus: 'pending',
        donationType: donationType || 'general',
        message: message || null,
        anonymous: anonymous || false,
      },
    });

    res.json({
      success: true,
      data: {
        orderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        donationId: donation.id,
        keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
        demoMode: !razorpay,
      },
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ success: false, message: 'Failed to create payment order.' });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, donationId } = req.body;

    const donation = await prisma.donation.findUnique({
      where: { id: donationId },
      include: { site: true },
    });

    if (!donation) {
      return res.status(404).json({ success: false, message: 'Donation record not found.' });
    }

    let isValid = false;

    if (razorpay && razorpaySignature) {
      // Real Razorpay verification
      const body = razorpayOrderId + '|' + razorpayPaymentId;
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body)
        .digest('hex');
      isValid = expectedSignature === razorpaySignature;
    } else if (razorpayPaymentId && razorpayPaymentId.startsWith('pay_demo_')) {
      // Demo mode: accept demo payments
      isValid = true;
    }

    if (!isValid) {
      await prisma.donation.update({
        where: { id: donationId },
        data: { paymentStatus: 'failed' },
      });
      return res.status(400).json({ success: false, message: 'Payment verification failed.' });
    }

    // Update donation to success
    const updatedDonation = await prisma.donation.update({
      where: { id: donationId },
      data: {
        paymentStatus: 'success',
        razorpayPaymentId,
        razorpaySignature: razorpaySignature || 'demo_signature',
      },
    });

    // Update site funding
    await prisma.heritageSite.update({
      where: { id: donation.siteId },
      data: {
        fundingRaised: { increment: donation.amount },
        supporters: { increment: 1 },
      },
    });

    // Update component funding if applicable
    if (donation.componentId) {
      await prisma.heritageComponent.update({
        where: { id: donation.componentId },
        data: {
          amountFunded: { increment: donation.amount },
        },
      });
    }

    // Create fund transaction
    await prisma.fundTransaction.create({
      data: {
        siteId: donation.siteId,
        amount: donation.amount,
        type: 'donation_received',
        description: `₹${donation.amount.toLocaleString()} received from ${donation.anonymous ? 'Anonymous Donor' : 'a supporter'} for ${donation.site.name}`,
      },
    });

    res.json({
      success: true,
      message: 'Payment verified successfully. Thank you for your contribution!',
      data: updatedDonation,
    });
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({ success: false, message: 'Payment verification failed.' });
  }
};

export const demoPayment = async (req, res) => {
  // For demo purposes when Razorpay is not configured
  try {
    const { donationId } = req.body;

    const donation = await prisma.donation.findUnique({
      where: { id: donationId },
      include: { site: true },
    });

    if (!donation) {
      return res.status(404).json({ success: false, message: 'Donation not found.' });
    }

    // Simulate successful payment
    const updatedDonation = await prisma.donation.update({
      where: { id: donationId },
      data: {
        paymentStatus: 'success',
        razorpayPaymentId: `pay_demo_${Date.now()}`,
        razorpaySignature: 'demo_signature',
      },
    });

    // Update site funding
    await prisma.heritageSite.update({
      where: { id: donation.siteId },
      data: {
        fundingRaised: { increment: donation.amount },
        supporters: { increment: 1 },
      },
    });

    // Update component if applicable
    if (donation.componentId) {
      await prisma.heritageComponent.update({
        where: { id: donation.componentId },
        data: { amountFunded: { increment: donation.amount } },
      });
    }

    // Create fund transaction
    await prisma.fundTransaction.create({
      data: {
        siteId: donation.siteId,
        amount: donation.amount,
        type: 'donation_received',
        description: `₹${donation.amount.toLocaleString()} demo donation for ${donation.site.name}`,
      },
    });

    res.json({
      success: true,
      message: 'Demo payment successful!',
      data: updatedDonation,
    });
  } catch (error) {
    console.error('Demo payment error:', error);
    res.status(500).json({ success: false, message: 'Demo payment failed.' });
  }
};
