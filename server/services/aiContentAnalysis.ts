/**
 * Universal One School - AI Content Analysis Engine
 * Advanced AI-powered content analysis for social media safety monitoring
 */

import Anthropic from '@anthropic-ai/sdk';
import type { 
  SocialMediaActivity, 
  ThreatAnalysis, 
  SecurityAlert,
  InsertThreatAnalysis,
  InsertSecurityAlert
} from '@shared/schema';

// The newest Anthropic model is "claude-sonnet-4-20250514"
const DEFAULT_MODEL_STR = "claude-sonnet-4-20250514";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export interface PredatorRiskAssessment {
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  confidence: number; // 0.0-1.0
  indicators: string[];
  immediateAction: boolean;
  evidence: any[];
}

export interface BullyingAssessment {
  isBullying: boolean;
  severity: 'mild' | 'moderate' | 'severe' | 'extreme';
  confidence: number;
  bullyingType: string[];
  targetIdentified: boolean;
  interventionNeeded: boolean;
}

export interface ContentAssessment {
  appropriate: boolean;
  ageRating: string;
  concerns: string[];
  violatedPolicies: string[];
  parentalReviewNeeded: boolean;
}

export interface MentalHealthRisk {
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  indicators: string[];
  immediateIntervention: boolean;
  recommendedActions: string[];
  confidence: number;
}

export interface ConversationContext {
  participants: string[];
  duration: number;
  messageCount: number;
  previousFlags: any[];
  relationshipHistory: any[];
}

export class AIContentAnalysisEngine {
  
  /**
   * Analyze content for predator behavior patterns
   * Target accuracy: 98.7%
   */
  async analyzePredatorRisk(
    content: string, 
    participants: string[],
    context?: ConversationContext
  ): Promise<PredatorRiskAssessment> {
    
    const systemPrompt = `You are an expert AI trained to detect predatory behavior in digital communications involving minors. Analyze the content for grooming tactics, manipulation, inappropriate requests, and other predatory indicators.

Key grooming patterns to detect:
- Excessive compliments and flattery
- Attempts to isolate the minor
- Requests for secrecy
- Gradual introduction of sexual content
- Attempts to meet in person
- Gift-giving or promises
- Trust-building followed by boundary-pushing
- Age-inappropriate conversations

Respond in JSON format with:
{
  "riskLevel": "low|medium|high|critical",
  "confidence": 0.0-1.0,
  "indicators": ["specific_indicators_found"],
  "immediateAction": boolean,
  "evidence": ["specific_content_excerpts"]
}`;

    try {
      const response = await anthropic.messages.create({
        model: DEFAULT_MODEL_STR,
        max_tokens: 1024,
        system: systemPrompt,
        messages: [{
          role: 'user',
          content: `Analyze this content for predatory behavior:

Content: "${content}"
Participants: ${participants.join(', ')}
Context: ${context ? JSON.stringify(context, null, 2) : 'No additional context'}

Provide your analysis in JSON format.`
        }]
      });

      const result = JSON.parse(response.content[0].text);
      return {
        riskLevel: result.riskLevel,
        confidence: Math.max(0, Math.min(1, result.confidence)),
        indicators: result.indicators || [],
        immediateAction: result.immediateAction || false,
        evidence: result.evidence || []
      };
    } catch (error) {
      console.error('Predator risk analysis failed:', error);
      throw new Error('Failed to analyze predator risk: ' + error.message);
    }
  }

  /**
   * Detect cyberbullying patterns and severity
   */
  async detectCyberbullying(
    content: string,
    context: ConversationContext
  ): Promise<BullyingAssessment> {
    
    const systemPrompt = `You are an expert AI trained to detect cyberbullying in digital communications. Analyze the content for harassment, threats, exclusion, humiliation, and other forms of bullying.

Types of cyberbullying to detect:
- Direct harassment and name-calling
- Threats of violence or harm
- Social exclusion and isolation
- Public humiliation and embarrassment
- Spreading rumors or false information
- Identity theft or impersonation
- Doxxing or sharing private information
- Coordinated group harassment

Respond in JSON format with:
{
  "isBullying": boolean,
  "severity": "mild|moderate|severe|extreme",
  "confidence": 0.0-1.0,
  "bullyingType": ["types_detected"],
  "targetIdentified": boolean,
  "interventionNeeded": boolean
}`;

    try {
      const response = await anthropic.messages.create({
        model: DEFAULT_MODEL_STR,
        max_tokens: 1024,
        system: systemPrompt,
        messages: [{
          role: 'user',
          content: `Analyze this content for cyberbullying:

Content: "${content}"
Context: ${JSON.stringify(context, null, 2)}

Provide your analysis in JSON format.`
        }]
      });

      const result = JSON.parse(response.content[0].text);
      return {
        isBullying: result.isBullying || false,
        severity: result.severity || 'mild',
        confidence: Math.max(0, Math.min(1, result.confidence || 0)),
        bullyingType: result.bullyingType || [],
        targetIdentified: result.targetIdentified || false,
        interventionNeeded: result.interventionNeeded || false
      };
    } catch (error) {
      console.error('Cyberbullying detection failed:', error);
      throw new Error('Failed to detect cyberbullying: ' + error.message);
    }
  }

  /**
   * Assess content appropriateness for student age
   */
  async assessContentAppropriateness(
    content: string,
    studentAge: number
  ): Promise<ContentAssessment> {
    
    const systemPrompt = `You are an expert AI trained to assess content appropriateness for students of different ages. Consider educational standards, developmental appropriateness, and safety concerns.

Factors to evaluate:
- Language appropriateness (profanity, mature themes)
- Violence and disturbing content
- Sexual content or references
- Substance use references
- Educational value vs. harmful content
- Age-appropriate complexity and themes

Respond in JSON format with:
{
  "appropriate": boolean,
  "ageRating": "K-6|7-12|13+|18+",
  "concerns": ["specific_concerns"],
  "violatedPolicies": ["policy_violations"],
  "parentalReviewNeeded": boolean
}`;

    try {
      const response = await anthropic.messages.create({
        model: DEFAULT_MODEL_STR,
        max_tokens: 1024,
        system: systemPrompt,
        messages: [{
          role: 'user',
          content: `Assess content appropriateness for a ${studentAge}-year-old student:

Content: "${content}"

Provide your analysis in JSON format.`
        }]
      });

      const result = JSON.parse(response.content[0].text);
      return {
        appropriate: result.appropriate || false,
        ageRating: result.ageRating || '18+',
        concerns: result.concerns || [],
        violatedPolicies: result.violatedPolicies || [],
        parentalReviewNeeded: result.parentalReviewNeeded || false
      };
    } catch (error) {
      console.error('Content appropriateness assessment failed:', error);
      throw new Error('Failed to assess content appropriateness: ' + error.message);
    }
  }

  /**
   * Evaluate mental health risk indicators
   */
  async evaluateMentalHealthRisk(
    content: string,
    behaviorHistory: any[]
  ): Promise<MentalHealthRisk> {
    
    const systemPrompt = `You are an expert AI trained to identify mental health risk indicators in student communications. Look for signs of depression, anxiety, self-harm, suicidal ideation, and other mental health concerns.

Key indicators to detect:
- Expressions of hopelessness or despair
- Self-harm references or planning
- Suicidal ideation or planning
- Severe mood changes
- Social isolation indicators
- Substance abuse references
- Extreme anxiety or panic
- Disordered eating patterns

Respond in JSON format with:
{
  "riskLevel": "low|medium|high|critical",
  "indicators": ["specific_indicators_found"],
  "immediateIntervention": boolean,
  "recommendedActions": ["specific_actions"],
  "confidence": 0.0-1.0
}`;

    try {
      const response = await anthropic.messages.create({
        model: DEFAULT_MODEL_STR,
        max_tokens: 1024,
        system: systemPrompt,
        messages: [{
          role: 'user',
          content: `Evaluate mental health risk indicators:

Content: "${content}"
Behavior History: ${JSON.stringify(behaviorHistory, null, 2)}

Provide your analysis in JSON format.`
        }]
      });

      const result = JSON.parse(response.content[0].text);
      return {
        riskLevel: result.riskLevel || 'low',
        indicators: result.indicators || [],
        immediateIntervention: result.immediateIntervention || false,
        recommendedActions: result.recommendedActions || [],
        confidence: Math.max(0, Math.min(1, result.confidence || 0))
      };
    } catch (error) {
      console.error('Mental health risk evaluation failed:', error);
      throw new Error('Failed to evaluate mental health risk: ' + error.message);
    }
  }

  /**
   * Comprehensive content analysis combining all risk factors
   */
  async analyzeContent(activity: SocialMediaActivity): Promise<{
    threatAnalysis: InsertThreatAnalysis;
    securityAlert?: InsertSecurityAlert;
  }> {
    const content = activity.content || '';
    const participants = (activity.involvedUsers as string[]) || [];
    
    // Run parallel analyses
    const [predatorRisk, bullyingAssessment, contentAssessment, mentalHealthRisk] = 
      await Promise.all([
        this.analyzePredatorRisk(content, participants).catch(() => null),
        this.detectCyberbullying(content, { 
          participants, 
          duration: 0, 
          messageCount: 1, 
          previousFlags: [], 
          relationshipHistory: [] 
        }).catch(() => null),
        this.assessContentAppropriateness(content, 16).catch(() => null), // Default age
        this.evaluateMentalHealthRisk(content, []).catch(() => null)
      ]);

    // Calculate overall risk score
    let riskScore = 0;
    let threatTypes: string[] = [];
    let highestSeverity = 'low';

    if (predatorRisk && predatorRisk.riskLevel !== 'low') {
      riskScore += this.getRiskScore(predatorRisk.riskLevel) * predatorRisk.confidence;
      threatTypes.push('predator_risk');
      if (this.compareSeverity(predatorRisk.riskLevel, highestSeverity) > 0) {
        highestSeverity = predatorRisk.riskLevel;
      }
    }

    if (bullyingAssessment && bullyingAssessment.isBullying) {
      riskScore += this.getSeverityScore(bullyingAssessment.severity) * bullyingAssessment.confidence;
      threatTypes.push('cyberbullying');
      if (this.compareSeverity(bullyingAssessment.severity, highestSeverity) > 0) {
        highestSeverity = bullyingAssessment.severity;
      }
    }

    if (contentAssessment && !contentAssessment.appropriate) {
      riskScore += 30;
      threatTypes.push('inappropriate_content');
    }

    if (mentalHealthRisk && mentalHealthRisk.riskLevel !== 'low') {
      riskScore += this.getRiskScore(mentalHealthRisk.riskLevel) * mentalHealthRisk.confidence;
      threatTypes.push('mental_health_risk');
      if (this.compareSeverity(mentalHealthRisk.riskLevel, highestSeverity) > 0) {
        highestSeverity = mentalHealthRisk.riskLevel;
      }
    }

    const threatAnalysis: InsertThreatAnalysis = {
      activityId: activity.id,
      analysisType: 'content',
      aiModel: DEFAULT_MODEL_STR,
      threatTypes,
      confidence: Math.min(riskScore / 100, 1),
      details: {
        predatorRisk,
        bullyingAssessment,
        contentAssessment,
        mentalHealthRisk
      },
      recommendations: this.generateRecommendations(riskScore, threatTypes),
      reviewRequired: riskScore > 70
    };

    let securityAlert: InsertSecurityAlert | undefined;

    // Create security alert for high-risk content
    if (riskScore > 60) {
      securityAlert = {
        userId: activity.accountId, // This should be mapped to actual user ID
        schoolId: 'unknown', // This should be determined from user context
        alertType: threatTypes[0] || 'general_risk',
        severity: this.mapRiskScoreToSeverity(riskScore),
        title: this.generateAlertTitle(threatTypes, riskScore),
        description: this.generateAlertDescription(threatAnalysis.details),
        evidence: {
          content: content.substring(0, 500), // Truncate for privacy
          riskScore,
          threatTypes,
          timestamp: activity.timestamp
        },
        riskScore: Math.round(riskScore),
        parentNotified: riskScore > 80,
        lawEnforcementNotified: riskScore > 90
      };
    }

    return { threatAnalysis, securityAlert };
  }

  private getRiskScore(level: string): number {
    switch (level) {
      case 'low': return 20;
      case 'medium': return 50;
      case 'high': return 80;
      case 'critical': return 100;
      default: return 0;
    }
  }

  private getSeverityScore(severity: string): number {
    switch (severity) {
      case 'mild': return 25;
      case 'moderate': return 50;
      case 'severe': return 75;
      case 'extreme': return 100;
      default: return 0;
    }
  }

  private compareSeverity(level1: string, level2: string): number {
    const levels = ['low', 'mild', 'medium', 'moderate', 'high', 'severe', 'critical', 'extreme'];
    return levels.indexOf(level1) - levels.indexOf(level2);
  }

  private mapRiskScoreToSeverity(score: number): string {
    if (score >= 90) return 'critical';
    if (score >= 70) return 'high';
    if (score >= 40) return 'medium';
    return 'low';
  }

  private generateRecommendations(riskScore: number, threatTypes: string[]): string[] {
    const recommendations: string[] = [];

    if (riskScore > 90) {
      recommendations.push('Immediate intervention required');
      recommendations.push('Contact law enforcement if applicable');
      recommendations.push('Notify parents/guardians immediately');
    } else if (riskScore > 70) {
      recommendations.push('Schedule counselor meeting within 24 hours');
      recommendations.push('Notify parents/guardians');
      recommendations.push('Increase monitoring level');
    } else if (riskScore > 40) {
      recommendations.push('Schedule wellness check');
      recommendations.push('Consider parental notification');
    }

    if (threatTypes.includes('cyberbullying')) {
      recommendations.push('Implement anti-bullying intervention');
    }

    if (threatTypes.includes('predator_risk')) {
      recommendations.push('Review all communications with involved parties');
    }

    return recommendations;
  }

  private generateAlertTitle(threatTypes: string[], riskScore: number): string {
    if (threatTypes.includes('predator_risk')) {
      return 'Potential Predatory Behavior Detected';
    }
    if (threatTypes.includes('cyberbullying')) {
      return 'Cyberbullying Activity Detected';
    }
    if (threatTypes.includes('mental_health_risk')) {
      return 'Mental Health Risk Indicators Found';
    }
    if (threatTypes.includes('inappropriate_content')) {
      return 'Inappropriate Content Detected';
    }
    return `Security Alert - Risk Score: ${Math.round(riskScore)}`;
  }

  private generateAlertDescription(details: any): string {
    const descriptions: string[] = [];

    if (details.predatorRisk && details.predatorRisk.riskLevel !== 'low') {
      descriptions.push(`Predator risk detected (${details.predatorRisk.riskLevel} level)`);
    }

    if (details.bullyingAssessment && details.bullyingAssessment.isBullying) {
      descriptions.push(`Cyberbullying detected (${details.bullyingAssessment.severity} severity)`);
    }

    if (details.contentAssessment && !details.contentAssessment.appropriate) {
      descriptions.push('Age-inappropriate content identified');
    }

    if (details.mentalHealthRisk && details.mentalHealthRisk.riskLevel !== 'low') {
      descriptions.push(`Mental health concerns detected (${details.mentalHealthRisk.riskLevel} risk)`);
    }

    return descriptions.join('. ') || 'Multiple risk factors detected requiring review.';
  }
}

export const aiContentAnalysisEngine = new AIContentAnalysisEngine();