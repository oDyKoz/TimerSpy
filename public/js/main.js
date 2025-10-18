import { ConfigModal } from "./modules/ModalConfig.js";
import { DarkModeConfig } from "./modules/DarkMode.js";
import { setupTooltip } from "./modules/Tooltip.js";
import { setupPomodoro } from "./modules/Pomodoro/Pomodoro.js";
import { setupCountPomodoro } from "./modules/Pomodoro/CountPomo.js";
import { CustomAudioManager } from "./modules/ManagerAudio.js";


setupCountPomodoro();
ConfigModal();
DarkModeConfig();
setupTooltip();
setupPomodoro();

setupCustomAudio({
  inputSelector: '#customAlarmSound',
  feedbackSelector: '#audioFeedback',
  defaultSound: 'https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg?hl=pt-br',
  validationDelay: 800,
  allowedFormats: ['.mp3', '.ogg', '.wav', '.m4a', '.aac', '.flac']
});

// Log de inicialização (opcional)
console.log('✅ Aplicação inicializada com sucesso');
console.log('🎵 Audio Manager:', window.customAudioManager ? 'Ativo' : 'Inativo');