import { db } from "@db";
import { 
  muteffikler, muteffiklerInsertSchema, 
  dusmanlar, dusmanlarInsertSchema,
  asKadro, asKadroInsertSchema,
  ksBilgi, ksBilgiInsertSchema,
  sunucular, sunucularInsertSchema
} from "@shared/schema";
import { eq } from "drizzle-orm";
import { sendNotification } from "./discord/notifications";
import { client } from "./discord/index";

// Notification helper to send updates to Discord channel
async function notifyDiscord(event: {
  type: 'create' | 'update' | 'delete';
  category: 'muteffikler' | 'dusmanlar' | 'askadro' | 'ksbilgi' | 'sunucular';
  data: any;
}) {
  if (client && client.isReady()) {
    await sendNotification(client, event);
  }
}

// Allies/Müttefikler operations
export const storage = {
  // Müttefikler (Allies)
  async getMuteffikler() {
    return await db.query.muteffikler.findMany({
      orderBy: (fields, { desc }) => [desc(fields.createdAt)]
    });
  },
  
  async getMuteffikById(id: number) {
    return await db.query.muteffikler.findFirst({
      where: (fields, { eq }) => eq(fields.id, id)
    });
  },
  
  async getMuteffikByName(isim: string) {
    return await db.query.muteffikler.findFirst({
      where: (fields, { eq }) => eq(fields.isim, isim)
    });
  },
  
  async createMuteffikler(data: typeof muteffiklerInsertSchema._type) {
    try {
      const validated = muteffiklerInsertSchema.parse(data);
      const [created] = await db.insert(muteffikler).values(validated).returning();
      
      // Send notification to Discord channel
      await notifyDiscord({
        type: 'create',
        category: 'muteffikler',
        data: created
      });
      
      return created;
    } catch (error) {
      throw error;
    }
  },
  
  async updateMuteffikler(id: number, data: Partial<typeof muteffiklerInsertSchema._type>) {
    try {
      const [updated] = await db
        .update(muteffikler)
        .set(data)
        .where(eq(muteffikler.id, id))
        .returning();
      
      // Send notification to Discord channel
      await notifyDiscord({
        type: 'update',
        category: 'muteffikler',
        data: updated
      });
      
      return updated;
    } catch (error) {
      throw error;
    }
  },
  
  async deleteMuteffikler(id: number) {
    try {
      const muttefik = await this.getMuteffikById(id);
      if (!muttefik) {
        throw new Error(`Muttefik with ID ${id} not found`);
      }
      
      const [deleted] = await db
        .delete(muteffikler)
        .where(eq(muteffikler.id, id))
        .returning();
      
      // Send notification to Discord channel
      await notifyDiscord({
        type: 'delete',
        category: 'muteffikler',
        data: muttefik // Use the fetched data before deletion
      });
      
      return deleted;
    } catch (error) {
      throw error;
    }
  },
  
  // Düşmanlar (Enemies)
  async getDusmanlar() {
    return await db.query.dusmanlar.findMany({
      orderBy: (fields, { desc }) => [desc(fields.createdAt)]
    });
  },
  
  async getDusmanById(id: number) {
    return await db.query.dusmanlar.findFirst({
      where: (fields, { eq }) => eq(fields.id, id)
    });
  },
  
  async getDusmanByName(isim: string) {
    return await db.query.dusmanlar.findFirst({
      where: (fields, { eq }) => eq(fields.isim, isim)
    });
  },
  
  async createDusman(data: typeof dusmanlarInsertSchema._type) {
    try {
      const validated = dusmanlarInsertSchema.parse(data);
      const [created] = await db.insert(dusmanlar).values(validated).returning();
      
      // Send notification to Discord channel
      await notifyDiscord({
        type: 'create',
        category: 'dusmanlar',
        data: created
      });
      
      return created;
    } catch (error) {
      throw error;
    }
  },
  
  async updateDusman(id: number, data: Partial<typeof dusmanlarInsertSchema._type>) {
    try {
      const [updated] = await db
        .update(dusmanlar)
        .set(data)
        .where(eq(dusmanlar.id, id))
        .returning();
      
      // Send notification to Discord channel
      await notifyDiscord({
        type: 'update',
        category: 'dusmanlar',
        data: updated
      });
      
      return updated;
    } catch (error) {
      throw error;
    }
  },
  
  async deleteDusman(id: number) {
    try {
      const dusman = await this.getDusmanById(id);
      if (!dusman) {
        throw new Error(`Dusman with ID ${id} not found`);
      }
      
      const [deleted] = await db
        .delete(dusmanlar)
        .where(eq(dusmanlar.id, id))
        .returning();
      
      // Send notification to Discord channel
      await notifyDiscord({
        type: 'delete',
        category: 'dusmanlar',
        data: dusman // Use the fetched data before deletion
      });
      
      return deleted;
    } catch (error) {
      throw error;
    }
  },
  
  // AS Kadro (Team Members)
  async getAsKadro() {
    return await db.query.asKadro.findMany({
      orderBy: (fields, { desc }) => [desc(fields.createdAt)]
    });
  },
  
  async getAsKadroById(id: number) {
    return await db.query.asKadro.findFirst({
      where: (fields, { eq }) => eq(fields.id, id)
    });
  },
  
  async getAsKadroByName(isim: string) {
    return await db.query.asKadro.findFirst({
      where: (fields, { eq }) => eq(fields.isim, isim)
    });
  },
  
  async createAsKadro(data: typeof asKadroInsertSchema._type) {
    try {
      const validated = asKadroInsertSchema.parse(data);
      const [created] = await db.insert(asKadro).values(validated).returning();
      
      // Send notification to Discord channel
      await notifyDiscord({
        type: 'create',
        category: 'askadro',
        data: created
      });
      
      return created;
    } catch (error) {
      throw error;
    }
  },
  
  async updateAsKadro(id: number, data: Partial<typeof asKadroInsertSchema._type>) {
    try {
      const [updated] = await db
        .update(asKadro)
        .set(data)
        .where(eq(asKadro.id, id))
        .returning();
      
      // Send notification to Discord channel
      await notifyDiscord({
        type: 'update',
        category: 'askadro',
        data: updated
      });
      
      return updated;
    } catch (error) {
      throw error;
    }
  },
  
  async deleteAsKadro(id: number) {
    try {
      const member = await this.getAsKadroById(id);
      if (!member) {
        throw new Error(`Team member with ID ${id} not found`);
      }
      
      const [deleted] = await db
        .delete(asKadro)
        .where(eq(asKadro.id, id))
        .returning();
      
      // Send notification to Discord channel
      await notifyDiscord({
        type: 'delete',
        category: 'askadro',
        data: member
      });
      
      return deleted;
    } catch (error) {
      throw error;
    }
  },
  
  // KS Bilgi (Clan Info)
  async getKsBilgi() {
    return await db.query.ksBilgi.findMany({
      orderBy: (fields, { desc }) => [desc(fields.createdAt)]
    });
  },
  
  async getKsBilgiById(id: number) {
    return await db.query.ksBilgi.findFirst({
      where: (fields, { eq }) => eq(fields.id, id)
    });
  },
  
  async getKsBilgiByTitle(baslik: string) {
    return await db.query.ksBilgi.findFirst({
      where: (fields, { eq }) => eq(fields.baslik, baslik)
    });
  },
  
  async createKsBilgi(data: typeof ksBilgiInsertSchema._type) {
    try {
      const validated = ksBilgiInsertSchema.parse(data);
      const [created] = await db.insert(ksBilgi).values(validated).returning();
      
      // Send notification to Discord channel
      await notifyDiscord({
        type: 'create',
        category: 'ksbilgi',
        data: created
      });
      
      return created;
    } catch (error) {
      throw error;
    }
  },
  
  async updateKsBilgi(id: number, data: Partial<typeof ksBilgiInsertSchema._type>) {
    try {
      const [updated] = await db
        .update(ksBilgi)
        .set(data)
        .where(eq(ksBilgi.id, id))
        .returning();
      
      // Send notification to Discord channel
      await notifyDiscord({
        type: 'update',
        category: 'ksbilgi',
        data: updated
      });
      
      return updated;
    } catch (error) {
      throw error;
    }
  },
  
  async deleteKsBilgi(id: number) {
    try {
      const info = await this.getKsBilgiById(id);
      if (!info) {
        throw new Error(`Clan info with ID ${id} not found`);
      }
      
      const [deleted] = await db
        .delete(ksBilgi)
        .where(eq(ksBilgi.id, id))
        .returning();
      
      // Send notification to Discord channel
      await notifyDiscord({
        type: 'delete',
        category: 'ksbilgi',
        data: info
      });
      
      return deleted;
    } catch (error) {
      throw error;
    }
  },
  
  // Sunucular (Servers)
  async getSunucular() {
    return await db.query.sunucular.findMany({
      orderBy: (fields, { desc }) => [desc(fields.createdAt)]
    });
  },
  
  async getSunucuById(id: number) {
    return await db.query.sunucular.findFirst({
      where: (fields, { eq }) => eq(fields.id, id)
    });
  },
  
  async getSunucuByName(isim: string) {
    return await db.query.sunucular.findFirst({
      where: (fields, { eq }) => eq(fields.isim, isim)
    });
  },
  
  async createSunucu(data: typeof sunucularInsertSchema._type) {
    try {
      const validated = sunucularInsertSchema.parse(data);
      const [created] = await db.insert(sunucular).values(validated).returning();
      
      // Send notification to Discord channel
      await notifyDiscord({
        type: 'create',
        category: 'sunucular',
        data: created
      });
      
      return created;
    } catch (error) {
      throw error;
    }
  },
  
  async updateSunucu(id: number, data: Partial<typeof sunucularInsertSchema._type>) {
    try {
      const [updated] = await db
        .update(sunucular)
        .set(data)
        .where(eq(sunucular.id, id))
        .returning();
      
      // Send notification to Discord channel
      await notifyDiscord({
        type: 'update',
        category: 'sunucular',
        data: updated
      });
      
      return updated;
    } catch (error) {
      throw error;
    }
  },
  
  async deleteSunucu(id: number) {
    try {
      const sunucu = await this.getSunucuById(id);
      if (!sunucu) {
        throw new Error(`Server with ID ${id} not found`);
      }
      
      const [deleted] = await db
        .delete(sunucular)
        .where(eq(sunucular.id, id))
        .returning();
      
      // Send notification to Discord channel
      await notifyDiscord({
        type: 'delete',
        category: 'sunucular',
        data: sunucu
      });
      
      return deleted;
    } catch (error) {
      throw error;
    }
  }
};
