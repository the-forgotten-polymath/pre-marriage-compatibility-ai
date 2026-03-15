import { AssessmentResponse } from '@/components/AssessmentResults';
import { assessmentQuestions, assessmentCategories } from '@/data/assessmentQuestions';

export interface QualityOfLifeInsight {
  category: string;
  score: number;
  level: 'excellent' | 'good' | 'moderate' | 'needs_attention';
  insights: string[];
  recommendations: string[];
}

export interface QualityOfLifeReport {
  overallScore: number;
  categoryInsights: QualityOfLifeInsight[];
  strengths: string[];
  growthAreas: string[];
  personalityProfile: string;
  relationshipReadiness: string;
}

const getQualityLevel = (score: number): 'excellent' | 'good' | 'moderate' | 'needs_attention' => {
  if (score >= 4.5) return 'excellent';
  if (score >= 4.0) return 'good';
  if (score >= 3.0) return 'moderate';
  return 'needs_attention';
};

const getCategoryInsights = (category: string, avgImportance: number, avgFlexibility: number): string[] => {
  const insights: string[] = [];
  
  if (avgImportance >= 4.5) {
    insights.push(`${category} is extremely important to you and forms a core part of your value system.`);
  } else if (avgImportance >= 4.0) {
    insights.push(`${category} matters significantly to you and will influence major life decisions.`);
  } else if (avgImportance >= 3.0) {
    insights.push(`${category} has moderate importance in your life priorities.`);
  } else {
    insights.push(`${category} is currently less of a priority for you.`);
  }

  if (avgFlexibility <= 2.0) {
    insights.push(`You show high flexibility in this area, indicating openness to compromise and adaptation.`);
  } else if (avgFlexibility <= 3.5) {
    insights.push(`You have moderate flexibility, balancing personal preferences with willingness to adapt.`);
  } else {
    insights.push(`You have strong convictions in this area with limited flexibility for compromise.`);
  }

  return insights;
};

const getCategoryRecommendations = (category: string, level: string, avgImportance: number, avgFlexibility: number): string[] => {
  const recommendations: string[] = [];
  
  switch (category) {
    case 'Core Values & Ethics':
      if (level === 'excellent') {
        recommendations.push('Your strong ethical foundation will serve you well in relationships.');
        recommendations.push('Consider sharing your values openly with potential partners.');
      } else if (level === 'needs_attention') {
        recommendations.push('Reflect on your core values and how they guide your decisions.');
        recommendations.push('Consider exploring philosophical or ethical frameworks that resonate with you.');
      }
      break;
      
    case 'Religion':
      if (avgImportance >= 4.0) {
        recommendations.push('Seek partners who share or respect your religious beliefs.');
        recommendations.push('Consider how your faith will influence family life and major decisions.');
      } else {
        recommendations.push('Be open about your level of religious involvement with potential partners.');
      }
      break;
      
    case 'Children & Parenting':
      if (avgImportance >= 4.0) {
        recommendations.push('Have clear conversations about family planning early in relationships.');
        recommendations.push('Consider your parenting philosophy and discuss it with potential partners.');
      }
      break;
      
    case 'Finances':
      if (level === 'needs_attention') {
        recommendations.push('Develop financial literacy and create a personal budget.');
        recommendations.push('Consider speaking with a financial advisor about long-term planning.');
      }
      break;
      
    case 'Communication & Conflict':
      if (level === 'needs_attention') {
        recommendations.push('Practice active listening skills and healthy conflict resolution.');
        recommendations.push('Consider relationship communication workshops or counseling.');
      }
      break;
      
    default:
      if (level === 'excellent') {
        recommendations.push(`Your approach to ${category.toLowerCase()} shows maturity and clarity.`);
      } else if (level === 'needs_attention') {
        recommendations.push(`Consider reflecting more deeply on your priorities regarding ${category.toLowerCase()}.`);
      }
  }
  
  return recommendations;
};

const getPersonalityProfile = (responses: AssessmentResponse[]): string => {
  const avgImportance = responses.reduce((sum, r) => sum + r.importance, 0) / responses.length;
  const avgFlexibility = responses.reduce((sum, r) => sum + r.flexibility, 0) / responses.length;
  
  let profile = '';
  
  if (avgImportance >= 4.0 && avgFlexibility <= 2.5) {
    profile = 'The Adaptive Achiever: You have clear priorities but remain flexible in how you achieve them. This balance makes you an excellent partner who can maintain standards while compromising when needed.';
  } else if (avgImportance >= 4.0 && avgFlexibility >= 4.0) {
    profile = 'The Determined Idealist: You have strong convictions and high standards. While this clarity is admirable, consider areas where flexibility might strengthen your relationships.';
  } else if (avgImportance <= 3.0 && avgFlexibility <= 2.5) {
    profile = 'The Easy-Going Supporter: You\'re highly adaptable and accommodating. While this makes you a supportive partner, ensure your own needs and preferences are also heard and valued.';
  } else {
    profile = 'The Balanced Individual: You show a healthy mix of having preferences while remaining flexible. This balanced approach serves you well in building harmonious relationships.';
  }
  
  return profile;
};

const getRelationshipReadiness = (categoryInsights: QualityOfLifeInsight[]): string => {
  const needsAttentionCount = categoryInsights.filter(c => c.level === 'needs_attention').length;
  const excellentCount = categoryInsights.filter(c => c.level === 'excellent').length;
  
  if (needsAttentionCount <= 1 && excellentCount >= 8) {
    return 'Highly Ready: You demonstrate strong self-awareness and clarity across most life areas. You\'re well-prepared for a committed relationship and likely to be a thoughtful, engaged partner.';
  } else if (needsAttentionCount <= 3) {
    return 'Well Prepared: You have good self-awareness in most areas with some room for growth. Continue developing in areas that need attention, and you\'ll be an excellent partner.';
  } else if (needsAttentionCount <= 5) {
    return 'Developing Readiness: You have clarity in some areas but would benefit from more self-reflection in others. Consider this assessment as a starting point for personal growth before committing to a serious relationship.';
  } else {
    return 'Early Development Stage: You\'re in the process of discovering your priorities and preferences. Take time for personal growth and self-discovery before making major relationship commitments.';
  }
};

export const generateQualityOfLifeAnalysis = (responses: AssessmentResponse[]): QualityOfLifeReport => {
  const categoryInsights: QualityOfLifeInsight[] = [];
  let totalScore = 0;
  
  assessmentCategories.forEach(category => {
    const categoryQuestions = assessmentQuestions.filter(q => q.category === category);
    const categoryResponses = responses.filter(r => 
      categoryQuestions.some(q => q.id === r.questionId)
    );
    
    if (categoryResponses.length > 0) {
      const avgImportance = categoryResponses.reduce((sum, r) => sum + r.importance, 0) / categoryResponses.length;
      const avgFlexibility = categoryResponses.reduce((sum, r) => sum + r.flexibility, 0) / categoryResponses.length;
      
      // Quality score considers both having clear priorities and appropriate flexibility
      const qualityScore = avgImportance >= 3.0 ? 
        avgImportance * (1 - Math.abs(avgFlexibility - 2.5) / 2.5) : 
        avgImportance;
      
      const level = getQualityLevel(qualityScore);
      const insights = getCategoryInsights(category, avgImportance, avgFlexibility);
      const recommendations = getCategoryRecommendations(category, level, avgImportance, avgFlexibility);
      
      categoryInsights.push({
        category,
        score: qualityScore,
        level,
        insights,
        recommendations
      });
      
      totalScore += qualityScore;
    }
  });
  
  const overallScore = totalScore / categoryInsights.length;
  
  // Generate strengths and growth areas
  const strengths = categoryInsights
    .filter(c => c.level === 'excellent' || c.level === 'good')
    .map(c => c.category)
    .slice(0, 5);
    
  const growthAreas = categoryInsights
    .filter(c => c.level === 'needs_attention' || c.level === 'moderate')
    .map(c => c.category)
    .slice(0, 3);
  
  const personalityProfile = getPersonalityProfile(responses);
  const relationshipReadiness = getRelationshipReadiness(categoryInsights);
  
  return {
    overallScore,
    categoryInsights,
    strengths,
    growthAreas,
    personalityProfile,
    relationshipReadiness
  };
};