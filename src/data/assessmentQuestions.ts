export interface Question {
  id: number;
  category: string;
  question: string;
  explanation?: string;
}

export const assessmentCategories = [
  "Core Values & Ethics",
  "Religion", 
  "Spirituality",
  "Relationship Model & Boundaries",
  "Life Vision & Home",
  "Children & Parenting",
  "Finances",
  "Work & Career", 
  "Household & Roles",
  "Communication & Conflict",
  "Love, Intimacy & Sex",
  "Health & Lifestyle",
  "Family of Origin & In-Laws",
  "Growth & Change"
];

export const assessmentQuestions: Question[] = [
  // Core Values & Ethics (1-10)
  { id: 1, category: "Core Values & Ethics", question: "Honesty and transparency in all aspects of our relationship", explanation: "Including financial decisions, past relationships, and daily interactions" },
  { id: 2, category: "Core Values & Ethics", question: "Commitment to personal integrity and ethical behavior", explanation: "Acting according to moral principles even when it's difficult" },
  { id: 3, category: "Core Values & Ethics", question: "Loyalty and faithfulness to each other", explanation: "Emotional and physical fidelity, prioritizing the relationship" },
  { id: 4, category: "Core Values & Ethics", question: "Mutual respect for each other's opinions and decisions", explanation: "Valuing different perspectives and treating each other with dignity" },
  { id: 5, category: "Core Values & Ethics", question: "Shared approach to helping others and community service", explanation: "Volunteering, charitable giving, and social responsibility" },
  { id: 6, category: "Core Values & Ethics", question: "Similar views on justice, fairness, and equality", explanation: "How we treat others and expect to be treated" },
  { id: 7, category: "Core Values & Ethics", question: "Agreement on work-life balance priorities", explanation: "Balancing career ambitions with personal and family time" },
  { id: 8, category: "Core Values & Ethics", question: "Shared environmental and sustainability values", explanation: "Approach to consumption, conservation, and environmental responsibility" },
  { id: 9, category: "Core Values & Ethics", question: "Similar political and social justice perspectives", explanation: "Views on government, social issues, and civic engagement" },
  { id: 10, category: "Core Values & Ethics", question: "Agreement on material possessions and lifestyle choices", explanation: "Attitudes toward wealth, luxury, and simple living" },

  // Religion (11-15)
  { id: 11, category: "Religion", question: "Shared religious beliefs and practices", explanation: "Same faith tradition, church attendance, and religious observance" },
  { id: 12, category: "Religion", question: "Agreement on the role of religion in daily life", explanation: "Prayer, religious study, and faith-based decision making" },
  { id: 13, category: "Religion", question: "Religious ceremonies and holiday observances", explanation: "How we celebrate religious holidays and participate in traditions" },
  { id: 14, category: "Religion", question: "Religious community involvement and leadership", explanation: "Active participation in religious organizations and serving others" },
  { id: 15, category: "Religion", question: "Interfaith relationships and acceptance of religious differences", explanation: "Respect for different beliefs and handling religious diversity" },

  // Spirituality (16-20)
  { id: 16, category: "Spirituality", question: "Personal spiritual growth and development", explanation: "Individual spiritual practices and seeking meaning" },
  { id: 17, category: "Spirituality", question: "Meditation, prayer, or other spiritual practices", explanation: "Regular spiritual disciplines and contemplative practices" },
  { id: 18, category: "Spirituality", question: "Belief in purpose and meaning beyond material success", explanation: "Values that transcend wealth and worldly achievements" },
  { id: 19, category: "Spirituality", question: "Openness to different spiritual perspectives and practices", explanation: "Exploring various spiritual traditions and philosophies" },
  { id: 20, category: "Spirituality", question: "Integration of spiritual values into everyday decisions", explanation: "Letting spiritual principles guide major life choices" },

  // Relationship Model & Boundaries (21-25)
  { id: 21, category: "Relationship Model & Boundaries", question: "Expectations of exclusivity and monogamy", explanation: "Clear boundaries around romantic and sexual relationships with others" },
  { id: 22, category: "Relationship Model & Boundaries", question: "Boundaries with friends of the opposite sex", explanation: "Appropriate friendships and social interactions outside the relationship" },
  { id: 23, category: "Relationship Model & Boundaries", question: "Social media and online relationship boundaries", explanation: "Appropriate online behavior and digital communication with others" },
  { id: 24, category: "Relationship Model & Boundaries", question: "Individual time and space within the relationship", explanation: "Personal hobbies, alone time, and maintaining individual identity" },
  { id: 25, category: "Relationship Model & Boundaries", question: "Sharing personal information and maintaining privacy", explanation: "What to keep private vs. what to share with each other" },

  // Life Vision & Home (26-30)
  { id: 26, category: "Life Vision & Home", question: "Where we want to live (city, suburb, rural, etc.)", explanation: "Geographic preferences and lifestyle setting" },
  { id: 27, category: "Life Vision & Home", question: "Type of home and living arrangements we prefer", explanation: "House size, style, renting vs. owning, and home features" },
  { id: 28, category: "Life Vision & Home", question: "Long-term life goals and dreams we want to pursue together", explanation: "Major life aspirations and shared vision for the future" },
  { id: 29, category: "Life Vision & Home", question: "Travel and adventure priorities", explanation: "How much and what type of travel we want to do together" },
  { id: 30, category: "Life Vision & Home", question: "Retirement planning and later life vision", explanation: "How we want to spend our golden years together" },

  // Children & Parenting (31-40)
  { id: 31, category: "Children & Parenting", question: "Whether or not to have children", explanation: "Fundamental agreement on becoming parents" },
  { id: 32, category: "Children & Parenting", question: "How many children we want", explanation: "Desired family size and spacing between children" },
  { id: 33, category: "Children & Parenting", question: "Timeline for having children", explanation: "When to start trying and family planning considerations" },
  { id: 34, category: "Children & Parenting", question: "Parenting philosophy and discipline approaches", explanation: "How to raise, guide, and correct children's behavior" },
  { id: 35, category: "Children & Parenting", question: "Educational choices for our children", explanation: "Public school, private school, homeschooling, or other options" },
  { id: 36, category: "Children & Parenting", question: "Religious and moral education of our children", explanation: "What values and beliefs to teach our children" },
  { id: 37, category: "Children & Parenting", question: "Childcare arrangements and work-family balance", explanation: "Who stays home, daycare options, and managing career with kids" },
  { id: 38, category: "Children & Parenting", question: "Special needs support and advocacy", explanation: "How we would handle children with disabilities or special requirements" },
  { id: 39, category: "Children & Parenting", question: "Adoption, fostering, or alternative paths to parenthood", explanation: "Openness to different ways of building our family" },
  { id: 40, category: "Children & Parenting", question: "Extended family involvement in child-rearing", explanation: "Role of grandparents and relatives in our children's lives" },

  // Finances (41-50)
  { id: 41, category: "Finances", question: "How we manage money and make financial decisions together", explanation: "Joint accounts, individual accounts, and decision-making process" },
  { id: 42, category: "Finances", question: "Budgeting and spending priorities", explanation: "How we allocate money for necessities, wants, and savings" },
  { id: 43, category: "Finances", question: "Saving and investment strategies", explanation: "Retirement planning, emergency funds, and investment approaches" },
  { id: 44, category: "Finances", question: "Debt management and financial obligations", explanation: "How we handle existing debt and avoid future financial problems" },
  { id: 45, category: "Finances", question: "Major purchase decisions and financial goals", explanation: "Buying cars, homes, and other significant financial commitments" },
  { id: 46, category: "Finances", question: "Financial support for family members", explanation: "Helping parents, siblings, or other relatives financially" },
  { id: 47, category: "Finances", question: "Charitable giving and financial generosity", explanation: "How much to give to charity and support causes we care about" },
  { id: 48, category: "Finances", question: "Financial transparency and honesty", explanation: "Sharing all financial information and being open about money matters" },
  { id: 49, category: "Finances", question: "Risk tolerance in investments and financial planning", explanation: "Conservative vs. aggressive investment strategies and financial risks" },
  { id: 50, category: "Finances", question: "Financial preparation for emergencies and unexpected events", explanation: "Insurance, emergency funds, and financial safety nets" },

  // Work & Career (51-60)
  { id: 51, category: "Work & Career", question: "Career ambitions and professional goals", explanation: "Individual career paths and supporting each other's professional growth" },
  { id: 52, category: "Work & Career", question: "Work-life balance and time commitments", explanation: "How much time to dedicate to work vs. family and personal life" },
  { id: 53, category: "Work & Career", question: "Relocating for career opportunities", explanation: "Willingness to move for job advancement or career changes" },
  { id: 54, category: "Work & Career", question: "Supporting each other's career development", explanation: "Education, training, and professional networking support" },
  { id: 55, category: "Work & Career", question: "Managing career changes and job transitions", explanation: "How we handle unemployment, career switches, or new opportunities" },
  { id: 56, category: "Work & Career", question: "Entrepreneurship and business ventures", explanation: "Starting businesses, financial risks, and time investments in ventures" },
  { id: 57, category: "Work & Career", question: "Professional networking and business relationships", explanation: "Work social events, professional associations, and business friendships" },
  { id: 58, category: "Work & Career", question: "Continuing education and professional development", explanation: "Ongoing learning, degrees, certifications, and skill development" },
  { id: 59, category: "Work & Career", question: "Retirement timeline and career wind-down", explanation: "When and how we want to retire from our careers" },
  { id: 60, category: "Work & Career", question: "Balancing two careers and mutual support", explanation: "Prioritizing when career conflicts arise and supporting each other" },

  // Household & Roles (61-65)
  { id: 61, category: "Household & Roles", question: "Division of household chores and responsibilities", explanation: "Who does what around the house and how we maintain our home" },
  { id: 62, category: "Household & Roles", question: "Cooking, meal planning, and food responsibilities", explanation: "Who cooks, shops for food, and manages meal preparation" },
  { id: 63, category: "Household & Roles", question: "Home maintenance, repairs, and improvements", explanation: "Who handles home repairs, yard work, and home improvement projects" },
  { id: 64, category: "Household & Roles", question: "Management of household finances and bills", explanation: "Who pays bills, manages accounts, and handles financial administration" },
  { id: 65, category: "Household & Roles", question: "Traditional vs. egalitarian role expectations", explanation: "How we view gender roles and division of responsibilities" },

  // Communication & Conflict (66-70)
  { id: 66, category: "Communication & Conflict", question: "How we handle disagreements and resolve conflicts", explanation: "Our approach to arguing, finding solutions, and making peace" },
  { id: 67, category: "Communication & Conflict", question: "Communication styles and emotional expression", explanation: "How we share feelings, discuss problems, and express love" },
  { id: 68, category: "Communication & Conflict", question: "Decision-making processes for major choices", explanation: "How we make big decisions together and handle disagreements" },
  { id: 69, category: "Communication & Conflict", question: "Seeking outside help for relationship issues", explanation: "Willingness to go to counseling, therapy, or ask for help" },
  { id: 70, category: "Communication & Conflict", question: "Managing stress and supporting each other emotionally", explanation: "How we help each other through difficult times and stress" },

  // Love, Intimacy & Sex (71-76)
  { id: 71, category: "Love, Intimacy & Sex", question: "Physical affection and intimacy expectations", explanation: "Frequency and type of physical affection and sexual intimacy" },
  { id: 72, category: "Love, Intimacy & Sex", question: "Sexual compatibility and openness to discuss needs", explanation: "Ability to communicate about sex and meet each other's needs" },
  { id: 73, category: "Love, Intimacy & Sex", question: "Emotional intimacy and vulnerability with each other", explanation: "Sharing deep feelings, fears, and being emotionally open" },
  { id: 74, category: "Love, Intimacy & Sex", question: "Romance, dating, and keeping the spark alive", explanation: "Ongoing courtship, romantic gestures, and relationship maintenance" },
  { id: 75, category: "Love, Intimacy & Sex", question: "Boundaries and comfort levels with physical intimacy", explanation: "What we're comfortable with and personal boundaries around intimacy" },
  { id: 76, category: "Love, Intimacy & Sex", question: "Addressing changes in physical intimacy over time", explanation: "How we handle changes due to age, health, or life circumstances" },

  // Health & Lifestyle (77-81)
  { id: 77, category: "Health & Lifestyle", question: "Health and fitness priorities and activities", explanation: "Exercise routines, diet choices, and maintaining physical health" },
  { id: 78, category: "Health & Lifestyle", question: "Approach to medical care and health decisions", explanation: "Healthcare choices, medical treatments, and health philosophy" },
  { id: 79, category: "Health & Lifestyle", question: "Mental health awareness and support", explanation: "Handling depression, anxiety, therapy, and emotional wellbeing" },
  { id: 80, category: "Health & Lifestyle", question: "Substance use (alcohol, etc.) and related boundaries", explanation: "Drinking habits, drug use, and what we're comfortable with" },
  { id: 81, category: "Health & Lifestyle", question: "Aging gracefully and supporting each other through health changes", explanation: "How we'll care for each other as we age and face health challenges" },

  // Family of Origin & In-Laws (82-85)
  { id: 82, category: "Family of Origin & In-Laws", question: "Relationships with our parents and extended family", explanation: "How close we are to family and how much time we spend with them" },
  { id: 83, category: "Family of Origin & In-Laws", question: "Setting boundaries with family members", explanation: "Managing family interference and maintaining our independence as a couple" },
  { id: 84, category: "Family of Origin & In-Laws", question: "Holiday traditions and family obligations", explanation: "Which family events to attend and how to balance family expectations" },
  { id: 85, category: "Family of Origin & In-Laws", question: "Caring for aging parents and family responsibilities", explanation: "Future caregiving responsibilities and supporting our parents as they age" },

  // Growth & Change (86)
  { id: 86, category: "Growth & Change", question: "Supporting each other's personal growth and change over time", explanation: "Accepting that we both will grow and change throughout our marriage" }
];

export const importanceLabels = [
  "Not important to me",
  "Slightly important", 
  "Moderately important",
  "Very important",
  "Extremely important"
];

export const flexibilityLabels = [
  "Very flexible",
  "Quite flexible",
  "Neutral", 
  "Limited flexibility",
  "Non-negotiable"
];