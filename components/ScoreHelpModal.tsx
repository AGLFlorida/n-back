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
  text: {
    color: theme.textColor,
    fontSize: 14,
  },
});

type ScoreHelpProps = {
  onClose: () => void;
  show?: boolean
}
const ScoreHelpModal = ({ onClose, show = false }: ScoreHelpProps) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
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
              <Text style={styles.text}>{t("history.scoreHelpBody")}</Text>

              <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                <Text style={styles.cancelButtonText}>{t('ok')}</Text>
              </TouchableOpacity>

            </View>
        </View>
        </ScrollView>
    </Modal>
  );
}


export default ScoreHelpModal;