import { PrismaClient, UserRole, EngagementStatus, OKRType, OKRStatus, DeliverableStatus, MeetingType, AttendeeStatus, ActionItemStatus } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting database seeding...')

  // Clear existing data
  await prisma.$transaction([
    prisma.actionItem.deleteMany(),
    prisma.meetingAttendee.deleteMany(),
    prisma.meeting.deleteMany(),
    prisma.deliverable.deleteMany(),
    prisma.oKRUpdate.deleteMany(),
    prisma.oKR.deleteMany(),
    prisma.teamMemberSkill.deleteMany(),
    prisma.skill.deleteMany(),
    prisma.teamMemberAllocation.deleteMany(),
    prisma.teamMember.deleteMany(),
    prisma.engagement.deleteMany(),
    prisma.client.deleteMany(),
    prisma.user.deleteMany(),
  ])

  console.log('Database cleared. Creating new data...')

  // Create admin user
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      name: 'Admin User',
      role: UserRole.ADMIN,
      password: '$2a$10$vJ9okValmZDgWzFvnDRIqe8U0v2QVqe3ANB2aZ.h2amfBsFVfM6eK', // "password123" - in production use proper hashing
    },
  })

  // Create delivery lead
  const deliveryLead = await prisma.user.create({
    data: {
      email: 'delivery@example.com',
      name: 'Delivery Lead',
      role: UserRole.DELIVERY_LEAD,
      password: '$2a$10$vJ9okValmZDgWzFvnDRIqe8U0v2QVqe3ANB2aZ.h2amfBsFVfM6eK',
    },
  })

  // Create engagement lead
  const engagementLead = await prisma.user.create({
    data: {
      email: 'engagement@example.com',
      name: 'Engagement Lead',
      role: UserRole.ENGAGEMENT_LEAD,
      password: '$2a$10$vJ9okValmZDgWzFvnDRIqe8U0v2QVqe3ANB2aZ.h2amfBsFVfM6eK',
    },
  })

  // Create team members
  const teamMember1 = await prisma.teamMember.create({
    data: {
      name: 'John Developer',
      email: 'john@example.com',
      title: 'Senior Developer',
      startDate: new Date('2022-01-15'),
      user: {
        create: {
          email: 'john@example.com',
          name: 'John Developer',
          role: UserRole.TEAM_MEMBER,
          password: '$2a$10$vJ9okValmZDgWzFvnDRIqe8U0v2QVqe3ANB2aZ.h2amfBsFVfM6eK',
        }
      }
    },
  })

  const teamMember2 = await prisma.teamMember.create({
    data: {
      name: 'Jane Designer',
      email: 'jane@example.com',
      title: 'UX Designer',
      startDate: new Date('2022-02-10'),
      user: {
        create: {
          email: 'jane@example.com',
          name: 'Jane Designer',
          role: UserRole.TEAM_MEMBER,
          password: '$2a$10$vJ9okValmZDgWzFvnDRIqe8U0v2QVqe3ANB2aZ.h2amfBsFVfM6eK',
        }
      }
    },
  })

  // Create skills
  const skill1 = await prisma.skill.create({
    data: {
      name: 'React',
      category: 'Frontend',
    },
  })

  const skill2 = await prisma.skill.create({
    data: {
      name: 'Node.js',
      category: 'Backend',
    },
  })

  const skill3 = await prisma.skill.create({
    data: {
      name: 'UX Design',
      category: 'Design',
    },
  })

  // Associate skills with team members
  await prisma.teamMemberSkill.create({
    data: {
      teamMemberId: teamMember1.id,
      skillId: skill1.id,
      proficiencyLevel: 5,
      yearsOfExperience: 4,
    },
  })

  await prisma.teamMemberSkill.create({
    data: {
      teamMemberId: teamMember1.id,
      skillId: skill2.id,
      proficiencyLevel: 4,
      yearsOfExperience: 3,
    },
  })

  await prisma.teamMemberSkill.create({
    data: {
      teamMemberId: teamMember2.id,
      skillId: skill3.id,
      proficiencyLevel: 5,
      yearsOfExperience: 5,
    },
  })

  // Create a client
  const client = await prisma.client.create({
    data: {
      name: 'Acme Corporation',
      description: 'Global technology company',
      primaryContact: 'Sarah Johnson',
      primaryEmail: 'sarah@acmecorp.com',
      primaryPhone: '555-123-4567',
      managers: {
        connect: [{ id: engagementLead.id }]
      }
    },
  })

  // Create an engagement
  const engagement = await prisma.engagement.create({
    data: {
      name: 'Digital Transformation',
      description: 'Enterprise-wide digital transformation initiative',
      startDate: new Date('2023-01-01'),
      endDate: new Date('2023-12-31'),
      status: EngagementStatus.ACTIVE,
      clientId: client.id,
      leadId: deliveryLead.id,
    },
  })

  // Allocate team members to engagement
  await prisma.teamMemberAllocation.create({
    data: {
      teamMemberId: teamMember1.id,
      engagementId: engagement.id,
      startDate: new Date('2023-01-15'),
      endDate: new Date('2023-12-15'),
      allocationPercentage: 80,
      role: 'Technical Lead',
    },
  })

  await prisma.teamMemberAllocation.create({
    data: {
      teamMemberId: teamMember2.id,
      engagementId: engagement.id,
      startDate: new Date('2023-02-01'),
      endDate: new Date('2023-11-30'),
      allocationPercentage: 60,
      role: 'UX Lead',
    },
  })

  // Create OKRs
  const objective = await prisma.oKR.create({
    data: {
      title: 'Improve customer engagement',
      description: 'Enhance customer interaction across digital touchpoints',
      type: OKRType.OBJECTIVE,
      quarter: 'Q1-2023',
      startDate: new Date('2023-01-01'),
      targetDate: new Date('2023-03-31'),
      status: OKRStatus.IN_PROGRESS,
      engagementId: engagement.id,
      weight: 1,
    },
  })

  const keyResult1 = await prisma.oKR.create({
    data: {
      title: 'Increase mobile app usage by 30%',
      description: 'Boost daily active users on mobile platform',
      type: OKRType.KEY_RESULT,
      targetValue: 30,
      startValue: 0,
      quarter: 'Q1-2023',
      startDate: new Date('2023-01-01'),
      targetDate: new Date('2023-03-31'),
      status: OKRStatus.ON_TRACK,
      engagementId: engagement.id,
      parentId: objective.id,
    },
  })

  const keyResult2 = await prisma.oKR.create({
    data: {
      title: 'Reduce customer support tickets by 20%',
      description: 'Implement self-service options to reduce support volume',
      type: OKRType.KEY_RESULT,
      targetValue: 20,
      startValue: 0,
      quarter: 'Q1-2023',
      startDate: new Date('2023-01-01'),
      targetDate: new Date('2023-03-31'),
      status: OKRStatus.AT_RISK,
      engagementId: engagement.id,
      parentId: objective.id,
    },
  })

  // Create OKR updates
  await prisma.oKRUpdate.create({
    data: {
      okrId: keyResult1.id,
      currentValue: 15,
      notes: 'On track to meet target. Mobile usage growing consistently.',
      supportingLinks: 'https://analytics.example.com/dashboard/123',
      updatedById: deliveryLead.id,
      updateDate: new Date('2023-02-15'),
    },
  })

  await prisma.oKRUpdate.create({
    data: {
      okrId: keyResult2.id,
      currentValue: 5,
      notes: 'Progress slower than expected. Need to accelerate self-service adoption.',
      updatedById: deliveryLead.id,
      updateDate: new Date('2023-02-15'),
    },
  })

  // Create deliverables
  await prisma.deliverable.create({
    data: {
      title: 'Mobile App Redesign',
      description: 'Complete UI/UX redesign of mobile application',
      status: DeliverableStatus.IN_PROGRESS,
      dueDate: new Date('2023-03-15'),
      okrId: keyResult1.id,
      documentLink: 'https://docs.example.com/redesign-spec',
    },
  })

  await prisma.deliverable.create({
    data: {
      title: 'Self-Service Knowledge Base',
      description: 'Comprehensive knowledge base for customer self-service',
      status: DeliverableStatus.IN_PROGRESS,
      dueDate: new Date('2023-03-20'),
      okrId: keyResult2.id,
    },
  })

  // Create meetings
  const meeting = await prisma.meeting.create({
    data: {
      title: 'Weekly Status Update',
      description: 'Review progress and address blockers',
      startTime: new Date('2023-02-20T10:00:00Z'),
      endTime: new Date('2023-02-20T11:00:00Z'),
      location: 'Conference Room A / Zoom',
      isRecurring: true,
      recurrenceRule: 'FREQ=WEEKLY;BYDAY=MO',
      meetingType: MeetingType.STATUS_UPDATE,
      meetingLink: 'https://zoom.us/j/123456789',
      engagementId: engagement.id,
      creatorId: deliveryLead.id,
    },
  })

  // Add meeting attendees
  await prisma.meetingAttendee.create({
    data: {
      meetingId: meeting.id,
      userId: deliveryLead.id,
      status: AttendeeStatus.ACCEPTED,
    },
  })

  await prisma.meetingAttendee.create({
    data: {
      meetingId: meeting.id,
      teamMemberId: teamMember1.id,
      status: AttendeeStatus.ACCEPTED,
    },
  })

  await prisma.meetingAttendee.create({
    data: {
      meetingId: meeting.id,
      teamMemberId: teamMember2.id,
      status: AttendeeStatus.ACCEPTED,
    },
  })

  // Create action items
  await prisma.actionItem.create({
    data: {
      description: 'Complete mobile app wireframes',
      dueDate: new Date('2023-02-25'),
      status: ActionItemStatus.IN_PROGRESS,
      meetingId: meeting.id,
      assigneeId: teamMember2.user!.id,
    },
  })

  await prisma.actionItem.create({
    data: {
      description: 'Prepare demo environment for client review',
      dueDate: new Date('2023-02-28'),
      status: ActionItemStatus.OPEN,
      meetingId: meeting.id,
      assigneeId: teamMember1.user!.id,
    },
  })

  console.log('Database seeding completed successfully.')
}

main()
  .catch((error) => {
    console.error('Error during database seeding:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 