import  { 
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView
} from "react-native";

import type { ThemeType } from '@/contexts/types';


import { useTheme } from "@/contexts/ThemeContext"

import { useTranslation } from 'react-i18next';

import { useSettingsStore } from "@/store/useSettingsStore";
import { useHistoryStore } from "@/store/useHistoryStore";
import { useAchievementStore } from "@/store/useAchievementStore";


const createStyles = (theme: ThemeType) => StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 75
  },
  modalContent: {
    backgroundColor: theme.primaryColor,
    padding: 24,
    borderRadius: 16,
    width: '85%',
    // alignItems: 'center'
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: theme.textColor,
  },
  divider: {
    height: 1,
    backgroundColor: theme.textColor,
    opacity: 0.2,
    marginVertical: 20,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cancelButton: {
    backgroundColor: theme.secondaryColor,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  cancelButtonText: {
    color: theme.textColor,
    fontSize: 16,
    fontWeight: 'bold',
  },
  debugText: {
    color: theme.textColor,
    fontSize: 14,
  },
});

type DebugProps = {
  onClose: () => void;
  show?: boolean
}
const DebugModal = ({ onClose, show = false }: DebugProps) => {
  const historyState = useHistoryStore(state => state);
  const settingState = useSettingsStore(state => state);
  const achState = useAchievementStore(state => state);

  const { t } = useTranslation();

  const { theme } = useTheme();

  const handleCancel = () => {
    onClose();
  }

  const styles = createStyles(theme);


  return (
    <Modal
      visible={show}
      transparent={true}
      animationType="slide"
    >
      <ScrollView>
        <View style={styles.modalBackdrop}>
            <View style={styles.modalContent}>
              <Text style={styles.debugText}>{JSON.stringify({achState}, null, 2)}</Text>
              <Text style={styles.debugText}>{JSON.stringify({historyState}, null, 2)}</Text>
              <Text style={styles.debugText}>{JSON.stringify({settingState}, null, 2)}</Text>

              <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                <Text style={styles.cancelButtonText}>{t('text.cancel')}</Text>
              </TouchableOpacity>

            </View>
        </View>
        </ScrollView>
    </Modal>
  );
}


export default DebugModal;