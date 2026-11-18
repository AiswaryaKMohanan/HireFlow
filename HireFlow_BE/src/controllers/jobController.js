import prisma from '../config/prisma.js';

export const getJobs = async (req, res) => {
  const jobs = await prisma.job.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });

  res.status(200).json({
    success: true,
    count: jobs.length,
    data: jobs,
  });
};

export const createJob = async (req, res) => {
  const {
    title,
    description,
    department,
    location,
    employmentType,
    salaryMin,
    salaryMax,
    recruiterId,
  } = req.body;

  // Basic validation
  if (!title || !description || !recruiterId) {
    return res.status(400).json({
      success: false,
      message: 'Title, description and recruiterId are required',
    });
  }

  const recruiter = await prisma.user.findUnique({
    where: { id: Number(recruiterId) },
  });

  if (!recruiter || recruiter.role !== 'recruiter') {
    return res.status(400).json({
      success: false,
      message: 'Valid recruiter not found',
    });
  }

  const job = await prisma.job.create({
    data: {
      title,
      description,
      department,
      location,
      employmentType,
      salaryMin: salaryMin ? Number(salaryMin) : null,
      salaryMax: salaryMax ? Number(salaryMax) : null,
      recruiterId: recruiter.id,
    },
  });
 console.log(job,'job');
 
  res.status(201).json({
    success: true,
    message: 'Job created successfully',
    data: job,
  });
};