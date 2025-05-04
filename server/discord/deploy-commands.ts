import { REST, Routes } from 'discord.js';
import { commands } from './commands';

export async function deployCommands() {
  try {
    const token = process.env.DISCORD_TOKEN;
    const clientId = process.env.DISCORD_CLIENT_ID;
    
    if (!token || !clientId) {
      console.error('DISCORD_TOKEN veya DISCORD_CLIENT_ID çevre değişkeni ayarlanmamış!');
      return;
    }
    
    // Extract the command data for deployment
    const commandsData = commands.map(command => command.data.toJSON());
    
    // Create REST instance
    const rest = new REST({ version: '10' }).setToken(token);
    
    console.log(`${commandsData.length} komut yükleniyor...`);
    
    try {
      // Global commands deployment
      await rest.put(
        Routes.applicationCommands(clientId),
        { body: commandsData }
      );
      
      console.log('Komutlar başarıyla yüklendi!');
    } catch (error) {
      console.error('Komutlar yüklenirken hata oluştu:', error);
    }
  } catch (error) {
    console.error('Komutları dağıtırken hata:', error);
  }
}
