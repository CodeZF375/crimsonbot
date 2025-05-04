// Discord bot configuration

// Notification channel IDs where update messages will be sent
// These should be set to the actual channel IDs from your Discord server
export const NOTIFICATION_CHANNELS = {
  muteffikler: process.env.DISCORD_MUTEFFIKLER_CHANNEL || '',
  dusmanlar: process.env.DISCORD_DUSMANLAR_CHANNEL || '',
  askadro: process.env.DISCORD_ASKADRO_CHANNEL || '',
  ksbilgi: process.env.DISCORD_KSBILGI_CHANNEL || '',
  sunucular: process.env.DISCORD_SUNUCULAR_CHANNEL || '',
  // Default channel for notifications if category-specific channel is not set
  default: process.env.DISCORD_NOTIFICATION_CHANNEL || ''
};

// Bot configuration
export const BOT_CONFIG = {
  // Colors used in embeds
  colors: {
    success: 0x43B581, // Green
    info: 0x7289DA,    // Blue
    warning: 0xFAA61A, // Yellow
    error: 0xF04747,   // Red
    ally: 0x5865F2,    // Light blue
    enemy: 0xF04747,   // Red
    team: 0x43B581,    // Green
  },
  
  // Footer text for embeds
  footerText: 'Klan Yönetim Botu',
  
  // Enable or disable sending notifications to a channel
  sendNotifications: true,
};
