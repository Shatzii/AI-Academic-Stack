/**
 * School Registration & Payment System
 * 
 * Complete school district onboarding with Stripe payment integration
 * Tiered pricing and automated billing system
 */

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

class SchoolRegistrationSystem {
  constructor() {
    this.pricingTiers = {
      basic: {
        name: 'Basic',
        price: 29900, // $299 in cents
        studentLimit: 100,
        features: [
          'AI Teachers (All 6)',
          'Basic Curriculum Generation',
          'Student Progress Tracking',
          'Parent Dashboard',
          'Email Support'
        ],
        stripePriceId: process.env.STRIPE_BASIC_PRICE_ID
      },
      pro: {
        name: 'Professional', 
        price: 59900, // $599 in cents
        studentLimit: 500,
        features: [
          'Everything in Basic',
          'Advanced Analytics',
          'Custom Curriculum Standards',
          'Neurodivergent Adaptations',
          'Priority Support',
          'Admin Training Sessions'
        ],
        stripePriceId: process.env.STRIPE_PRO_PRICE_ID
      },
      enterprise: {
        name: 'Enterprise',
        price: 129900, // $1,299 in cents
        studentLimit: null, // unlimited
        features: [
          'Everything in Professional',
          'Unlimited Students',
          'White-label Platform',
          'Custom AI Teacher Training',
          'API Access',
          'Dedicated Success Manager',
          'Custom Integrations'
        ],
        stripePriceId: process.env.STRIPE_ENTERPRISE_PRICE_ID
      }
    };
  }

  /**
   * Register a new school district
   */
  async registerSchool(registrationData) {
    const {
      schoolName,
      districtName,
      adminEmail,
      adminName,
      phone,
      address,
      estimatedStudents,
      pricingTier,
      paymentMethodId
    } = registrationData;

    // Validate pricing tier
    if (!this.pricingTiers[pricingTier]) {
      throw new Error(`Invalid pricing tier: ${pricingTier}`);
    }

    const tier = this.pricingTiers[pricingTier];

    // Check student limit
    if (tier.studentLimit && estimatedStudents > tier.studentLimit) {
      throw new Error(`Student count (${estimatedStudents}) exceeds limit for ${tier.name} plan (${tier.studentLimit})`);
    }

    try {
      // Create Stripe customer
      const customer = await stripe.customers.create({
        name: schoolName,
        email: adminEmail,
        description: `${districtName} - ${schoolName}`,
        metadata: {
          schoolName,
          districtName,
          adminName,
          estimatedStudents: estimatedStudents.toString(),
          pricingTier
        },
        address: {
          line1: address.street,
          city: address.city,
          state: address.state,
          postal_code: address.zipCode,
          country: 'US'
        }
      });

      // Attach payment method to customer
      await stripe.paymentMethods.attach(paymentMethodId, {
        customer: customer.id,
      });

      // Set as default payment method
      await stripe.customers.update(customer.id, {
        invoice_settings: {
          default_payment_method: paymentMethodId,
        },
      });

      // Create subscription
      const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [{
          price: tier.stripePriceId,
        }],
        payment_behavior: 'default_incomplete',
        payment_settings: { 
          save_default_payment_method: 'on_subscription' 
        },
        expand: ['latest_invoice.payment_intent'],
        metadata: {
          schoolName,
          districtName,
          pricingTier,
          estimatedStudents: estimatedStudents.toString()
        }
      });

      // Create school record in database
      const schoolId = await this.createSchoolRecord({
        schoolName,
        districtName,
        adminEmail,
        adminName,
        phone,
        address,
        estimatedStudents,
        pricingTier,
        stripeCustomerId: customer.id,
        stripeSubscriptionId: subscription.id,
        status: subscription.status,
        features: tier.features,
        studentLimit: tier.studentLimit
      });

      // Send welcome email
      await this.sendWelcomeEmail({
        email: adminEmail,
        schoolName,
        adminName,
        pricingTier: tier.name,
        loginUrl: `https://schools.shatzii.com/login?school=${schoolId}`
      });

      return {
        success: true,
        schoolId,
        customerId: customer.id,
        subscriptionId: subscription.id,
        clientSecret: subscription.latest_invoice.payment_intent.client_secret,
        status: subscription.status,
        pricingTier: tier,
        message: 'School registration successful! Check your email for login instructions.'
      };

    } catch (error) {
      console.error('School registration error:', error);
      throw new Error(`Registration failed: ${error.message}`);
    }
  }

  /**
   * Create school record in database
   */
  async createSchoolRecord(schoolData) {
    const schoolId = this.generateSchoolId();
    
    // In production, this would save to actual database
    const schoolRecord = {
      id: schoolId,
      ...schoolData,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
      currentStudentCount: 0,
      usageStats: {
        monthlyLessons: 0,
        monthlyTutoringMinutes: 0,
        monthlyAssessments: 0
      }
    };

    // Simulate database save
    console.log('Creating school record:', schoolRecord);
    
    return schoolId;
  }

  /**
   * Handle successful payment webhook
   */
  async handlePaymentSuccess(subscriptionId) {
    try {
      // Retrieve subscription from Stripe
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      
      // Activate school account
      await this.activateSchoolAccount(subscription.metadata.schoolName, subscription.id);
      
      // Send activation email
      await this.sendActivationEmail(subscription);
      
      return { success: true };
    } catch (error) {
      console.error('Payment success handling error:', error);
      throw error;
    }
  }

  /**
   * Handle failed payment webhook
   */
  async handlePaymentFailed(subscriptionId) {
    try {
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      
      // Suspend school account
      await this.suspendSchoolAccount(subscription.metadata.schoolName);
      
      // Send payment failure notification
      await this.sendPaymentFailureEmail(subscription);
      
      return { success: true };
    } catch (error) {
      console.error('Payment failure handling error:', error);
      throw error;
    }
  }

  /**
   * Upgrade school subscription
   */
  async upgradeSubscription(schoolId, newTier) {
    try {
      const school = await this.getSchoolById(schoolId);
      if (!school) {
        throw new Error('School not found');
      }

      const newTierConfig = this.pricingTiers[newTier];
      if (!newTierConfig) {
        throw new Error('Invalid pricing tier');
      }

      // Update Stripe subscription
      const subscription = await stripe.subscriptions.retrieve(school.stripeSubscriptionId);
      
      await stripe.subscriptions.update(school.stripeSubscriptionId, {
        items: [{
          id: subscription.items.data[0].id,
          price: newTierConfig.stripePriceId,
        }],
        proration_behavior: 'create_prorations',
      });

      // Update school record
      await this.updateSchoolTier(schoolId, newTier, newTierConfig);

      return {
        success: true,
        message: `Successfully upgraded to ${newTierConfig.name} plan`,
        newFeatures: newTierConfig.features
      };

    } catch (error) {
      console.error('Subscription upgrade error:', error);
      throw error;
    }
  }

  /**
   * Get school usage analytics
   */
  async getSchoolUsage(schoolId) {
    const school = await this.getSchoolById(schoolId);
    if (!school) {
      throw new Error('School not found');
    }

    const currentDate = new Date();
    const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

    return {
      schoolId,
      currentPlan: school.pricingTier,
      studentCount: school.currentStudentCount,
      studentLimit: school.studentLimit,
      utilizationPercentage: school.studentLimit ? 
        Math.round((school.currentStudentCount / school.studentLimit) * 100) : 0,
      monthlyUsage: {
        lessons: school.usageStats.monthlyLessons,
        tutoringMinutes: school.usageStats.monthlyTutoringMinutes,
        assessments: school.usageStats.monthlyAssessments,
        period: `${monthStart.toLocaleDateString()} - ${currentDate.toLocaleDateString()}`
      },
      billingStatus: school.status,
      nextBillingDate: await this.getNextBillingDate(school.stripeSubscriptionId)
    };
  }

  /**
   * Cancel school subscription
   */
  async cancelSubscription(schoolId, reason = '') {
    try {
      const school = await this.getSchoolById(schoolId);
      if (!school) {
        throw new Error('School not found');
      }

      // Cancel Stripe subscription at period end
      await stripe.subscriptions.update(school.stripeSubscriptionId, {
        cancel_at_period_end: true,
        metadata: {
          cancellation_reason: reason,
          cancelled_at: new Date().toISOString()
        }
      });

      // Update school status
      await this.updateSchoolStatus(schoolId, 'cancelled');

      // Send cancellation confirmation
      await this.sendCancellationEmail(school, reason);

      return {
        success: true,
        message: 'Subscription cancelled. Access will continue until the end of the billing period.',
        accessUntil: await this.getSubscriptionEndDate(school.stripeSubscriptionId)
      };

    } catch (error) {
      console.error('Subscription cancellation error:', error);
      throw error;
    }
  }

  /**
   * Send welcome email to new school
   */
  async sendWelcomeEmail({ email, schoolName, adminName, pricingTier, loginUrl }) {
    const emailContent = `
    Dear ${adminName},

    Welcome to Shatzii Education AI Platform! 

    Your ${schoolName} has been successfully registered with our ${pricingTier} plan.

    Your AI Teachers are ready:
    • Professor Newton (Mathematics)
    • Dr. Curie (Science) 
    • Ms. Shakespeare (English)
    • Professor Timeline (Social Studies)
    • Maestro Picasso (Arts)
    • Dr. Inclusive (Special Education)

    Next Steps:
    1. Access your admin dashboard: ${loginUrl}
    2. Complete your school profile setup
    3. Import your student roster
    4. Schedule a platform orientation call

    Our customer success team will contact you within 24 hours to help with onboarding.

    Questions? Reply to this email or call our support team.

    Best regards,
    The Shatzii Education Team
    `;

    // In production, this would use actual email service
    console.log('Sending welcome email to:', email, emailContent);
    return true;
  }

  /**
   * Send activation email after successful payment
   */
  async sendActivationEmail(subscription) {
    const emailContent = `
    Your Shatzii Education platform is now fully activated!
    
    All AI teachers are ready for your students.
    Login now to begin: https://schools.shatzii.com/login
    `;

    console.log('Sending activation email:', emailContent);
    return true;
  }

  /**
   * Send payment failure notification
   */
  async sendPaymentFailureEmail(subscription) {
    const emailContent = `
    We were unable to process your payment for Shatzii Education.
    
    Please update your payment method to continue using our platform.
    Login to update: https://schools.shatzii.com/billing
    `;

    console.log('Sending payment failure email:', emailContent);
    return true;
  }

  /**
   * Send cancellation confirmation
   */
  async sendCancellationEmail(school, reason) {
    const emailContent = `
    Your subscription has been cancelled as requested.
    
    Reason: ${reason}
    
    Your access will continue until the end of your current billing period.
    `;

    console.log('Sending cancellation email:', emailContent);
    return true;
  }

  // Helper methods
  generateSchoolId() {
    return `school_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  async activateSchoolAccount(schoolName, subscriptionId) {
    console.log(`Activating school account: ${schoolName}`);
    // Update database status to active
    return true;
  }

  async suspendSchoolAccount(schoolName) {
    console.log(`Suspending school account: ${schoolName}`);
    // Update database status to suspended
    return true;
  }

  async getSchoolById(schoolId) {
    // In production, this would query actual database
    return {
      id: schoolId,
      schoolName: 'Sample School',
      pricingTier: 'pro',
      stripeSubscriptionId: 'sub_example',
      currentStudentCount: 250,
      studentLimit: 500,
      status: 'active',
      usageStats: {
        monthlyLessons: 1250,
        monthlyTutoringMinutes: 3500,
        monthlyAssessments: 450
      }
    };
  }

  async updateSchoolTier(schoolId, newTier, tierConfig) {
    console.log(`Updating school ${schoolId} to ${newTier} tier`);
    return true;
  }

  async updateSchoolStatus(schoolId, status) {
    console.log(`Updating school ${schoolId} status to ${status}`);
    return true;
  }

  async getNextBillingDate(subscriptionId) {
    try {
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      return new Date(subscription.current_period_end * 1000);
    } catch (error) {
      return null;
    }
  }

  async getSubscriptionEndDate(subscriptionId) {
    try {
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      return new Date(subscription.current_period_end * 1000);
    } catch (error) {
      return null;
    }
  }

  /**
   * Get all pricing tiers
   */
  getPricingTiers() {
    return this.pricingTiers;
  }

  /**
   * Validate school eligibility for features
   */
  validateFeatureAccess(schoolId, feature) {
    // Implementation would check school's tier and features
    return true;
  }

  /**
   * Track usage for billing
   */
  async trackUsage(schoolId, usageType, amount = 1) {
    console.log(`Tracking usage for school ${schoolId}: ${usageType} +${amount}`);
    // Update usage statistics in database
    return true;
  }
}

module.exports = { SchoolRegistrationSystem };