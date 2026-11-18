import prisma from '../config/prisma.js';

export const createCandidate = async (req, res) => {
    const {
        fullName,
        email,
        phone,
        passportNo,
        jobProfile,
        recruiterId,
    } = req.body || {};

    if (!fullName || !recruiterId) {
        return res.status(400).json({
            success: false,
            message: 'Full name and recruiterId are required',
        });
    }

    const recruiter = await prisma.user.findUnique({
        where: {
            id: Number(recruiterId),
        },
    });

    if (!recruiter || recruiter.role !== 'recruiter') {
        return res.status(400).json({
            success: false,
            message: 'Valid recruiter not found',
        });
    }

    const candidate = await prisma.candidate.create({
        data: {
            fullName,
            email,
            phone,
            passportNo,
            jobProfile,
            recruiterId: recruiter.id,
        },
    });

    return res.status(201).json({
        success: true,
        message: 'Candidate created successfully',
        data: candidate,
    });
};


export const getCandidates = async (req, res) => {
  const candidates = await prisma.candidate.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });

  res.status(200).json({
    success: true,
    count: candidates.length,
    data: candidates,
  });
};
