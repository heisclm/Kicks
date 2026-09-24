const fs = require('fs');
let file = 'mobile/app/(auth)/register.tsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('expo-haptics')) {
    content = content.replace(/import \{ useRouter \} from 'expo-router';/, "import { useRouter } from 'expo-router';\nimport * as Haptics from 'expo-haptics';");
}

const oldSuccess = `      if (error) {
        useToastStore.getState().showToast('Registration Failed', error.message, 'error');
      } else {
        useToastStore.getState().showToast('Success', 'Account created! Please log in.', 'success');
        router.back();
      }`;

const newSuccess = `      if (error) {
        useToastStore.getState().showToast('Registration Failed', error.message, 'error');
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert(
          "Verify Your Email ??",
          \`We've sent a verification link to \${email}.\\n\\nPlease check your inbox (and spam folder) to verify your account before logging in.\`,
          [
            {
              text: "I'll check it",
              style: "default",
              onPress: () => router.back(),
            }
          ]
        );
      }`;

content = content.replace(oldSuccess, newSuccess);
fs.writeFileSync(file, content, 'utf8');
