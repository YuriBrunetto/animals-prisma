import { prisma } from '../../../server/db/client'

// const prisma = new PrismaClient()

export default async function handler(req, res) {
  const { method } = req

  switch (method) {
    case 'POST':
      const { animal } = req.body
      const animalPost = await prisma.animal.create({
        data: {
          name: animal,
        },
      })
      res.status(201).json(animalPost)
      break
    default:
      res.setHeader('Allow', ['POST'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}
