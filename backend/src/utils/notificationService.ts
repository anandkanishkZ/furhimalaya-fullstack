import { prisma } from './prisma';

/**
 * Notification Service
 * Centralized service for creating and managing notifications
 */

export enum NotificationType {
  INFO = 'INFO',
  SUCCESS = 'SUCCESS',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
}

export enum NotificationCategory {
  CONTACT = 'CONTACT',
  PROJECT = 'PROJECT',
  SERVICE = 'SERVICE',
  BLOG = 'BLOG',
  TESTIMONIAL = 'TESTIMONIAL',
  TEAM = 'TEAM',
  SYSTEM = 'SYSTEM',
  USER = 'USER',
}

interface CreateNotificationParams {
  userId: string;
  title: string;
  message: string;
  type?: NotificationType;
  category?: NotificationCategory;
  actionUrl?: string;
  actionLabel?: string;
  metadata?: any;
}

/**
 * Create a new notification
 */
export const createNotification = async ({
  userId,
  title,
  message,
  type = NotificationType.INFO,
  category = NotificationCategory.SYSTEM,
  actionUrl,
  actionLabel,
  metadata,
}: CreateNotificationParams) => {
  try {
    const notification = await prisma.notification.create({
      data: {
        userId,
        title,
        message,
        type,
        category,
        actionUrl,
        actionLabel,
        metadata: metadata ? JSON.stringify(metadata) : undefined,
        isRead: false,
      },
    });
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

/**
 * Get admin user ID (for sending notifications to admin)
 */
export const getAdminUserId = async (): Promise<string | null> => {
  try {
    const adminUser = await prisma.user.findFirst({
      where: { role: 'SUPER_ADMIN' },
      select: { id: true },
    });
    return adminUser?.id || null;
  } catch (error) {
    console.error('Error getting admin user:', error);
    return null;
  }
};

/**
 * Contact Form Notifications
 */
export const notifyNewContactSubmission = async (contactData: {
  name: string;
  email: string;
  subject?: string;
  id: string;
}) => {
  const adminId = await getAdminUserId();
  if (!adminId) return null;

  return createNotification({
    userId: adminId,
    title: 'New Contact Message',
    message: `You have received a new message from ${contactData.name} (${contactData.email})${contactData.subject ? ` regarding "${contactData.subject}"` : ''}.`,
    type: NotificationType.INFO,
    category: NotificationCategory.CONTACT,
    actionUrl: '/admin/contact',
    actionLabel: 'View Messages',
    metadata: {
      contactId: contactData.id,
      name: contactData.name,
      email: contactData.email,
    },
  });
};

/**
 * Project Notifications
 */
export const notifyNewProject = async (projectData: {
  title: string;
  id: string;
  createdById?: string;
}) => {
  const adminId = await getAdminUserId();
  if (!adminId) return null;

  return createNotification({
    userId: adminId,
    title: 'New Project Added',
    message: `A new project "${projectData.title}" has been created.`,
    type: NotificationType.SUCCESS,
    category: NotificationCategory.PROJECT,
    actionUrl: `/admin/projects`,
    actionLabel: 'View Project',
    metadata: {
      projectId: projectData.id,
      title: projectData.title,
    },
  });
};

export const notifyProjectUpdated = async (projectData: {
  title: string;
  id: string;
  changes?: string[];
}) => {
  const adminId = await getAdminUserId();
  if (!adminId) return null;

  return createNotification({
    userId: adminId,
    title: 'Project Updated',
    message: `Project "${projectData.title}" has been updated.`,
    type: NotificationType.INFO,
    category: NotificationCategory.PROJECT,
    actionUrl: `/admin/projects`,
    actionLabel: 'View Changes',
    metadata: {
      projectId: projectData.id,
      title: projectData.title,
      changes: projectData.changes,
    },
  });
};

export const notifyProjectStatusChanged = async (projectData: {
  title: string;
  id: string;
  oldStatus: string;
  newStatus: string;
}) => {
  const adminId = await getAdminUserId();
  if (!adminId) return null;

  return createNotification({
    userId: adminId,
    title: 'Project Status Changed',
    message: `Project "${projectData.title}" status changed from ${projectData.oldStatus} to ${projectData.newStatus}.`,
    type: NotificationType.WARNING,
    category: NotificationCategory.PROJECT,
    actionUrl: `/admin/projects`,
    actionLabel: 'View Project',
    metadata: {
      projectId: projectData.id,
      title: projectData.title,
      oldStatus: projectData.oldStatus,
      newStatus: projectData.newStatus,
    },
  });
};

/**
 * Service Notifications
 */
export const notifyNewService = async (serviceData: {
  title: string;
  id: string;
}) => {
  const adminId = await getAdminUserId();
  if (!adminId) return null;

  return createNotification({
    userId: adminId,
    title: 'New Service Added',
    message: `A new service "${serviceData.title}" has been created.`,
    type: NotificationType.SUCCESS,
    category: NotificationCategory.SERVICE,
    actionUrl: '/admin/services',
    actionLabel: 'View Service',
    metadata: {
      serviceId: serviceData.id,
      title: serviceData.title,
    },
  });
};

export const notifyServiceUpdated = async (serviceData: {
  title: string;
  id: string;
}) => {
  const adminId = await getAdminUserId();
  if (!adminId) return null;

  return createNotification({
    userId: adminId,
    title: 'Service Updated',
    message: `Service "${serviceData.title}" has been updated.`,
    type: NotificationType.INFO,
    category: NotificationCategory.SERVICE,
    actionUrl: '/admin/services',
    actionLabel: 'View Service',
    metadata: {
      serviceId: serviceData.id,
      title: serviceData.title,
    },
  });
};

/**
 * Blog Notifications
 */
export const notifyNewBlogPost = async (blogData: {
  title: string;
  id: string;
  authorId?: string;
}) => {
  const adminId = await getAdminUserId();
  if (!adminId) return null;

  return createNotification({
    userId: adminId,
    title: 'New Blog Post',
    message: `A new blog post "${blogData.title}" has been created.`,
    type: NotificationType.SUCCESS,
    category: NotificationCategory.BLOG,
    actionUrl: '/admin/blog',
    actionLabel: 'View Post',
    metadata: {
      blogId: blogData.id,
      title: blogData.title,
    },
  });
};

export const notifyBlogPublished = async (blogData: {
  title: string;
  id: string;
}) => {
  const adminId = await getAdminUserId();
  if (!adminId) return null;

  return createNotification({
    userId: adminId,
    title: 'Blog Post Published',
    message: `Blog post "${blogData.title}" has been published and is now live.`,
    type: NotificationType.SUCCESS,
    category: NotificationCategory.BLOG,
    actionUrl: `/blog/${blogData.id}`,
    actionLabel: 'View Live Post',
    metadata: {
      blogId: blogData.id,
      title: blogData.title,
    },
  });
};

export const notifyBlogUpdated = async (blogData: {
  title: string;
  id: string;
}) => {
  const adminId = await getAdminUserId();
  if (!adminId) return null;

  return createNotification({
    userId: adminId,
    title: 'Blog Post Updated',
    message: `Blog post "${blogData.title}" has been updated.`,
    type: NotificationType.INFO,
    category: NotificationCategory.BLOG,
    actionUrl: '/admin/blog',
    actionLabel: 'View Changes',
    metadata: {
      blogId: blogData.id,
      title: blogData.title,
    },
  });
};

/**
 * Testimonial Notifications
 */
export const notifyNewTestimonial = async (testimonialData: {
  clientName: string;
  id: string;
}) => {
  const adminId = await getAdminUserId();
  if (!adminId) return null;

  return createNotification({
    userId: adminId,
    title: 'New Testimonial',
    message: `A new testimonial from ${testimonialData.clientName} has been added.`,
    type: NotificationType.SUCCESS,
    category: NotificationCategory.TESTIMONIAL,
    actionUrl: '/admin/testimonials',
    actionLabel: 'View Testimonial',
    metadata: {
      testimonialId: testimonialData.id,
      clientName: testimonialData.clientName,
    },
  });
};

export const notifyTestimonialStatusChanged = async (testimonialData: {
  clientName: string;
  id: string;
  newStatus: string;
}) => {
  const adminId = await getAdminUserId();
  if (!adminId) return null;

  return createNotification({
    userId: adminId,
    title: 'Testimonial Status Changed',
    message: `Testimonial from ${testimonialData.clientName} is now ${testimonialData.newStatus}.`,
    type: NotificationType.INFO,
    category: NotificationCategory.TESTIMONIAL,
    actionUrl: '/admin/testimonials',
    actionLabel: 'View Testimonial',
    metadata: {
      testimonialId: testimonialData.id,
      clientName: testimonialData.clientName,
      status: testimonialData.newStatus,
    },
  });
};

/**
 * Team Notifications
 */
export const notifyNewTeamMember = async (teamData: {
  name: string;
  id: string;
  position?: string;
}) => {
  const adminId = await getAdminUserId();
  if (!adminId) return null;

  return createNotification({
    userId: adminId,
    title: 'New Team Member Added',
    message: `${teamData.name}${teamData.position ? ` (${teamData.position})` : ''} has been added to the team.`,
    type: NotificationType.SUCCESS,
    category: NotificationCategory.TEAM,
    actionUrl: '/admin/team',
    actionLabel: 'View Team',
    metadata: {
      teamMemberId: teamData.id,
      name: teamData.name,
      position: teamData.position,
    },
  });
};

export const notifyTeamMemberUpdated = async (teamData: {
  name: string;
  id: string;
}) => {
  const adminId = await getAdminUserId();
  if (!adminId) return null;

  return createNotification({
    userId: adminId,
    title: 'Team Member Updated',
    message: `Team member ${teamData.name}'s profile has been updated.`,
    type: NotificationType.INFO,
    category: NotificationCategory.TEAM,
    actionUrl: '/admin/team',
    actionLabel: 'View Profile',
    metadata: {
      teamMemberId: teamData.id,
      name: teamData.name,
    },
  });
};

/**
 * User/Auth Notifications
 */
export const notifyWelcome = async (userId: string, userName?: string) => {
  return createNotification({
    userId,
    title: 'Welcome to Dashboard',
    message: `${userName ? `Welcome, ${userName}! ` : ''}Your admin dashboard is ready to use. Start managing your website content, track performance, and oversee all business operations.`,
    type: NotificationType.INFO,
    category: NotificationCategory.USER,
    actionUrl: '/admin/dashboard',
    actionLabel: 'Go to Dashboard',
    metadata: {
      isWelcomeNotification: true,
    },
  });
};

/**
 * Mark notification as read
 */
export const markNotificationAsRead = async (notificationId: string) => {
  return prisma.notification.update({
    where: { id: notificationId },
    data: { isRead: true },
  });
};

/**
 * Mark all notifications as read for a user
 */
export const markAllNotificationsAsRead = async (userId: string) => {
  return prisma.notification.updateMany({
    where: { userId, isRead: false },
    data: { isRead: true },
  });
};

/**
 * Delete a notification
 */
export const deleteNotification = async (notificationId: string) => {
  return prisma.notification.delete({
    where: { id: notificationId },
  });
};

/**
 * Get user notifications
 */
export const getUserNotifications = async (
  userId: string,
  options?: {
    limit?: number;
    offset?: number;
    unreadOnly?: boolean;
  }
) => {
  const { limit = 50, offset = 0, unreadOnly = false } = options || {};

  return prisma.notification.findMany({
    where: {
      userId,
      ...(unreadOnly && { isRead: false }),
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: offset,
  });
};

/**
 * Get unread notification count
 */
export const getUnreadNotificationCount = async (userId: string) => {
  return prisma.notification.count({
    where: { userId, isRead: false },
  });
};
