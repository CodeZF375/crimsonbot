import { SlashCommandBuilder } from 'discord.js';
import { storage } from '../storage';

// Helper function to create embed data
const createEmbedData = (title, color, data) => {
  return {
    title,
    color,
    fields: data.map(item => {
      const field = { name: item.isim || item.baslik, value: '', inline: false };
      
      if (item.tur) field.value += `**Tür:** ${item.tur}\n`;
      if (item.bilgi) field.value += `**Bilgi:** ${item.bilgi}\n`;
      if (item.neden) field.value += `**Neden:** ${item.neden}\n`;
      if (item.rol) field.value += `**Rol:** ${item.rol}\n`;
      if (item.girisTarihi) field.value += `**Giriş Tarihi:** ${item.girisTarihi}\n`;
      if (item.ip) field.value += `**IP:** ${item.ip}\n`;
      if (item.port) field.value += `**Port:** ${item.port}\n`;
      
      // If no specific field was set, use the item itself as value
      if (!field.value && typeof item === 'string') field.value = item;
      if (!field.value) field.value = 'Bilgi yok';
      
      return field;
    }),
    timestamp: new Date().toISOString(),
    footer: {
      text: 'Klan Yönetim Botu'
    }
  };
};

// Yardım (Help) command
const yardimCommand = {
  data: new SlashCommandBuilder()
    .setName('yardım')
    .setDescription('Tüm komutları listeler'),
  async execute(interaction) {
    await interaction.reply({
      embeds: [{
        title: '📚 Komut Listesi',
        color: 0x5865F2,
        description: 'Aşağıdaki komutları kullanabilirsiniz:',
        fields: [
          { name: '/müteffikler', value: 'Müttefik klan ve oyuncuları listeler', inline: true },
          { name: '/müteffikler ekle', value: 'Yeni bir müttefik ekler', inline: true },
          { name: '/müteffikler kaldır', value: 'Bir müttefiği kaldırır', inline: true },
          { name: '/düşmanlar', value: 'Düşman klan ve oyuncuları listeler', inline: true },
          { name: '/düşmanlar ekle', value: 'Yeni bir düşman ekler', inline: true },
          { name: '/düşmanlar kaldır', value: 'Bir düşmanı kaldırır', inline: true },
          { name: '/askadro', value: 'AS kadrosunu listeler', inline: true },
          { name: '/askadro ekle', value: 'AS kadrosuna üye ekler', inline: true },
          { name: '/askadro kaldır', value: 'AS kadrosundan üye kaldırır', inline: true },
          { name: '/ksbilgi', value: 'Klan savaşı bilgilerini listeler', inline: true },
          { name: '/ksbilgi ekle', value: 'Yeni bir KS bilgisi ekler', inline: true },
          { name: '/ksbilgi kaldır', value: 'Bir KS bilgisini kaldırır', inline: true },
          { name: '/sunucular', value: 'Sunucuları listeler', inline: true },
          { name: '/sunucular ekle', value: 'Yeni bir sunucu ekler', inline: true },
          { name: '/sunucular kaldır', value: 'Bir sunucuyu kaldırır', inline: true },
        ],
        timestamp: new Date().toISOString(),
        footer: {
          text: 'Klan Yönetim Botu'
        }
      }]
    });
  }
};

// Müttefikler (Allies) commands
const muteffiklerCommand = {
  data: new SlashCommandBuilder()
    .setName('müteffikler')
    .setDescription('Müttefik klanları ve oyuncuları yönetir')
    .addSubcommand(subcommand =>
      subcommand
        .setName('liste')
        .setDescription('Tüm müttefikleri listeler')
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('ekle')
        .setDescription('Yeni bir müttefik ekler')
        .addStringOption(option => 
          option.setName('isim')
            .setDescription('Müttefiğin ismi')
            .setRequired(true)
        )
        .addStringOption(option => 
          option.setName('tür')
            .setDescription('Müttefiğin türü')
            .setRequired(true)
            .addChoices(
              { name: 'Klan', value: 'Klan' },
              { name: 'Oyuncu', value: 'Oyuncu' }
            )
        )
        .addStringOption(option => 
          option.setName('bilgi')
            .setDescription('Müttefik hakkında bilgi')
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('kaldır')
        .setDescription('Bir müttefiği kaldırır')
        .addStringOption(option => 
          option.setName('isim')
            .setDescription('Kaldırılacak müttefiğin ismi')
            .setRequired(true)
        )
    ),
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    
    if (subcommand === 'liste') {
      try {
        const muteffikler = await storage.getMuteffikler();
        
        if (muteffikler.length === 0) {
          return interaction.reply('Hiç müttefik bulunamadı.');
        }
        
        await interaction.reply({
          embeds: [createEmbedData('🤝 Müttefikler', 0x5865F2, muteffikler)]
        });
      } catch (error) {
        console.error('Müttefikler listelenirken hata:', error);
        await interaction.reply({ content: 'Müttefikler listelenirken bir hata oluştu.', ephemeral: true });
      }
    } 
    else if (subcommand === 'ekle') {
      try {
        const isim = interaction.options.getString('isim');
        const tur = interaction.options.getString('tür');
        const bilgi = interaction.options.getString('bilgi') || '';
        
        const existingMuttefik = await storage.getMuteffikByName(isim);
        
        if (existingMuttefik) {
          return interaction.reply({ content: `"${isim}" isimli müttefik zaten mevcut.`, ephemeral: true });
        }
        
        const newMuttefik = await storage.createMuteffikler({ isim, tur, bilgi });
        
        await interaction.reply({ content: `"${isim}" isimli müttefik başarıyla eklendi.`, ephemeral: true });
      } catch (error) {
        console.error('Müttefik eklenirken hata:', error);
        await interaction.reply({ content: 'Müttefik eklenirken bir hata oluştu.', ephemeral: true });
      }
    } 
    else if (subcommand === 'kaldır') {
      try {
        const isim = interaction.options.getString('isim');
        
        const existingMuttefik = await storage.getMuteffikByName(isim);
        
        if (!existingMuttefik) {
          return interaction.reply({ content: `"${isim}" isimli müttefik bulunamadı.`, ephemeral: true });
        }
        
        await storage.deleteMuteffikler(existingMuttefik.id);
        
        await interaction.reply({ content: `"${isim}" isimli müttefik başarıyla kaldırıldı.`, ephemeral: true });
      } catch (error) {
        console.error('Müttefik kaldırılırken hata:', error);
        await interaction.reply({ content: 'Müttefik kaldırılırken bir hata oluştu.', ephemeral: true });
      }
    }
  }
};

// Düşmanlar (Enemies) commands
const dusmanlarCommand = {
  data: new SlashCommandBuilder()
    .setName('düşmanlar')
    .setDescription('Düşman klanları ve oyuncuları yönetir')
    .addSubcommand(subcommand =>
      subcommand
        .setName('liste')
        .setDescription('Tüm düşmanları listeler')
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('ekle')
        .setDescription('Yeni bir düşman ekler')
        .addStringOption(option => 
          option.setName('isim')
            .setDescription('Düşmanın ismi')
            .setRequired(true)
        )
        .addStringOption(option => 
          option.setName('tür')
            .setDescription('Düşmanın türü')
            .setRequired(true)
            .addChoices(
              { name: 'Klan', value: 'Klan' },
              { name: 'Oyuncu', value: 'Oyuncu' }
            )
        )
        .addStringOption(option => 
          option.setName('neden')
            .setDescription('Düşmanlık nedeni')
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('kaldır')
        .setDescription('Bir düşmanı kaldırır')
        .addStringOption(option => 
          option.setName('isim')
            .setDescription('Kaldırılacak düşmanın ismi')
            .setRequired(true)
        )
    ),
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    
    if (subcommand === 'liste') {
      try {
        const dusmanlar = await storage.getDusmanlar();
        
        if (dusmanlar.length === 0) {
          return interaction.reply('Hiç düşman bulunamadı.');
        }
        
        await interaction.reply({
          embeds: [createEmbedData('⚔️ Düşmanlar', 0xF04747, dusmanlar)]
        });
      } catch (error) {
        console.error('Düşmanlar listelenirken hata:', error);
        await interaction.reply({ content: 'Düşmanlar listelenirken bir hata oluştu.', ephemeral: true });
      }
    } 
    else if (subcommand === 'ekle') {
      try {
        const isim = interaction.options.getString('isim');
        const tur = interaction.options.getString('tür');
        const neden = interaction.options.getString('neden') || '';
        
        const existingDusman = await storage.getDusmanByName(isim);
        
        if (existingDusman) {
          return interaction.reply({ content: `"${isim}" isimli düşman zaten mevcut.`, ephemeral: true });
        }
        
        const newDusman = await storage.createDusman({ isim, tur, neden });
        
        await interaction.reply({ content: `"${isim}" isimli düşman başarıyla eklendi.`, ephemeral: true });
      } catch (error) {
        console.error('Düşman eklenirken hata:', error);
        await interaction.reply({ content: 'Düşman eklenirken bir hata oluştu.', ephemeral: true });
      }
    } 
    else if (subcommand === 'kaldır') {
      try {
        const isim = interaction.options.getString('isim');
        
        const existingDusman = await storage.getDusmanByName(isim);
        
        if (!existingDusman) {
          return interaction.reply({ content: `"${isim}" isimli düşman bulunamadı.`, ephemeral: true });
        }
        
        await storage.deleteDusman(existingDusman.id);
        
        await interaction.reply({ content: `"${isim}" isimli düşman başarıyla kaldırıldı.`, ephemeral: true });
      } catch (error) {
        console.error('Düşman kaldırılırken hata:', error);
        await interaction.reply({ content: 'Düşman kaldırılırken bir hata oluştu.', ephemeral: true });
      }
    }
  }
};

// AS Kadro (Team) commands
const asKadroCommand = {
  data: new SlashCommandBuilder()
    .setName('askadro')
    .setDescription('AS kadrosunu yönetir')
    .addSubcommand(subcommand =>
      subcommand
        .setName('liste')
        .setDescription('Tüm AS kadro üyelerini listeler')
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('ekle')
        .setDescription('AS kadrosuna yeni üye ekler')
        .addStringOption(option => 
          option.setName('isim')
            .setDescription('Üyenin ismi')
            .setRequired(true)
        )
        .addStringOption(option => 
          option.setName('rol')
            .setDescription('Üyenin rolü')
            .setRequired(true)
        )
        .addStringOption(option => 
          option.setName('giriş_tarihi')
            .setDescription('Giriş tarihi (gg.aa.yyyy)')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('kaldır')
        .setDescription('AS kadrosundan üye kaldırır')
        .addStringOption(option => 
          option.setName('isim')
            .setDescription('Kaldırılacak üyenin ismi')
            .setRequired(true)
        )
    ),
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    
    if (subcommand === 'liste') {
      try {
        const asKadro = await storage.getAsKadro();
        
        if (asKadro.length === 0) {
          return interaction.reply('AS kadrosunda hiç üye bulunamadı.');
        }
        
        await interaction.reply({
          embeds: [createEmbedData('👥 AS Kadro', 0x43B581, asKadro)]
        });
      } catch (error) {
        console.error('AS kadro listelenirken hata:', error);
        await interaction.reply({ content: 'AS kadro listelenirken bir hata oluştu.', ephemeral: true });
      }
    } 
    else if (subcommand === 'ekle') {
      try {
        const isim = interaction.options.getString('isim');
        const rol = interaction.options.getString('rol');
        const girisTarihi = interaction.options.getString('giriş_tarihi');
        
        const existingMember = await storage.getAsKadroByName(isim);
        
        if (existingMember) {
          return interaction.reply({ content: `"${isim}" isimli üye zaten AS kadrosunda mevcut.`, ephemeral: true });
        }
        
        const newMember = await storage.createAsKadro({ isim, rol, girisTarihi });
        
        await interaction.reply({ content: `"${isim}" isimli üye AS kadrosuna başarıyla eklendi.`, ephemeral: true });
      } catch (error) {
        console.error('AS kadro üyesi eklenirken hata:', error);
        await interaction.reply({ content: 'AS kadro üyesi eklenirken bir hata oluştu.', ephemeral: true });
      }
    } 
    else if (subcommand === 'kaldır') {
      try {
        const isim = interaction.options.getString('isim');
        
        const existingMember = await storage.getAsKadroByName(isim);
        
        if (!existingMember) {
          return interaction.reply({ content: `"${isim}" isimli üye AS kadrosunda bulunamadı.`, ephemeral: true });
        }
        
        await storage.deleteAsKadro(existingMember.id);
        
        await interaction.reply({ content: `"${isim}" isimli üye AS kadrosundan başarıyla kaldırıldı.`, ephemeral: true });
      } catch (error) {
        console.error('AS kadro üyesi kaldırılırken hata:', error);
        await interaction.reply({ content: 'AS kadro üyesi kaldırılırken bir hata oluştu.', ephemeral: true });
      }
    }
  }
};

// KS Bilgi (Clan Info) commands
const ksBilgiCommand = {
  data: new SlashCommandBuilder()
    .setName('ksbilgi')
    .setDescription('Klan savaşı bilgilerini yönetir')
    .addSubcommand(subcommand =>
      subcommand
        .setName('liste')
        .setDescription('Tüm klan savaşı bilgilerini listeler')
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('ekle')
        .setDescription('Yeni bir KS bilgisi ekler')
        .addStringOption(option => 
          option.setName('başlık')
            .setDescription('Bilgi başlığı')
            .setRequired(true)
        )
        .addStringOption(option => 
          option.setName('bilgi')
            .setDescription('Bilgi içeriği')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('kaldır')
        .setDescription('Bir KS bilgisini kaldırır')
        .addStringOption(option => 
          option.setName('başlık')
            .setDescription('Kaldırılacak bilginin başlığı')
            .setRequired(true)
        )
    ),
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    
    if (subcommand === 'liste') {
      try {
        const ksBilgi = await storage.getKsBilgi();
        
        if (ksBilgi.length === 0) {
          return interaction.reply('Hiç KS bilgisi bulunamadı.');
        }
        
        await interaction.reply({
          embeds: [createEmbedData('ℹ️ Klan Savaşı Bilgileri', 0x7289DA, ksBilgi)]
        });
      } catch (error) {
        console.error('KS bilgileri listelenirken hata:', error);
        await interaction.reply({ content: 'KS bilgileri listelenirken bir hata oluştu.', ephemeral: true });
      }
    } 
    else if (subcommand === 'ekle') {
      try {
        const baslik = interaction.options.getString('başlık');
        const bilgi = interaction.options.getString('bilgi');
        
        const existingInfo = await storage.getKsBilgiByTitle(baslik);
        
        if (existingInfo) {
          return interaction.reply({ content: `"${baslik}" başlıklı bilgi zaten mevcut.`, ephemeral: true });
        }
        
        const newInfo = await storage.createKsBilgi({ baslik, bilgi });
        
        await interaction.reply({ content: `"${baslik}" başlıklı bilgi başarıyla eklendi.`, ephemeral: true });
      } catch (error) {
        console.error('KS bilgisi eklenirken hata:', error);
        await interaction.reply({ content: 'KS bilgisi eklenirken bir hata oluştu.', ephemeral: true });
      }
    } 
    else if (subcommand === 'kaldır') {
      try {
        const baslik = interaction.options.getString('başlık');
        
        const existingInfo = await storage.getKsBilgiByTitle(baslik);
        
        if (!existingInfo) {
          return interaction.reply({ content: `"${baslik}" başlıklı bilgi bulunamadı.`, ephemeral: true });
        }
        
        await storage.deleteKsBilgi(existingInfo.id);
        
        await interaction.reply({ content: `"${baslik}" başlıklı bilgi başarıyla kaldırıldı.`, ephemeral: true });
      } catch (error) {
        console.error('KS bilgisi kaldırılırken hata:', error);
        await interaction.reply({ content: 'KS bilgisi kaldırılırken bir hata oluştu.', ephemeral: true });
      }
    }
  }
};

// Sunucular (Servers) commands
const sunucularCommand = {
  data: new SlashCommandBuilder()
    .setName('sunucular')
    .setDescription('Oynadığımız sunucuları yönetir')
    .addSubcommand(subcommand =>
      subcommand
        .setName('liste')
        .setDescription('Tüm sunucuları listeler')
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('ekle')
        .setDescription('Yeni bir sunucu ekler')
        .addStringOption(option => 
          option.setName('isim')
            .setDescription('Sunucu ismi')
            .setRequired(true)
        )
        .addStringOption(option => 
          option.setName('ip')
            .setDescription('Sunucu IP adresi')
            .setRequired(true)
        )
        .addStringOption(option => 
          option.setName('port')
            .setDescription('Sunucu portu')
        )
        .addStringOption(option => 
          option.setName('bilgi')
            .setDescription('Sunucu hakkında bilgi')
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('kaldır')
        .setDescription('Bir sunucuyu kaldırır')
        .addStringOption(option => 
          option.setName('isim')
            .setDescription('Kaldırılacak sunucunun ismi')
            .setRequired(true)
        )
    ),
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    
    if (subcommand === 'liste') {
      try {
        const sunucular = await storage.getSunucular();
        
        if (sunucular.length === 0) {
          return interaction.reply('Hiç sunucu bulunamadı.');
        }
        
        await interaction.reply({
          embeds: [createEmbedData('🖥️ Oynadığımız Sunucular', 0xFAA61A, sunucular)]
        });
      } catch (error) {
        console.error('Sunucular listelenirken hata:', error);
        await interaction.reply({ content: 'Sunucular listelenirken bir hata oluştu.', ephemeral: true });
      }
    } 
    else if (subcommand === 'ekle') {
      try {
        const isim = interaction.options.getString('isim');
        const ip = interaction.options.getString('ip');
        const port = interaction.options.getString('port') || '';
        const bilgi = interaction.options.getString('bilgi') || '';
        
        const existingServer = await storage.getSunucuByName(isim);
        
        if (existingServer) {
          return interaction.reply({ content: `"${isim}" isimli sunucu zaten mevcut.`, ephemeral: true });
        }
        
        const newServer = await storage.createSunucu({ isim, ip, port, bilgi });
        
        await interaction.reply({ content: `"${isim}" isimli sunucu başarıyla eklendi.`, ephemeral: true });
      } catch (error) {
        console.error('Sunucu eklenirken hata:', error);
        await interaction.reply({ content: 'Sunucu eklenirken bir hata oluştu.', ephemeral: true });
      }
    } 
    else if (subcommand === 'kaldır') {
      try {
        const isim = interaction.options.getString('isim');
        
        const existingServer = await storage.getSunucuByName(isim);
        
        if (!existingServer) {
          return interaction.reply({ content: `"${isim}" isimli sunucu bulunamadı.`, ephemeral: true });
        }
        
        await storage.deleteSunucu(existingServer.id);
        
        await interaction.reply({ content: `"${isim}" isimli sunucu başarıyla kaldırıldı.`, ephemeral: true });
      } catch (error) {
        console.error('Sunucu kaldırılırken hata:', error);
        await interaction.reply({ content: 'Sunucu kaldırılırken bir hata oluştu.', ephemeral: true });
      }
    }
  }
};

// Export all commands
export const commands = [
  yardimCommand,
  muteffiklerCommand,
  dusmanlarCommand,
  asKadroCommand,
  ksBilgiCommand,
  sunucularCommand
];
