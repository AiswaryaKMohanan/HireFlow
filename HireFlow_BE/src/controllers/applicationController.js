
import prisma from '../config/prisma.js';

// Get all applications
export const getApplications = async (req, res) => {
  const applications = await prisma.application.findMany({
    include: {
      candidate: true,
      job: true,
    },
    orderBy: {
      appliedAt: 'desc',
    },
  });

  res.status(200).json({
    success: true,
    count: applications.length,
    data: applications,
  });
};

// Create an application
export const createApplication = async (req, res) => {
  const { candidateId, jobId, notes } = req.body;

  if (!candidateId || !jobId) {
    return res.status(400).json({
      success: false,
      message: 'candidateId and jobId are required',
    });
  }

  const candidate = await prisma.candidate.findUnique({
    where: { id: Number(candidateId) },
  });

  if (!candidate) {
    return res.status(404).json({
      success: false,
      message: 'Candidate not found',
    });
  }

  const job = await prisma.job.findUnique({
    where: { id: Number(jobId) },
  });

  if (!job) {
    return res.status(404).json({
      success: false,
      message: 'Job not found',
    });
  }

  if (job.status !== 'open') {
    return res.status(400).json({
      success: false,
      message: 'Cannot apply to a job that is not open',
    });
  }

  const existingApplication = await prisma.application.findUnique({
    where: {
      candidateId_jobId: {
        candidateId: Number(candidateId),
        jobId: Number(jobId),
      },
    },
  });

  if (existingApplication) {
    return res.status(409).json({
      success: false,
      message: 'This candidate has already been assigned to this job',
    });
  }

  const application = await prisma.application.create({
    data: {
      candidateId: Number(candidateId),
      jobId: Number(jobId),
      notes,
    },
    include: {
      candidate: true,
      job: true,
    },
  });

  res.status(201).json({
    success: true,
    message: 'Application created successfully',
    data: application,
  });
};

export const getApplicationById = async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Invalid application ID',
    });
  }

  const application = await prisma.application.findUnique({
    where: { id },
    include: {
      candidate: true,
      job: true,
    },
  });

  if (!application) {
    return res.status(404).json({
      success: false,
      message: 'Application not found',
    });
  }

  res.status(200).json({
    success: true,
    data: application,
  });
};
