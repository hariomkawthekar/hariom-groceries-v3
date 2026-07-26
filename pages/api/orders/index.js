import prisma from '../../../lib/prisma';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { fullName, email, address, phone, total, items } = req.body;

      if (!email || !items || items.length === 0) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      if (!prisma) {
        return res.status(201).json({ message: 'Order created successfully', order: { id: Date.now(), total, items } });
      }

      // Upsert the user based on email (so it creates if they don't exist)
      const user = await prisma.user.upsert({
        where: { email },
        update: { name: fullName },
        create: { email, name: fullName },
      });

      // Map cart items into Prisma OrderItem Create inputs
      const orderItems = items.map((item) => ({
        productId: item.id,
        quantity: item.quantity || 1,
        price: Number(item.price),
      }));

      // Create the order
      const newOrder = await prisma.order.create({
        data: {
          userId: user.id,
          total: Number(total),
          address: address,
          phone: phone,
          items: {
            create: orderItems,
          },
        },
        include: {
          items: true,
        },
      });

      return res.status(201).json({ message: 'Order created successfully', order: newOrder });
    } catch (error) {
      console.error('Error creating order:', error);
      return res.status(500).json({ error: 'Failed to create order' });
    }
  } 
  else if (req.method === 'GET') {
    try {
      if (!prisma) {
        return res.status(200).json([]);
      }
      const { email } = req.query;

      // Ensure valid request
      if (!email) {
        // If no email, maybe it's for the shopkeeper, we could return all or error based on the logic. 
        // For now let's just return all orders if no email (Shopkeeper case).
        const allOrders = await prisma.order.findMany({
          orderBy: { createdAt: 'desc' },
          include: {
            items: {
              include: {
                product: true
              }
            },
            user: true
          }
        });
        return res.status(200).json(allOrders);
      }

      // Find user and their orders
      const userOrders = await prisma.order.findMany({
        where: {
          user: {
            email: email,
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });

      return res.status(200).json(userOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      return res.status(500).json({ error: 'Failed to fetch orders' });
    }
  } 
  else {
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
