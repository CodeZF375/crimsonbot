import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { 
  muteffiklerInsertSchema, 
  dusmanlarInsertSchema,
  asKadroInsertSchema,
  ksBilgiInsertSchema,
  sunucularInsertSchema
} from "@shared/schema";
import { startBot, client } from './discord/index';
import { deployCommands } from './discord/deploy-commands';

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize Discord bot if token is provided
  if (process.env.DISCORD_TOKEN) {
    await deployCommands();
    await startBot();
  } else {
    console.warn('DISCORD_TOKEN çevre değişkeni ayarlanmamış. Bot başlatılamıyor.');
  }

  // Status endpoint
  app.get('/api/status', async (req, res) => {
    try {
      const botStatus = client ? (client.isReady() ? 'online' : 'offline') : 'not_started';
      
      res.json({ 
        status: 'ok',
        bot: botStatus,
        version: '1.0.0'
      });
    } catch (error) {
      console.error('Error in status endpoint:', error);
      res.status(500).json({ message: 'Sunucu durumu alınırken hata oluştu' });
    }
  });

  // Müttefikler (Allies) endpoints
  app.get('/api/muteffikler', async (req, res) => {
    try {
      const muteffikler = await storage.getMuteffikler();
      res.json(muteffikler);
    } catch (error) {
      console.error('Error fetching muteffikler:', error);
      res.status(500).json({ message: 'Müttefikler alınırken hata oluştu' });
    }
  });

  app.post('/api/muteffikler', async (req, res) => {
    try {
      const data = muteffiklerInsertSchema.parse(req.body);
      const muttefik = await storage.createMuteffikler(data);
      res.status(201).json(muttefik);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      console.error('Error creating muttefik:', error);
      res.status(500).json({ message: 'Müttefik oluşturulurken hata oluştu' });
    }
  });

  app.get('/api/muteffikler/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const muttefik = await storage.getMuteffikById(id);
      
      if (!muttefik) {
        return res.status(404).json({ message: 'Müttefik bulunamadı' });
      }
      
      res.json(muttefik);
    } catch (error) {
      console.error('Error fetching muttefik:', error);
      res.status(500).json({ message: 'Müttefik alınırken hata oluştu' });
    }
  });

  app.put('/api/muteffikler/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const data = muteffiklerInsertSchema.parse(req.body);
      
      const existingMuttefik = await storage.getMuteffikById(id);
      
      if (!existingMuttefik) {
        return res.status(404).json({ message: 'Müttefik bulunamadı' });
      }
      
      const updatedMuttefik = await storage.updateMuteffikler(id, data);
      res.json(updatedMuttefik);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      console.error('Error updating muttefik:', error);
      res.status(500).json({ message: 'Müttefik güncellenirken hata oluştu' });
    }
  });

  app.delete('/api/muteffikler/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      const existingMuttefik = await storage.getMuteffikById(id);
      
      if (!existingMuttefik) {
        return res.status(404).json({ message: 'Müttefik bulunamadı' });
      }
      
      await storage.deleteMuteffikler(id);
      res.status(204).end();
    } catch (error) {
      console.error('Error deleting muttefik:', error);
      res.status(500).json({ message: 'Müttefik silinirken hata oluştu' });
    }
  });

  // Düşmanlar (Enemies) endpoints
  app.get('/api/dusmanlar', async (req, res) => {
    try {
      const dusmanlar = await storage.getDusmanlar();
      res.json(dusmanlar);
    } catch (error) {
      console.error('Error fetching dusmanlar:', error);
      res.status(500).json({ message: 'Düşmanlar alınırken hata oluştu' });
    }
  });

  app.post('/api/dusmanlar', async (req, res) => {
    try {
      const data = dusmanlarInsertSchema.parse(req.body);
      const dusman = await storage.createDusman(data);
      res.status(201).json(dusman);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      console.error('Error creating dusman:', error);
      res.status(500).json({ message: 'Düşman oluşturulurken hata oluştu' });
    }
  });

  app.get('/api/dusmanlar/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const dusman = await storage.getDusmanById(id);
      
      if (!dusman) {
        return res.status(404).json({ message: 'Düşman bulunamadı' });
      }
      
      res.json(dusman);
    } catch (error) {
      console.error('Error fetching dusman:', error);
      res.status(500).json({ message: 'Düşman alınırken hata oluştu' });
    }
  });

  app.put('/api/dusmanlar/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const data = dusmanlarInsertSchema.parse(req.body);
      
      const existingDusman = await storage.getDusmanById(id);
      
      if (!existingDusman) {
        return res.status(404).json({ message: 'Düşman bulunamadı' });
      }
      
      const updatedDusman = await storage.updateDusman(id, data);
      res.json(updatedDusman);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      console.error('Error updating dusman:', error);
      res.status(500).json({ message: 'Düşman güncellenirken hata oluştu' });
    }
  });

  app.delete('/api/dusmanlar/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      const existingDusman = await storage.getDusmanById(id);
      
      if (!existingDusman) {
        return res.status(404).json({ message: 'Düşman bulunamadı' });
      }
      
      await storage.deleteDusman(id);
      res.status(204).end();
    } catch (error) {
      console.error('Error deleting dusman:', error);
      res.status(500).json({ message: 'Düşman silinirken hata oluştu' });
    }
  });

  // AS Kadro (Team Members) endpoints
  app.get('/api/askadro', async (req, res) => {
    try {
      const asKadro = await storage.getAsKadro();
      res.json(asKadro);
    } catch (error) {
      console.error('Error fetching askadro:', error);
      res.status(500).json({ message: 'AS Kadro üyeleri alınırken hata oluştu' });
    }
  });

  app.post('/api/askadro', async (req, res) => {
    try {
      const data = asKadroInsertSchema.parse(req.body);
      const member = await storage.createAsKadro(data);
      res.status(201).json(member);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      console.error('Error creating askadro member:', error);
      res.status(500).json({ message: 'AS Kadro üyesi oluşturulurken hata oluştu' });
    }
  });

  app.get('/api/askadro/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const member = await storage.getAsKadroById(id);
      
      if (!member) {
        return res.status(404).json({ message: 'AS Kadro üyesi bulunamadı' });
      }
      
      res.json(member);
    } catch (error) {
      console.error('Error fetching askadro member:', error);
      res.status(500).json({ message: 'AS Kadro üyesi alınırken hata oluştu' });
    }
  });

  app.put('/api/askadro/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const data = asKadroInsertSchema.parse(req.body);
      
      const existingMember = await storage.getAsKadroById(id);
      
      if (!existingMember) {
        return res.status(404).json({ message: 'AS Kadro üyesi bulunamadı' });
      }
      
      const updatedMember = await storage.updateAsKadro(id, data);
      res.json(updatedMember);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      console.error('Error updating askadro member:', error);
      res.status(500).json({ message: 'AS Kadro üyesi güncellenirken hata oluştu' });
    }
  });

  app.delete('/api/askadro/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      const existingMember = await storage.getAsKadroById(id);
      
      if (!existingMember) {
        return res.status(404).json({ message: 'AS Kadro üyesi bulunamadı' });
      }
      
      await storage.deleteAsKadro(id);
      res.status(204).end();
    } catch (error) {
      console.error('Error deleting askadro member:', error);
      res.status(500).json({ message: 'AS Kadro üyesi silinirken hata oluştu' });
    }
  });

  // KS Bilgi (Clan Info) endpoints
  app.get('/api/ksbilgi', async (req, res) => {
    try {
      const ksBilgi = await storage.getKsBilgi();
      res.json(ksBilgi);
    } catch (error) {
      console.error('Error fetching ksbilgi:', error);
      res.status(500).json({ message: 'KS Bilgi alınırken hata oluştu' });
    }
  });

  app.post('/api/ksbilgi', async (req, res) => {
    try {
      const data = ksBilgiInsertSchema.parse(req.body);
      const info = await storage.createKsBilgi(data);
      res.status(201).json(info);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      console.error('Error creating ksbilgi:', error);
      res.status(500).json({ message: 'KS Bilgi oluşturulurken hata oluştu' });
    }
  });

  app.get('/api/ksbilgi/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const info = await storage.getKsBilgiById(id);
      
      if (!info) {
        return res.status(404).json({ message: 'KS Bilgi bulunamadı' });
      }
      
      res.json(info);
    } catch (error) {
      console.error('Error fetching ksbilgi:', error);
      res.status(500).json({ message: 'KS Bilgi alınırken hata oluştu' });
    }
  });

  app.put('/api/ksbilgi/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const data = ksBilgiInsertSchema.parse(req.body);
      
      const existingInfo = await storage.getKsBilgiById(id);
      
      if (!existingInfo) {
        return res.status(404).json({ message: 'KS Bilgi bulunamadı' });
      }
      
      const updatedInfo = await storage.updateKsBilgi(id, data);
      res.json(updatedInfo);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      console.error('Error updating ksbilgi:', error);
      res.status(500).json({ message: 'KS Bilgi güncellenirken hata oluştu' });
    }
  });

  app.delete('/api/ksbilgi/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      const existingInfo = await storage.getKsBilgiById(id);
      
      if (!existingInfo) {
        return res.status(404).json({ message: 'KS Bilgi bulunamadı' });
      }
      
      await storage.deleteKsBilgi(id);
      res.status(204).end();
    } catch (error) {
      console.error('Error deleting ksbilgi:', error);
      res.status(500).json({ message: 'KS Bilgi silinirken hata oluştu' });
    }
  });

  // Sunucular (Servers) endpoints
  app.get('/api/sunucular', async (req, res) => {
    try {
      const sunucular = await storage.getSunucular();
      res.json(sunucular);
    } catch (error) {
      console.error('Error fetching sunucular:', error);
      res.status(500).json({ message: 'Sunucular alınırken hata oluştu' });
    }
  });

  app.post('/api/sunucular', async (req, res) => {
    try {
      const data = sunucularInsertSchema.parse(req.body);
      const server = await storage.createSunucu(data);
      res.status(201).json(server);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      console.error('Error creating sunucu:', error);
      res.status(500).json({ message: 'Sunucu oluşturulurken hata oluştu' });
    }
  });

  app.get('/api/sunucular/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const server = await storage.getSunucuById(id);
      
      if (!server) {
        return res.status(404).json({ message: 'Sunucu bulunamadı' });
      }
      
      res.json(server);
    } catch (error) {
      console.error('Error fetching sunucu:', error);
      res.status(500).json({ message: 'Sunucu alınırken hata oluştu' });
    }
  });

  app.put('/api/sunucular/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const data = sunucularInsertSchema.parse(req.body);
      
      const existingServer = await storage.getSunucuById(id);
      
      if (!existingServer) {
        return res.status(404).json({ message: 'Sunucu bulunamadı' });
      }
      
      const updatedServer = await storage.updateSunucu(id, data);
      res.json(updatedServer);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      console.error('Error updating sunucu:', error);
      res.status(500).json({ message: 'Sunucu güncellenirken hata oluştu' });
    }
  });

  app.delete('/api/sunucular/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      const existingServer = await storage.getSunucuById(id);
      
      if (!existingServer) {
        return res.status(404).json({ message: 'Sunucu bulunamadı' });
      }
      
      await storage.deleteSunucu(id);
      res.status(204).end();
    } catch (error) {
      console.error('Error deleting sunucu:', error);
      res.status(500).json({ message: 'Sunucu silinirken hata oluştu' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
