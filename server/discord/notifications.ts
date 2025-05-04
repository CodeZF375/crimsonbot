import { TextChannel, EmbedBuilder, Client } from 'discord.js';
import { BOT_CONFIG, NOTIFICATION_CHANNELS } from './config';

// Types of notification events
type NotificationEvent = {
  type: 'create' | 'update' | 'delete';
  category: 'muteffikler' | 'dusmanlar' | 'askadro' | 'ksbilgi' | 'sunucular';
  data: any;
  user?: string;
};

// Category-specific titles and colors
const CATEGORY_CONFIG = {
  muteffikler: {
    title: '🤝 Müttefikler',
    color: BOT_CONFIG.colors.ally,
    createMessage: (name: string) => `**${name}** müttefik olarak eklendi`,
    updateMessage: (name: string) => `**${name}** müttefik bilgileri güncellendi`,
    deleteMessage: (name: string) => `**${name}** artık müttefik değil`,
  },
  dusmanlar: {
    title: '⚔️ Düşmanlar',
    color: BOT_CONFIG.colors.enemy,
    createMessage: (name: string) => `**${name}** düşman olarak eklendi`,
    updateMessage: (name: string) => `**${name}** düşman bilgileri güncellendi`,
    deleteMessage: (name: string) => `**${name}** artık düşman değil`,
  },
  askadro: {
    title: '👥 AS Kadro',
    color: BOT_CONFIG.colors.team,
    createMessage: (name: string) => `**${name}** AS kadrosuna eklendi`,
    updateMessage: (name: string) => `**${name}** kadro bilgileri güncellendi`,
    deleteMessage: (name: string) => `**${name}** AS kadrosundan çıkarıldı`,
  },
  ksbilgi: {
    title: 'ℹ️ Klan Savaşı Bilgileri',
    color: BOT_CONFIG.colors.info,
    createMessage: (title: string) => `**${title}** bilgisi eklendi`,
    updateMessage: (title: string) => `**${title}** bilgisi güncellendi`,
    deleteMessage: (title: string) => `**${title}** bilgisi silindi`,
  },
  sunucular: {
    title: '🖥️ Sunucular',
    color: BOT_CONFIG.colors.info,
    createMessage: (name: string) => `**${name}** sunucusu eklendi`,
    updateMessage: (name: string) => `**${name}** sunucu bilgileri güncellendi`,
    deleteMessage: (name: string) => `**${name}** sunucusu kaldırıldı`,
  },
};

/**
 * Get the notification channel from a Discord client for a specific category
 */
export async function getNotificationChannel(client: Client, category?: 'muteffikler' | 'dusmanlar' | 'askadro' | 'ksbilgi' | 'sunucular'): Promise<TextChannel | null> {
  if (!BOT_CONFIG.sendNotifications) {
    return null;
  }
  
  // Get the channel ID based on category or use default
  let channelId = '';
  if (category && NOTIFICATION_CHANNELS[category]) {
    channelId = NOTIFICATION_CHANNELS[category];
  } else {
    // Fall back to default channel if category-specific channel is not set
    channelId = NOTIFICATION_CHANNELS.default;
  }
  
  // If no channel ID available, return null
  if (!channelId) {
    return null;
  }
  
  try {
    // Get the channel by ID
    const channel = await client.channels.fetch(channelId);
    if (!channel || !channel.isTextBased() || channel.isDMBased()) {
      console.error(`Notification channel for ${category || 'default'} is not a text channel`, channelId);
      return null;
    }
    
    return channel as TextChannel;
  } catch (error) {
    console.error(`Error fetching notification channel for ${category || 'default'}:`, error);
    return null;
  }
}

/**
 * Send a notification to the designated Discord channel
 */
export async function sendNotification(client: Client, event: NotificationEvent): Promise<void> {
  if (!BOT_CONFIG.sendNotifications) {
    return;
  }
  
  const channel = await getNotificationChannel(client, event.category);
  if (!channel) {
    return;
  }
  
  try {
    const config = CATEGORY_CONFIG[event.category];
    const embed = new EmbedBuilder()
      .setColor(config.color)
      .setTitle(config.title)
      .setTimestamp();
    
    // Get the name/title depending on the category
    const itemName = event.data.isim || event.data.baslik || 'Bilinmeyen';
    
    // Set description based on event type
    switch (event.type) {
      case 'create':
        embed.setDescription(config.createMessage(itemName));
        break;
      case 'update':
        embed.setDescription(config.updateMessage(itemName));
        break;
      case 'delete':
        embed.setDescription(config.deleteMessage(itemName));
        break;
    }
    
    // Add fields based on data properties
    if (event.type !== 'delete') {
      if (event.data.tur) {
        embed.addFields({ name: 'Tür', value: event.data.tur, inline: true });
      }
      if (event.data.bilgi) {
        embed.addFields({ name: 'Bilgi', value: event.data.bilgi, inline: true });
      }
      if (event.data.neden) {
        embed.addFields({ name: 'Neden', value: event.data.neden, inline: true });
      }
      if (event.data.rol) {
        embed.addFields({ name: 'Rol', value: event.data.rol, inline: true });
      }
      if (event.data.girisTarihi) {
        embed.addFields({ name: 'Giriş Tarihi', value: event.data.girisTarihi, inline: true });
      }
      if (event.data.ip) {
        embed.addFields({ name: 'IP', value: event.data.ip, inline: true });
      }
      if (event.data.port) {
        embed.addFields({ name: 'Port', value: event.data.port ? event.data.port.toString() : '', inline: true });
      }
    }
    
    // Add footer
    embed.setFooter({ text: BOT_CONFIG.footerText });
    
    // If there's a user who performed the action, mention them
    let content = '';
    if (event.user) {
      content = `<@${event.user}> tarafından yapılan değişiklik:`;
    }
    
    // Send the message to the channel
    await channel.send({ content, embeds: [embed] });
  } catch (error) {
    console.error('Error sending notification:', error);
  }
}
