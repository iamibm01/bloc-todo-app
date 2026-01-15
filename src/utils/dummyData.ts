import { v4 as uuidv4 } from 'uuid';
import { Project, Task, TaskStatus, TaskPriority } from '@/types';
import { PROJECT_COLORS } from '@/constants';

// ==========================================
// SAMPLE PROJECT DATA
// ==========================================

const projectTemplates = [
  {
    name: 'Website Redesign',
    description: 'Complete overhaul of company website with modern design',
    color: PROJECT_COLORS[0],
  },
  {
    name: 'Mobile App Development',
    description: 'Build native iOS and Android applications',
    color: PROJECT_COLORS[1],
  },
  {
    name: 'Marketing Campaign Q2',
    description: 'Social media and content marketing initiatives',
    color: PROJECT_COLORS[2],
  },
  {
    name: 'Customer Portal',
    description: 'Self-service portal for customers to manage accounts',
    color: PROJECT_COLORS[3],
  },
  {
    name: 'Internal Tools',
    description: 'Automation and productivity tools for team',
    color: PROJECT_COLORS[4],
  },
];

// ==========================================
// SAMPLE TASK DATA
// ==========================================

const taskTemplates = {
  'Website Redesign': [
    // Brainstorm
    {
      title: 'Research competitor websites',
      description: 'Analyze top 10 competitors for design inspiration and feature comparison. Focus on UX patterns and visual aesthetics.',
      status: 'brainstorm' as TaskStatus,
      priority: 'medium' as TaskPriority,
      tags: ['research', 'design'],
      daysFromNow: 7,
    },
    {
      title: 'Explore new color schemes',
      description: 'Create mood boards with potential color palettes. Consider accessibility and brand guidelines.',
      status: 'brainstorm' as TaskStatus,
      priority: 'low' as TaskPriority,
      tags: ['design', 'branding'],
      daysFromNow: 10,
    },
    {
      title: 'Animation ideas for hero section',
      description: 'Brainstorm engaging animations and transitions for landing page hero section.',
      status: 'brainstorm' as TaskStatus,
      priority: 'low' as TaskPriority,
      tags: ['animation', 'design'],
      daysFromNow: 14,
    },
    // To Do
    {
      title: 'Design homepage mockup',
      description: 'Create high-fidelity mockup for homepage including hero section, features, and testimonials.',
      status: 'todo' as TaskStatus,
      priority: 'high' as TaskPriority,
      tags: ['design', 'figma'],
      daysFromNow: 5,
    },
    {
      title: 'Set up development environment',
      description: 'Configure Next.js project with TypeScript, Tailwind CSS, and deployment pipeline.',
      status: 'todo' as TaskStatus,
      priority: 'high' as TaskPriority,
      tags: ['dev', 'setup'],
      daysFromNow: 3,
    },
    {
      title: 'Create component library',
      description: 'Build reusable components for buttons, cards, forms, and navigation elements.',
      status: 'todo' as TaskStatus,
      priority: 'medium' as TaskPriority,
      tags: ['dev', 'components'],
      daysFromNow: 8,
    },
    // In Progress
    {
      title: 'Implement responsive navigation',
      description: 'Build mobile-friendly navigation with hamburger menu and smooth transitions.',
      status: 'inProgress' as TaskStatus,
      priority: 'high' as TaskPriority,
      tags: ['dev', 'mobile'],
      daysFromNow: 2,
    },
    {
      title: 'Optimize images and assets',
      description: 'Compress and convert images to WebP format. Implement lazy loading for better performance.',
      status: 'inProgress' as TaskStatus,
      priority: 'medium' as TaskPriority,
      tags: ['optimization', 'performance'],
      daysFromNow: 4,
    },
    // Done
    {
      title: 'Stakeholder kickoff meeting',
      description: 'Present project timeline and gather requirements from all stakeholders.',
      status: 'done' as TaskStatus,
      priority: 'high' as TaskPriority,
      tags: ['meeting', 'planning'],
      daysFromNow: -5,
    },
    {
      title: 'Conduct user research',
      description: 'Interview 15 users about current website pain points and desired improvements.',
      status: 'done' as TaskStatus,
      priority: 'high' as TaskPriority,
      tags: ['research', 'ux'],
      daysFromNow: -3,
    },
  ],
  'Mobile App Development': [
    // Brainstorm
    {
      title: 'Push notification strategy',
      description: 'Plan notification types and frequency to maximize engagement without annoying users.',
      status: 'brainstorm' as TaskStatus,
      priority: 'medium' as TaskPriority,
      tags: ['product', 'notifications'],
      daysFromNow: 12,
    },
    {
      title: 'Offline mode capabilities',
      description: 'Research which features should work offline and data sync strategies.',
      status: 'brainstorm' as TaskStatus,
      priority: 'low' as TaskPriority,
      tags: ['technical', 'sync'],
      daysFromNow: 20,
    },
    // To Do
    {
      title: 'Design app icon and splash screen',
      description: 'Create app icon in multiple sizes and animated splash screen for iOS and Android.',
      status: 'todo' as TaskStatus,
      priority: 'medium' as TaskPriority,
      tags: ['design', 'branding'],
      daysFromNow: 6,
    },
    {
      title: 'Set up Firebase backend',
      description: 'Configure Firebase for authentication, database, and cloud functions.',
      status: 'todo' as TaskStatus,
      priority: 'high' as TaskPriority,
      tags: ['backend', 'firebase'],
      daysFromNow: 4,
    },
    {
      title: 'Implement biometric authentication',
      description: 'Add Face ID and fingerprint login options for both platforms.',
      status: 'todo' as TaskStatus,
      priority: 'high' as TaskPriority,
      tags: ['security', 'auth'],
      daysFromNow: 7,
    },
    // In Progress
    {
      title: 'Build user profile screen',
      description: 'Create profile page with avatar upload, settings, and account management.',
      status: 'inProgress' as TaskStatus,
      priority: 'medium' as TaskPriority,
      tags: ['dev', 'ui'],
      daysFromNow: 3,
    },
    {
      title: 'Integrate payment gateway',
      description: 'Implement Stripe payment processing for in-app purchases and subscriptions.',
      status: 'inProgress' as TaskStatus,
      priority: 'high' as TaskPriority,
      tags: ['payments', 'integration'],
      daysFromNow: 5,
    },
    {
      title: 'Write unit tests for core features',
      description: 'Achieve 80% code coverage with Jest and React Native Testing Library.',
      status: 'inProgress' as TaskStatus,
      priority: 'medium' as TaskPriority,
      tags: ['testing', 'quality'],
      daysFromNow: 8,
    },
    // Done
    {
      title: 'Choose tech stack',
      description: 'Decided on React Native with Expo for cross-platform development.',
      status: 'done' as TaskStatus,
      priority: 'high' as TaskPriority,
      tags: ['planning', 'technical'],
      daysFromNow: -10,
    },
    {
      title: 'Create wireframes',
      description: 'Low-fidelity wireframes for all main screens approved by team.',
      status: 'done' as TaskStatus,
      priority: 'high' as TaskPriority,
      tags: ['design', 'wireframes'],
      daysFromNow: -7,
    },
  ],
  'Marketing Campaign Q2': [
    // Brainstorm
    {
      title: 'Influencer partnership ideas',
      description: 'Brainstorm potential influencers in our niche for collaboration campaigns.',
      status: 'brainstorm' as TaskStatus,
      priority: 'medium' as TaskPriority,
      tags: ['influencer', 'partnerships'],
      daysFromNow: 15,
    },
    {
      title: 'Video content themes',
      description: 'Generate ideas for engaging video series and short-form content.',
      status: 'brainstorm' as TaskStatus,
      priority: 'low' as TaskPriority,
      tags: ['video', 'content'],
      daysFromNow: 18,
    },
    {
      title: 'Webinar topics',
      description: 'List potential webinar topics that would attract our target audience.',
      status: 'brainstorm' as TaskStatus,
      priority: 'low' as TaskPriority,
      tags: ['webinar', 'education'],
      daysFromNow: 25,
    },
    // To Do
    {
      title: 'Design social media templates',
      description: 'Create branded templates for Instagram, Twitter, and LinkedIn posts.',
      status: 'todo' as TaskStatus,
      priority: 'high' as TaskPriority,
      tags: ['design', 'social-media'],
      daysFromNow: 4,
    },
    {
      title: 'Write blog post series',
      description: 'Draft 8 blog posts on industry trends and best practices.',
      status: 'todo' as TaskStatus,
      priority: 'medium' as TaskPriority,
      tags: ['content', 'seo'],
      daysFromNow: 10,
    },
    {
      title: 'Set up email automation',
      description: 'Configure drip campaigns and newsletter sequences in Mailchimp.',
      status: 'todo' as TaskStatus,
      priority: 'high' as TaskPriority,
      tags: ['email', 'automation'],
      daysFromNow: 5,
    },
    // In Progress
    {
      title: 'Launch Instagram ad campaign',
      description: 'Create and launch targeted Instagram ads with A/B testing for creative variations.',
      status: 'inProgress' as TaskStatus,
      priority: 'high' as TaskPriority,
      tags: ['ads', 'social-media'],
      daysFromNow: 2,
    },
    {
      title: 'Produce brand video',
      description: 'Film and edit 2-minute brand story video for homepage and social media.',
      status: 'inProgress' as TaskStatus,
      priority: 'medium' as TaskPriority,
      tags: ['video', 'production'],
      daysFromNow: 6,
    },
    // Done
    {
      title: 'Q2 marketing strategy document',
      description: 'Comprehensive strategy document approved by leadership team.',
      status: 'done' as TaskStatus,
      priority: 'high' as TaskPriority,
      tags: ['strategy', 'planning'],
      daysFromNow: -12,
    },
    {
      title: 'Competitor analysis',
      description: 'Analyzed marketing strategies of top 5 competitors.',
      status: 'done' as TaskStatus,
      priority: 'medium' as TaskPriority,
      tags: ['research', 'competitive'],
      daysFromNow: -8,
    },
  ],
  'Customer Portal': [
    // Brainstorm
    {
      title: 'AI chatbot integration',
      description: 'Explore AI-powered chatbot to handle common customer queries automatically.',
      status: 'brainstorm' as TaskStatus,
      priority: 'low' as TaskPriority,
      tags: ['ai', 'support'],
      daysFromNow: 30,
    },
    {
      title: 'Gamification features',
      description: 'Consider adding points, badges, and rewards for portal engagement.',
      status: 'brainstorm' as TaskStatus,
      priority: 'low' as TaskPriority,
      tags: ['engagement', 'ux'],
      daysFromNow: 35,
    },
    // To Do
    {
      title: 'Design dashboard layout',
      description: 'Create user-friendly dashboard showing account overview and quick actions.',
      status: 'todo' as TaskStatus,
      priority: 'high' as TaskPriority,
      tags: ['design', 'dashboard'],
      daysFromNow: 3,
    },
    {
      title: 'Build authentication system',
      description: 'Implement secure login with OAuth, 2FA, and password recovery.',
      status: 'todo' as TaskStatus,
      priority: 'high' as TaskPriority,
      tags: ['auth', 'security'],
      daysFromNow: 5,
    },
    {
      title: 'Create invoice download feature',
      description: 'Allow users to view, download, and email past invoices in PDF format.',
      status: 'todo' as TaskStatus,
      priority: 'medium' as TaskPriority,
      tags: ['billing', 'pdf'],
      daysFromNow: 9,
    },
    {
      title: 'Integrate support ticket system',
      description: 'Add ability to create, track, and respond to support tickets within portal.',
      status: 'todo' as TaskStatus,
      priority: 'medium' as TaskPriority,
      tags: ['support', 'integration'],
      daysFromNow: 12,
    },
    // In Progress
    {
      title: 'Implement account settings page',
      description: 'Build comprehensive settings page for profile, preferences, and notifications.',
      status: 'inProgress' as TaskStatus,
      priority: 'medium' as TaskPriority,
      tags: ['dev', 'settings'],
      daysFromNow: 4,
    },
    {
      title: 'Set up database schema',
      description: 'Design and implement PostgreSQL schema for user data and relationships.',
      status: 'inProgress' as TaskStatus,
      priority: 'high' as TaskPriority,
      tags: ['database', 'backend'],
      daysFromNow: 3,
    },
    // Done
    {
      title: 'Requirements gathering workshop',
      description: 'Workshop with customer success team to define portal features and priorities.',
      status: 'done' as TaskStatus,
      priority: 'high' as TaskPriority,
      tags: ['planning', 'workshop'],
      daysFromNow: -15,
    },
    {
      title: 'User journey mapping',
      description: 'Mapped out customer journey through portal for different use cases.',
      status: 'done' as TaskStatus,
      priority: 'high' as TaskPriority,
      tags: ['ux', 'planning'],
      daysFromNow: -10,
    },
  ],
  'Internal Tools': [
    // Brainstorm
    {
      title: 'Automated report generator',
      description: 'Build tool to auto-generate weekly reports from various data sources.',
      status: 'brainstorm' as TaskStatus,
      priority: 'medium' as TaskPriority,
      tags: ['automation', 'reporting'],
      daysFromNow: 20,
    },
    {
      title: 'Slack bot for team updates',
      description: 'Create Slack bot to post automated updates and reminders to team channels.',
      status: 'brainstorm' as TaskStatus,
      priority: 'low' as TaskPriority,
      tags: ['slack', 'bot'],
      daysFromNow: 25,
    },
    // To Do
    {
      title: 'Build time tracking widget',
      description: 'Create simple time tracking tool integrated with project management system.',
      status: 'todo' as TaskStatus,
      priority: 'high' as TaskPriority,
      tags: ['productivity', 'tracking'],
      daysFromNow: 6,
    },
    {
      title: 'Design admin dashboard',
      description: 'Dashboard for admins to manage users, permissions, and system settings.',
      status: 'todo' as TaskStatus,
      priority: 'medium' as TaskPriority,
      tags: ['design', 'admin'],
      daysFromNow: 8,
    },
    {
      title: 'Create API documentation',
      description: 'Write comprehensive API docs with examples and interactive playground.',
      status: 'todo' as TaskStatus,
      priority: 'medium' as TaskPriority,
      tags: ['docs', 'api'],
      daysFromNow: 11,
    },
    // In Progress
    {
      title: 'Implement CI/CD pipeline',
      description: 'Set up automated testing and deployment with GitHub Actions.',
      status: 'inProgress' as TaskStatus,
      priority: 'high' as TaskPriority,
      tags: ['devops', 'automation'],
      daysFromNow: 2,
    },
    {
      title: 'Build expense tracking tool',
      description: 'Tool for employees to submit and track expense reimbursements.',
      status: 'inProgress' as TaskStatus,
      priority: 'medium' as TaskPriority,
      tags: ['finance', 'tools'],
      daysFromNow: 7,
    },
    // Done
    {
      title: 'Audit existing tools',
      description: 'Reviewed all internal tools to identify gaps and improvement opportunities.',
      status: 'done' as TaskStatus,
      priority: 'high' as TaskPriority,
      tags: ['audit', 'planning'],
      daysFromNow: -8,
    },
    {
      title: 'Set up project repository',
      description: 'Created monorepo structure with proper tooling and documentation.',
      status: 'done' as TaskStatus,
      priority: 'high' as TaskPriority,
      tags: ['setup', 'dev'],
      daysFromNow: -5,
    },
  ],
};

// ==========================================
// GENERATE DUMMY DATA
// ==========================================

export const generateDummyData = () => {
  const now = new Date();
  
  // Generate projects
  const projects: Project[] = projectTemplates.map((template) => ({
    id: uuidv4(),
    name: template.name,
    description: template.description,
    color: template.color,
    createdAt: new Date(now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date in last 30 days
    updatedAt: now,
    isArchived: false,
  }));

  // Generate tasks for each project
  const tasks: Task[] = [];
  
  projects.forEach((project) => {
    const projectTasks = taskTemplates[project.name as keyof typeof taskTemplates] || [];
    
    projectTasks.forEach((template) => {
      const createdAt = new Date(now.getTime() - Math.random() * 20 * 24 * 60 * 60 * 1000); // Random date in last 20 days
      const dueDate = template.daysFromNow 
        ? new Date(now.getTime() + template.daysFromNow * 24 * 60 * 60 * 1000)
        : undefined;

      tasks.push({
        id: uuidv4(),
        title: template.title,
        description: template.description,
        projectId: project.id,
        status: template.status,
        priority: template.priority,
        tags: template.tags,
        dueDate,
        createdAt,
        updatedAt: createdAt,
        completedAt: template.status === 'done' ? createdAt : undefined,
        order: tasks.length,
        isArchived: false,
      });
    });
  });

  return { projects, tasks };
};