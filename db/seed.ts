import { db } from "./index";
import * as schema from "@shared/schema";

async function seed() {
  try {
    // Seed muteffikler (allies)
    const muteffikData = [
      { isim: "GoldenClan", tur: "Klan", bilgi: "Kurucusu: GoldenLeader" },
      { isim: "SilverAlliance", tur: "Klan", bilgi: "Savaş günleri: Çarşamba, Cumartesi" },
      { isim: "WarMaster42", tur: "Oyuncu", bilgi: "Discord: WarMaster#1234" }
    ];
    
    for (const item of muteffikData) {
      const existingItem = await db.query.muteffikler.findFirst({
        where: (fields, { eq }) => eq(fields.isim, item.isim)
      });
      
      if (!existingItem) {
        await db.insert(schema.muteffikler).values(item);
        console.log(`Added muttefik: ${item.isim}`);
      }
    }
    
    // Seed dusmanlar (enemies)
    const dusmanData = [
      { isim: "DarkLegion", tur: "Klan", neden: "Savaş kurallarını çiğneme" },
      { isim: "ShadowKiller", tur: "Oyuncu", neden: "İttifak ihlali" }
    ];
    
    for (const item of dusmanData) {
      const existingItem = await db.query.dusmanlar.findFirst({
        where: (fields, { eq }) => eq(fields.isim, item.isim)
      });
      
      if (!existingItem) {
        await db.insert(schema.dusmanlar).values(item);
        console.log(`Added dusman: ${item.isim}`);
      }
    }
    
    // Seed as_kadro (team members)
    const asKadroData = [
      { isim: "ErtuğrulBey", rol: "Lider", girisTarihi: "12.05.2022" },
      { isim: "AlpAslan", rol: "Savaşçı", girisTarihi: "23.08.2022" }
    ];
    
    for (const item of asKadroData) {
      const existingItem = await db.query.asKadro.findFirst({
        where: (fields, { eq }) => eq(fields.isim, item.isim)
      });
      
      if (!existingItem) {
        await db.insert(schema.asKadro).values(item);
        console.log(`Added as_kadro member: ${item.isim}`);
      }
    }
    
    // Seed ks_bilgi (clan info)
    const ksBilgiData = [
      { baslik: "Savaş Kuralları", bilgi: "Klan savaşlarında herkes ilk 12 saat içinde saldırısını yapmalıdır." },
      { baslik: "Haftalık Toplantı", bilgi: "Her Pazar saat 20:00'de Discord üzerinden toplantı yapılacaktır." }
    ];
    
    for (const item of ksBilgiData) {
      const existingItem = await db.query.ksBilgi.findFirst({
        where: (fields, { eq }) => eq(fields.baslik, item.baslik)
      });
      
      if (!existingItem) {
        await db.insert(schema.ksBilgi).values(item);
        console.log(`Added ks_bilgi: ${item.baslik}`);
      }
    }
    
    // Seed sunucular (servers)
    const sunucularData = [
      { isim: "TurkMMO", ip: "play.turkmmo.com", port: "25565", bilgi: "Ana sunucumuz" },
      { isim: "GamersHub", ip: "hub.gamersworld.net", port: "27015", bilgi: "Alternatif sunucu" }
    ];
    
    for (const item of sunucularData) {
      const existingItem = await db.query.sunucular.findFirst({
        where: (fields, { eq }) => eq(fields.isim, item.isim)
      });
      
      if (!existingItem) {
        await db.insert(schema.sunucular).values(item);
        console.log(`Added sunucu: ${item.isim}`);
      }
    }
    
    console.log("Database seeding completed successfully");
  } catch (error) {
    console.error("Error during database seeding:", error);
  }
}

seed();
