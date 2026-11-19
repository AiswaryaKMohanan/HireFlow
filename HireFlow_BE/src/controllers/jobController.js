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


export const getJobById =async(req,res)=>{
  const {jobId }= req.params;
  const job = await prisma.job.findUnique({
    where:{
      id :Number(jobId)
    }
  });
  if (!job) {
    return res.status(404).json({
      success: false,
      message: 'Job not found',
    });
  }

  res.status(200).json({
    success: true,
    data: job,
  });
}


export const updateJob = async (req, res) => {
  const jobId = Number(req.params.jobId);
  if (!Number.isInteger(jobId) || jobId <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Invalid job ID',
    });
  }

  const {
    title,
    description,
    department,
    location,
    employmentType,
    salaryMin,
    salaryMax,
    status,
  } = req.body || {};

  const data = {};
  for (const [field, value] of Object.entries({
    title,
    description,
    department,
    location,
    employmentType,
    status,
  })) {
    if (value !== undefined) {
      data[field] = value;
    }
  }

  for (const [field, value] of Object.entries({ salaryMin, salaryMax })) {
    if (value === undefined) {
      continue;
    }
    if (value === null) {
      data[field] = null;
      continue;
    }

    const amount = Number(value);
    if (value === '' || !Number.isFinite(amount)) {
      return res.status(400).json({
        success: false,
        message: `${field} must be a valid number or null`,
      });
    }
    data[field] = amount;
  }

  if (Object.keys(data).length === 0) {
    return res.status(400).json({
      success: false,
      message: 'At least one job field must be provided',
    });
  }

  const existingJob = await prisma.job.findUnique({
    where: { id: jobId },
  });
  if (!existingJob) {
    return res.status(404).json({
      success: false,
      message: 'Job not found',
    });
  }

  const updatedJob = await prisma.job.update({
    where: { id: jobId },
    data,
  });

  return res.status(200).json({
    success: true,
    message: 'Job updated successfully',
    data: updatedJob,
  });
};

export const deleteJob = async (req, res) => {
  const jobId = Number(req.params.jobId);
  if (!Number.isInteger(jobId) || jobId <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Invalid job ID',
    });
  }

  const existingJob = await prisma.job.findUnique({
    where: { id: jobId },
  });
  if (!existingJob) {
    return res.status(404).json({
      success: false,
      message: 'Job not found',
    });
  }

  await prisma.job.delete({
    where: { id: jobId },
  });

  return res.status(200).json({
    success: true,
    message: 'Job deleted successfully',
  });
};