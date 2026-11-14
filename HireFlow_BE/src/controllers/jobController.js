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