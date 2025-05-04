import { 
  Client, 
  GatewayIntentBits, 
  Events, 
  Collection
} from 'discord.js';
import { commands } from './commands';

// Create a new client instance
const client = new Client({ 
  intents: [
    GatewayIntentBits.Guilds
    // Removed MessageContent intent which requires special permissions
  ] 
});

// Extend the client to include commands
declare module 'discord.js' {
  interface Client {
    commands: Collection<string, any>;
  }
}

// Initialize commands collection
client.commands = new Collection();

// Add commands to collection
for (const command of commands) {
  client.commands.set(command.data.name, command);
}

// When the client is ready, run this code (only once)
client.once(Events.ClientReady, (readyClient) => {
  console.log(`Discord Bot hazır! ${readyClient.user.tag} olarak giriş yapıldı`);
});

// Interaction handler
client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;
  
  const command = client.commands.get(interaction.commandName);
  
  if (!command) {
    console.error(`${interaction.commandName} komutu bulunamadı.`);
    return;
  }
  
  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(`Komut çalıştırılırken hata oluştu: ${error}`);
    
    const replyOptions = {
      content: 'Bu komutu çalıştırırken bir hata oluştu!',
      ephemeral: true
    };
    
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(replyOptions);
    } else {
      await interaction.reply(replyOptions);
    }
  }
});

export async function startBot() {
  try {
    // Login to Discord with your client's token
    if (!process.env.DISCORD_TOKEN) {
      console.error('DISCORD_TOKEN çevre değişkeni ayarlanmamış!');
      return;
    }
    
    await client.login(process.env.DISCORD_TOKEN);
    console.log('Discord botu başlatıldı!');
  } catch (error) {
    console.error('Discord botuna giriş yapılamadı:', error);
  }
}

export { client };
