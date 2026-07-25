import prisma from '../../lib/prisma';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Fetch products from the MySQL database using Prisma
      const products = await prisma.product.findMany({
        orderBy: {
          id: 'asc',
        },
      });
      return res.status(200).json(products);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      return res.status(500).json({ error: "Failed to fetch products from the MySQL database." });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
