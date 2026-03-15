import jsPDF from 'jspdf';
import { PartnerData, AssessmentResponse } from '@/components/AssessmentResults';
import { assessmentQuestions, assessmentCategories, importanceLabels, flexibilityLabels } from '@/data/assessmentQuestions';
import { generateQualityOfLifeAnalysis, QualityOfLifeReport } from '@/utils/qualityOfLifeAnalysis';

const getCompatibilityScore = (responseA: AssessmentResponse, responseB: AssessmentResponse) => {
  const importanceGap = Math.abs(responseA.importance - responseB.importance);
  
  if (importanceGap <= 1) return 'green';
  if (importanceGap === 2) return 'yellow';
  return 'red';
};

const getCompatibilityLabel = (score: string) => {
  switch (score) {
    case 'green': return 'Aligned';
    case 'yellow': return 'Needs Discussion';
    case 'red': return 'Priority Area';
    default: return 'Unknown';
  }
};

export const generatePDFReport = (partnerA: PartnerData, partnerB: PartnerData): void => {
  const pdf = new jsPDF();
  let yPosition = 20;
  const pageHeight = pdf.internal.pageSize.height;
  const margin = 20;

  // Helper function to check if we need a new page
  const checkNewPage = (additionalHeight: number) => {
    if (yPosition + additionalHeight > pageHeight - margin) {
      pdf.addPage();
      yPosition = 20;
    }
  };

  // Cover Page
  pdf.setFontSize(24);
  pdf.setTextColor(33, 66, 99); // Primary color
  pdf.text('Marriage Compatibility Assessment Report', 20, yPosition);
  yPosition += 20;

  pdf.setFontSize(16);
  pdf.setTextColor(0, 0, 0);
  pdf.text(`${partnerA.name} & ${partnerB.name}`, 20, yPosition);
  yPosition += 10;

  pdf.setFontSize(12);
  pdf.setTextColor(100, 100, 100);
  pdf.text(`Generated: ${new Date().toLocaleDateString()}`, 20, yPosition);
  yPosition += 30;

  // Executive Summary
  checkNewPage(50);
  pdf.setFontSize(18);
  pdf.setTextColor(33, 66, 99);
  pdf.text('Executive Summary', 20, yPosition);
  yPosition += 15;

  // Calculate overall scores
  const allScores = assessmentQuestions.map(q => {
    const responseA = partnerA.responses.find(r => r.questionId === q.id);
    const responseB = partnerB.responses.find(r => r.questionId === q.id);
    
    if (responseA && responseB) {
      return getCompatibilityScore(responseA, responseB);
    }
    return null;
  }).filter(Boolean);

  const greenCount = allScores.filter(s => s === 'green').length;
  const yellowCount = allScores.filter(s => s === 'yellow').length;
  const redCount = allScores.filter(s => s === 'red').length;
  const compatibilityPercentage = Math.round((greenCount / allScores.length) * 100);

  pdf.setFontSize(12);
  pdf.setTextColor(0, 0, 0);
  pdf.text(`Overall Compatibility Score: ${compatibilityPercentage}%`, 20, yPosition);
  yPosition += 10;
  pdf.text(`Aligned Areas (Green): ${greenCount} topics`, 20, yPosition);
  yPosition += 8;
  pdf.text(`Discussion Areas (Yellow): ${yellowCount} topics`, 20, yPosition);
  yPosition += 8;
  pdf.text(`Priority Areas (Red): ${redCount} topics`, 20, yPosition);
  yPosition += 20;

  // Category Analysis
  checkNewPage(50);
  pdf.setFontSize(18);
  pdf.setTextColor(33, 66, 99);
  pdf.text('Category Analysis', 20, yPosition);
  yPosition += 15;

  assessmentCategories.forEach(category => {
    checkNewPage(40);
    
    const categoryQuestions = assessmentQuestions.filter(q => q.category === category);
    const categoryScores = categoryQuestions.map(q => {
      const responseA = partnerA.responses.find(r => r.questionId === q.id);
      const responseB = partnerB.responses.find(r => r.questionId === q.id);
      
      if (responseA && responseB) {
        return getCompatibilityScore(responseA, responseB);
      }
      return null;
    }).filter(Boolean);

    const catGreen = categoryScores.filter(s => s === 'green').length;
    const catYellow = categoryScores.filter(s => s === 'yellow').length;
    const catRed = categoryScores.filter(s => s === 'red').length;

    const overallCatScore = catRed > 0 ? 'red' : catYellow > 0 ? 'yellow' : 'green';

    pdf.setFontSize(14);
    pdf.setTextColor(33, 66, 99);
    pdf.text(category, 20, yPosition);
    
    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0);
    pdf.text(`Status: ${getCompatibilityLabel(overallCatScore)}`, 130, yPosition);
    yPosition += 8;

    pdf.setFontSize(9);
    pdf.text(`Green: ${catGreen} | Yellow: ${catYellow} | Red: ${catRed}`, 25, yPosition);
    yPosition += 12;
  });

  // Detailed Question Analysis
  pdf.addPage();
  yPosition = 20;

  pdf.setFontSize(18);
  pdf.setTextColor(33, 66, 99);
  pdf.text('Detailed Question Analysis', 20, yPosition);
  yPosition += 15;

  assessmentQuestions.forEach(question => {
    checkNewPage(25);

    const responseA = partnerA.responses.find(r => r.questionId === question.id);
    const responseB = partnerB.responses.find(r => r.questionId === question.id);

    if (responseA && responseB) {
      const score = getCompatibilityScore(responseA, responseB);
      
      pdf.setFontSize(10);
      pdf.setTextColor(0, 0, 0);
      
      // Question text (truncated if too long)
      const questionText = question.question.length > 80 
        ? question.question.substring(0, 80) + '...' 
        : question.question;
      
      pdf.text(`Q${question.id}: ${questionText}`, 20, yPosition);
      yPosition += 6;

      // Partner responses
      pdf.setFontSize(8);
      pdf.text(`${partnerA.name}: Importance ${responseA.importance}, Flexibility ${responseA.flexibility}`, 25, yPosition);
      yPosition += 5;
      pdf.text(`${partnerB.name}: Importance ${responseB.importance}, Flexibility ${responseB.flexibility}`, 25, yPosition);
      yPosition += 5;

      // Compatibility status
      if (score === 'green') {
        pdf.setTextColor(0, 128, 0);
      } else if (score === 'yellow') {
        pdf.setTextColor(255, 165, 0);
      } else {
        pdf.setTextColor(255, 0, 0);
      }
      pdf.text(`Status: ${getCompatibilityLabel(score)}`, 25, yPosition);
      pdf.setTextColor(0, 0, 0);
      yPosition += 10;
    }
  });

  // Action Items Page
  pdf.addPage();
  yPosition = 20;

  pdf.setFontSize(18);
  pdf.setTextColor(33, 66, 99);
  pdf.text('Recommended Action Items', 20, yPosition);
  yPosition += 15;

  if (redCount > 0) {
    pdf.setFontSize(14);
    pdf.setTextColor(255, 0, 0);
    pdf.text('Priority Areas (Red) - Immediate Discussion Needed:', 20, yPosition);
    yPosition += 10;

    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0);
    const redQuestions = assessmentQuestions.filter(q => {
      const responseA = partnerA.responses.find(r => r.questionId === q.id);
      const responseB = partnerB.responses.find(r => r.questionId === q.id);
      return responseA && responseB && getCompatibilityScore(responseA, responseB) === 'red';
    });

    redQuestions.forEach(q => {
      checkNewPage(8);
      pdf.text(`• ${q.question}`, 25, yPosition);
      yPosition += 6;
    });
    yPosition += 10;
  }

  if (yellowCount > 0) {
    checkNewPage(20);
    pdf.setFontSize(14);
    pdf.setTextColor(255, 165, 0);
    pdf.text('Discussion Areas (Yellow) - Plan Together:', 20, yPosition);
    yPosition += 10;

    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0);
    pdf.text('Schedule time to discuss these topics and find mutually acceptable solutions.', 20, yPosition);
    yPosition += 10;
  }

  // Footer
  pdf.setFontSize(8);
  pdf.setTextColor(100, 100, 100);
  const footerText = 'Marriage Compatibility Master Assessment - For guidance purposes only';
  pdf.text(footerText, 20, pageHeight - 10);

  // Save the PDF
  pdf.save(`Marriage-Compatibility-Report-${partnerA.name}-${partnerB.name}.pdf`);
};

export const generateSinglePartnerPDF = (partner: PartnerData): void => {
  const pdf = new jsPDF();
  let yPosition = 20;
  const pageHeight = pdf.internal.pageSize.height;
  const margin = 20;

  // Helper function to check if we need a new page
  const checkNewPage = (additionalHeight: number) => {
    if (yPosition + additionalHeight > pageHeight - margin) {
      pdf.addPage();
      yPosition = 20;
    }
  };

  const qualityAnalysis = generateQualityOfLifeAnalysis(partner.responses);

  // Cover Page
  pdf.setFontSize(24);
  pdf.setTextColor(33, 66, 99); // Primary color
  pdf.text('Quality of Life Assessment Report', 20, yPosition);
  yPosition += 20;

  pdf.setFontSize(16);
  pdf.setTextColor(0, 0, 0);
  pdf.text(`${partner.name}`, 20, yPosition);
  yPosition += 10;

  pdf.setFontSize(12);
  pdf.setTextColor(100, 100, 100);
  pdf.text(`Generated: ${new Date().toLocaleDateString()}`, 20, yPosition);
  yPosition += 30;

  // Overall Score
  checkNewPage(50);
  pdf.setFontSize(18);
  pdf.setTextColor(33, 66, 99);
  pdf.text('Overall Life Readiness Score', 20, yPosition);
  yPosition += 15;

  pdf.setFontSize(32);
  pdf.setTextColor(0, 128, 0);
  pdf.text(`${Math.round(qualityAnalysis.overallScore * 20)}%`, 20, yPosition);
  yPosition += 20;

  // Personality Profile
  checkNewPage(40);
  pdf.setFontSize(16);
  pdf.setTextColor(33, 66, 99);
  pdf.text('Personality Profile', 20, yPosition);
  yPosition += 15;

  pdf.setFontSize(10);
  pdf.setTextColor(0, 0, 0);
  const profileLines = pdf.splitTextToSize(qualityAnalysis.personalityProfile, 170);
  profileLines.forEach((line: string) => {
    checkNewPage(8);
    pdf.text(line, 20, yPosition);
    yPosition += 6;
  });
  yPosition += 10;

  // Relationship Readiness
  checkNewPage(40);
  pdf.setFontSize(16);
  pdf.setTextColor(33, 66, 99);
  pdf.text('Relationship Readiness', 20, yPosition);
  yPosition += 15;

  pdf.setFontSize(10);
  pdf.setTextColor(0, 0, 0);
  const readinessLines = pdf.splitTextToSize(qualityAnalysis.relationshipReadiness, 170);
  readinessLines.forEach((line: string) => {
    checkNewPage(8);
    pdf.text(line, 20, yPosition);
    yPosition += 6;
  });
  yPosition += 10;

  // Strengths
  checkNewPage(40);
  pdf.setFontSize(16);
  pdf.setTextColor(0, 128, 0);
  pdf.text('Top Strengths', 20, yPosition);
  yPosition += 15;

  pdf.setFontSize(10);
  pdf.setTextColor(0, 0, 0);
  qualityAnalysis.strengths.forEach(strength => {
    checkNewPage(8);
    pdf.text(`• ${strength}`, 25, yPosition);
    yPosition += 6;
  });
  yPosition += 10;

  // Growth Areas
  checkNewPage(40);
  pdf.setFontSize(16);
  pdf.setTextColor(255, 165, 0);
  pdf.text('Growth Areas', 20, yPosition);
  yPosition += 15;

  pdf.setFontSize(10);
  pdf.setTextColor(0, 0, 0);
  qualityAnalysis.growthAreas.forEach(area => {
    checkNewPage(8);
    pdf.text(`• ${area}`, 25, yPosition);
    yPosition += 6;
  });
  yPosition += 15;

  // Category Analysis
  checkNewPage(50);
  pdf.setFontSize(18);
  pdf.setTextColor(33, 66, 99);
  pdf.text('Detailed Category Analysis', 20, yPosition);
  yPosition += 15;

  qualityAnalysis.categoryInsights.forEach(insight => {
    checkNewPage(30);
    
    pdf.setFontSize(14);
    pdf.setTextColor(33, 66, 99);
    pdf.text(insight.category, 20, yPosition);
    
    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0);
    pdf.text(`Score: ${Math.round(insight.score * 20)}% (${insight.level})`, 130, yPosition);
    yPosition += 10;

    // Insights
    insight.insights.forEach(insightText => {
      checkNewPage(8);
      const lines = pdf.splitTextToSize(`• ${insightText}`, 170);
      lines.forEach((line: string) => {
        pdf.text(line, 25, yPosition);
        yPosition += 6;
      });
    });

    // Recommendations
    insight.recommendations.forEach(recommendation => {
      checkNewPage(8);
      const lines = pdf.splitTextToSize(`→ ${recommendation}`, 170);
      lines.forEach((line: string) => {
        pdf.text(line, 25, yPosition);
        yPosition += 6;
      });
    });
    
    yPosition += 10;
  });

  // Footer
  pdf.setFontSize(8);
  pdf.setTextColor(100, 100, 100);
  const footerText = 'Marriage Compatibility Master Assessment - Quality of Life Report';
  pdf.text(footerText, 20, pageHeight - 10);

  // Save the PDF
  pdf.save(`Quality-of-Life-Report-${partner.name}.pdf`);
};