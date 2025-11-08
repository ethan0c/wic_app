import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getNearbyStores = async (req: Request, res: Response) => {
  try {
    const { latitude, longitude, radius = '10' } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({ error: 'Latitude and longitude required' });
    }

    const lat = parseFloat(latitude as string);
    const lng = parseFloat(longitude as string);
    const radiusMiles = parseFloat(radius as string);

    // Fetch all stores (in production, you'd use PostGIS for spatial queries)
    const stores = await prisma.wicStore.findMany({
      where: { isActive: true },
    });

    // Calculate distance using Haversine formula
    const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
      const R = 3959; // Earth's radius in miles
      const dLat = ((lat2 - lat1) * Math.PI) / 180;
      const dLon = ((lon2 - lon1) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
          Math.cos((lat2 * Math.PI) / 180) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    };

    // Filter by radius and add distance
    const nearbyStores = stores
      .map((store) => ({
        ...store,
        latitude: parseFloat(store.latitude.toString()),
        longitude: parseFloat(store.longitude.toString()),
        distance: calculateDistance(lat, lng, parseFloat(store.latitude.toString()), parseFloat(store.longitude.toString())),
      }))
      .filter((store) => store.distance <= radiusMiles)
      .sort((a, b) => a.distance - b.distance);

    res.json(nearbyStores);
  } catch (error) {
    console.error('Error fetching stores:', error);
    res.status(500).json({ error: 'Failed to fetch stores' });
  }
};

export const getAllStores = async (req: Request, res: Response) => {
  try {
    const stores = await prisma.wicStore.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });
    res.json(stores);
  } catch (error) {
    console.error('Error fetching stores:', error);
    res.status(500).json({ error: 'Failed to fetch stores' });
  }
};
