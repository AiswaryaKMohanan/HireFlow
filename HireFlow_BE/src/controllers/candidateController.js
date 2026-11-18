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


export const getcandidateById = async(req,res)=>{

const {id }= req.params;
const candidate = await prisma.candidate.findUnique({
    where:{
        id :Number(id)
    }
});
if (!candidate) {
    return res.status(404).json({
      success: false,
      message: 'Candidate not found',
    });
  }

  res.status(200).json({
    success: true,
    data: candidate,
  });
}


export const deleteCandidateById = async (req,res)=>{
    const{id}=req.params
    const candidate = await prisma.candidate.findMany({
        where:{
            id:Number(id)
        }
    });
    if (!candidate) {
    return res.status(404).json({
      success: false,
      message: 'Candidate not found',
    });
  }
  await prisma.candidate.delete({
    where: {
      id: Number(id),
    },
  });

  res.status(200).json({
    success: true,
    message: 'Candidate deleted successfully',
  });
};



export const updateCandidate = async (req, res) => {
  const { id } = req.params;

  const {
    fullName,
    email,
    phone,
    passportNo,
    jobProfile,
    stage,
  } = req.body;

  // Check whether candidate exists
  const existingCandidate = await prisma.candidate.findUnique({
    where: {
      id: Number(id),
    },
  });

  if (!existingCandidate) {
    return res.status(404).json({
      success: false,
      message: 'Candidate not found',
    });
  }

  // Update candidate
  const candidate = await prisma.candidate.update({
    where: {
      id: Number(id),
    },
    data: {
      fullName,
      email,
      phone,
      passportNo,
      jobProfile,
      stage,
    },
  });

  res.status(200).json({
    success: true,
    message: 'Candidate updated successfully',
    data: candidate,
  });
};
